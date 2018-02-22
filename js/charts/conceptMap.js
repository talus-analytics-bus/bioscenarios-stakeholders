(() => {
	App.initConceptMap = (selector, eventName, rawData, stakeholderData) => {
		function convertOrgName(s) {
			/* Converts Org name to just it's abbreviation (if provided) */
			const abbrev = s.match(/\(([A-Za-z0-9 ]+)\)/);
			// if there's not a match, just return normal name
			if (abbrev === null) {
				return s;
			} else {
				return abbrev[1];
			}
		}

		/* FORMAT DATA */
		// get event data
		const data = rawData.filter(d => d['Timeline Event'].toLowerCase() === eventName.toLowerCase());

		const allOrgs = stakeholderData.map(d => {
			return {
				name: d['Stakeholder Name'],
				category: d['Organization Category'],
				abbrev: convertOrgName(d['Stakeholder Name']),
				role: d['Overall Role'],
			};
		});

		const allCategories = d3.nest()
			.key(d => d.category.toUpperCase())
			.entries(allOrgs)
			.map(d => d.key);

		const allPolicies = d3.nest()
			.key(d => d['Policy Document'])
			.entries(data)
			.map(d => d.key);

		const allUNOrgs = ['UN Organizations'].concat(
			allOrgs
				.filter(d => d.category.toUpperCase() === 'UN ORGANIZATIONS')
				.map(d => d.abbrev));

		const allNonUNOrgs = allOrgs
			.filter(d => !allUNOrgs.includes(d.abbrev))
			.sort((a, b) => a.category > b.category)
			.map(d => d.abbrev);

		/* CONSTANTS */
		const height = 1000;
		const width = 1.2 * height;
		const rectHeight = 40;
		const rectWidth = 300;

		const timelineEvents = ['Case in humans', ...new Set(rawData.map(d => {
			return d['Timeline Event'];
		}))];

		// these are the gradients behind the time line events.
		// these will be used in the policy documents and stakeholders graphic
		const timelineEventGradients = [
			['#f7f8fa', '#f4f6f9'],
			['#f4f6f9', '#e9ecf3'],
			['#e9ecf3', '#dfe2ed'],
			['#dfe2ed', '#d6dbe7'],
			['#d6dbe7', '#ced4e3'],
			['#ced4e3', '#c8cedf'],
			['#c8cedf', '#c1c9dc'],
			['#c1c9dc', '#bcc4d9'],
			['#bcc4d9', '#b5bed5'],
		];

		function getGradient(eventName) {
			let index = -1;
			let event = eventName.toLowerCase();

			if (event) {
				index = timelineEvents.findIndex(d => {
					return d.toLowerCase() === event;
				});

				if (index > (timelineEventGradients.length - 1)) {
					index = timelineEventGradients.length - 1;
				}
			}


			return index; // -1 is not found
		}

		/* COLOURS */
		//const titleColor = '#076eb5';
		const titleColor = '#000000';
		const rectColor = '#e6e6e5';
		const selectedRectColor = '#2d9de2';
		const rectTextColor = '#808080';
		const textColor = '#989898';
		const circleColor = '#cccbcb';
		const lineColor = '#cccbcb';

		/* SCALES */
		const innerRange = ((rectHeight / 2) + 3) * allPolicies.length;
		const innerNodesScale = d3.scaleBand()
			.domain(allPolicies)
			.range([-innerRange, innerRange]);

		const leftOrgsScale = d3.scaleBand()
			.domain(allUNOrgs)
			.range([-0.35 * height, 0.35 * height]);

		const leftOrgsCurve = (orgName) => {
			const xScale = d3.scaleBand()
				.domain(allUNOrgs)
				.range([-6, 6]);
			const x = xScale(orgName);
			return (x * x) - (0.3 * width);
		};

		const rightOrgsScale = d3.scaleBand()
			.domain(allNonUNOrgs)
			.range([-0.35 * height, 0.35 * height]);

		const rightOrgsCurve = (orgName) => {
			const xScale = d3.scaleBand()
				.domain(allNonUNOrgs)
				.range([-8, 8]);
			const x = xScale(orgName);
			return -(x * x) + (0.35 * width);
		};

		/* LINES */
		const line = d3.line()
			.curve(d3.curveBasis)
			.x(d => d.x)
			.y(d => d.y);

		/* PLOTTING */
		// define graph
		const chart = d3.select(selector)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${3 * width / 8},${height / 2})`);

		const defs = chart.append('defs');
		timelineEventGradients.forEach((item, index, array) => {
			let gradient = defs.append('linearGradient')
				.attr('id', `timeline-gradient-${index}`)
				.attr('x1', '0%')
				.attr('x2', '100%')
				.attr('y1', '0%')
				.attr('y2', '0%');

			gradient.append('stop')
				.attr('stop-color', item[1])
				.attr('stop-opacity', 1)
				.attr('offset', '0%');

			gradient.append('stop')
				.attr('stop-color', item[0])
				.attr('stop-opacity', 178 / 255)
				.attr('offset', '100%');
		});

		// add event title
		chart.append('g').attr('class', 'main-title')
			.append('text')
			.attr('x', 25)
			.attr('y', -470)
			.attr('dy', 0.35)
			.attr('text-anchor', 'middle')
			.style('font-size', '18px')
			.style('font-weight', '600')
			.style('fill', titleColor)
			.text(eventName.toUpperCase())
			.call(wrap, 340);

		// Inner Nodes
		const rectGroup = chart.append('g')
			.selectAll('g')
			.data(allPolicies)
			.enter()
			.append('g');

		let gradientIndex = getGradient(eventName);
		rectGroup.append('rect')
			.attr('transform', 'translate(10)')
			.attr('x', -rectWidth / 2)
			.attr('y', innerNodesScale)
			.attr('height', rectHeight)
			.attr('width', rectWidth)
			.style('fill', (d, i) => `url(#timeline-gradient-${gradientIndex})`)
			.attr('value', d => `rect ${d}`)
			.on('mouseover', mouseoverRect)
			.on('mouseout', mouseoutRect);

		rectGroup.append('text')
			.attr('x', 0)
			.attr('y', d => innerNodesScale(d) + (rectHeight / 2))
			.style('fill', rectTextColor)
			.style('text-anchor', 'middle')
			.style('font-size', '0.75em')
			.attr('value', d => `recttext ${d}`)
			.html(d => {
				const wrapped = wordWrap(d, rectWidth / 6, 0, innerNodesScale(d) + (rectHeight / 2));
				if (wrapped.split('tspan').length === 7) {  // if there are 3 lines of text, shift it lower
					const newWrapped = wordWrap(d, rectWidth / 6, 0, innerNodesScale(d) + (rectHeight / 2) + 6);
					return newWrapped;
				} else {
					return wrapped;
				}
			})
			.on('mouseover', mouseoverRect)
			.on('mouseout', mouseoutRect);

		function mouseoverRect(d) {
			d3.select(`[value="recttext ${d}"`).style('fill', 'black');
			d3.select(`[value="recttext ${d}"`).style('font-size', '0.75em');
			// when you mouse over a rectangle, make the font slightly more heavily weighted for emphasis
			d3.select(`[value="recttext ${d}"`).style('font-weight', '500');
			d3.select(`[value="rect ${d}"]`).style('fill', selectedRectColor);
			d3.selectAll(`[end="${d}"]`).style('stroke', selectedRectColor);

			d3.selectAll(`[end="${d}"]`).each(function() {
				const circleName = d3.select(this).attr('start');
				d3.selectAll(`[value="${circleName}"]`).style('fill', selectedRectColor);
			});
		}

		function mouseoutRect(d, i) {
			d3.select(`[value="recttext ${d}"`).style('fill', rectTextColor);
			d3.select(`[value="recttext ${d}"`).style('font-size', '0.75em');
			d3.select(`[value="recttext ${d}"`).style('font-weight', '300');
			d3.select(`[value="rect ${d}"]`).style('fill', `url(#timeline-gradient-${gradientIndex})`);
			d3.selectAll(`[end="${d}"]`).style('stroke', lineColor);

			d3.selectAll(`[end="${d}"]`).each(function() {
				const circleName = d3.select(this).attr('start');
				d3.selectAll(`[value="${circleName}"]`).style('fill', 'white');
			});
		}

		const leftGroup = chart.append('g')
			.attr('class', 'left-group')
			.selectAll('g')
			.data(['UN Organizations', ...allOrgs.filter(d => allUNOrgs.includes(d.abbrev))])
			.enter();

		leftGroup.append('g')
			.append('text')
			.attr('x', d => leftOrgsCurve(d.abbrev || d))
			.attr('y', d => leftOrgsScale(d.abbrev || d))
			.style('fill', d => (d.abbrev === undefined) ? 'black' : textColor)
			.style('text-anchor', 'end')
			.text(d => d.abbrev || d)
			.style('font-weight', d => (d.abbrev === undefined) ? 600 : 300)
			.each(function (d) {
				if (d === 'UN Organizations') {
					return;
				}
				const content = `<b>${d.name}</b> <br> Overall Role: ${d.role}`;
				return $(this).tooltipster({
					content: content,
					trigger: 'hover',
					side: 'left',
				});
			});

		const leftCircles = leftGroup.append('g');

		leftCircles.append('circle')
			.attr('cx', d => leftOrgsCurve(d.abbrev) + 10)
			.attr('cy', d => leftOrgsScale(d.abbrev) - 5)
			.attr('r', d => (d.abbrev === undefined) ? 0 : 5.2)
			.attr('value', d => d.abbrev)
			.style('fill', 'white')
			.style('fill-opacity', 1)
			.style('stroke', circleColor)
			.style('stroke-width', 2);

		const rightGroup = chart.append('g')
			.selectAll('g')
			.data(allOrgs.filter(d => allNonUNOrgs.includes(d.abbrev)))
			.enter();

		rightGroup.append('g').attr('class', 'right-group')
			.append('text')
			.attr('x', d => rightOrgsCurve(d.abbrev))
			.attr('y', d => rightOrgsScale(d.abbrev))
			.style('fill', textColor)
			.style('text-anchor', 'start')
			.text(d => d.abbrev)
			.each(function (d) {
				const content = `<b>${d.name} </b><br> Overall Role: ${d.role}`;
				return $(this).tooltipster({
					content: content,
					trigger: 'hover',
					side: 'right',
				});
			});

		const rightCircles = rightGroup.append('g');

		rightCircles.append('circle')
			.attr('cx', d => rightOrgsCurve(d.abbrev) - 10)
			.attr('cy', d => rightOrgsScale(d.abbrev) - 5)
			.attr('r', d => (d.abbrev === undefined) ? 0 : 5.2)
			.attr('value', d => d.abbrev)
			.style('fill', 'white')
			.style('fill-opacity', 1)
			.style('stroke', circleColor)
			.style('stroke-width', 2);

		// Time to draw lines
		const lineGroup = chart.append('g')
			.selectAll('path')
			.data(data.map(d => {
				d.abbrev = convertOrgName(d['Policy Stakeholder']);
				return d;
			}))
			.enter()
			.append('path')
			.attr('d', d => {
				let xscale;
				let yscale;
				let sign;
				if (allUNOrgs.includes(d.abbrev)) {
					yscale = leftOrgsScale;
					xscale = leftOrgsCurve;
					sign = -1;
				} else {
					yscale = rightOrgsScale;
					xscale = rightOrgsCurve;
					sign = 1;
				}
				const startx = xscale(d.abbrev) - (sign * 13);
				const starty = yscale(d.abbrev) - 5;
				const endx = sign * rectWidth / 2 + 10;
				const endy = innerNodesScale(d['Policy Document']) + (rectHeight / 2);
				return line([
					{
						x: startx,
						y: starty,
					},
					{
						x: startx + (-sign * 60),
						y: starty,
					},
					{
						x: endx + (sign * 60),
						y: endy,
					},
					{
						x: endx,
						y: endy,
					},
				]);
			})
			.attr('start', d => d.abbrev)
			.attr('end', d => d['Policy Document'])
			.style('fill-opacity', 0)
			.style('stroke', lineColor)
			.style('stroke-width', '2')
			.style('stroke-opacity', 0.5);
	};
})();
