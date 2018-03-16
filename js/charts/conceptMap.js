(() => {
	App.initConceptMap = (selector, eventName, rawData, stakeholderData, policyData) => {
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

		var docs = {};
		policyData.forEach(function (element) {
			docs[element['Policy Document Name']] = element['Primary Reference Link'];
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

		const noLinks = [
			'National regulations and policies',
			'Local regulations and policies',
			'Organization-specific mandates',
		];

		var nonUNTitles = [
			{
				category: 'Affected Member State',
			},
			{
				category: 'Non-affected Member States',
			},
			{
				category: 'Non-UN International Organizations',
			},
			{
				category: 'NGOs',
			},
			{
				category: 'Private Sector',
			},
		];
		const allNonUNOrgs = allOrgs.concat(nonUNTitles)
			.filter(d => !allUNOrgs.includes(d.abbrev))
			.sort((a, b) => {
				// So for some reason this is sorting differently in Firefox vs. Chrome
				// Expanding to use defs in
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
				//  Referring to a's order in relation to b
				//     -1 means a before b
				//     +1 means a after b
				//     0 means same level
				// We're just trying to do a hierarchical sort here
				let sortVal;
				const aBeforeB = -1;
				const bBeforeA = 1;
				const aSameAsB = 0;
				if (a.category.toLowerCase() === b.category.toLowerCase()) {
					// First check if the categories are the same
					if (a.abbrev === undefined) {
						sortVal = aBeforeB;
					} else if (b.abbrev === undefined) {
						sortVal = bBeforeA;
					} else {
						// Otherwise, sort alphabetically on the abbreviations
						if (a.abbrev.toLowerCase() < b.abbrev.toLowerCase()) {
							sortVal = aBeforeB;
						} else {
							sortVal = bBeforeA;
						}
					}
				} else {
					// if the categories are not the same, simply sort on that category
					// (a < b) based on criteria
					if (a.category.toLowerCase() < b.category.toLowerCase()) {
						sortVal = aBeforeB;
					} else {
						sortVal = bBeforeA;
					}
				}
				return sortVal;
			})
			.map(d => d.abbrev || d.category);

		nonUNTitles = nonUNTitles.map(d => d.category);

		/* CONSTANTS */
		const height = 1000;
		const width = 1.2 * height;
		const rectHeight = 40;
		const rectWidth = 400;
		const columnTopSpacing = 50;
		const innerNodeTextSize = '0.8em';

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
		// const selectedRectColor = '#2d9de2';
		const selectedRectColor = '#94A0C3';
		const selectedLineColor = 'black';
		// const rectTextColor = '#808080';
		const rectTextColor = '#000000';
		const textColor = '#6c6d6d';
		const circleColor = '#cccbcb';
		const lineColor = '#cccbcb';

		/* SCALES */
		const innerRange = ((rectHeight / 2) + 3) * allPolicies.length;
		const topAnchor = (-height / 2) + columnTopSpacing;

		const innerTop = topAnchor;
		const innerBottom = topAnchor + ((rectHeight + 5) * allPolicies.length);

		const innerShift = Math.max(0, -20 * allPolicies.length + 275);

		const innerNodesScale = d3.scaleBand()
			.domain(allPolicies)
			.range([innerTop + innerShift, innerBottom + innerShift]);

		const leftOrgsScale = d3.scaleBand()
			.domain(allUNOrgs)
			.range([(-width / 2) + 150, 0.15 * height]);

		const leftOrgsCurve = (orgName) => {
			const xScale = d3.scaleBand()
				.domain(allUNOrgs)
				.range([-6, 6]);
			const x = xScale(orgName);
			return (x * x) - (0.3 * width);
		};

		const rightOrgsScale = d3.scaleBand()
			.domain(allNonUNOrgs)
			.range([(-width / 2) + 150, 0.4 * height]);

		const rightOrgsCurve = (orgName) => {
			const xScale = d3.scaleBand()
				.domain(allNonUNOrgs)
				.range([-6, 6]);
			const x = xScale(orgName);
			return -(x * x) + (0.35 * width);
		};

		/* LINES */
		const line = d3.line()
			.curve(d3.curveBasis)
			.x(d => d.x)
			.y(d => d.y);


		// Clear the previous SVG (if any)
		var svg = d3.select(selector).select('svg').remove();

		/* PLOTTING */
		// define graph
		const chart = d3.select(selector)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g').attr('class', 'concept-map-container')
			.attr('transform', `translate(${3 * width / 8}, ${height / 2})`);

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
		const titleGroup = chart.append('g')
			.attr('class', 'main-title')
			.attr('transform', `translate(25, ${topAnchor - 10})`);

		titleGroup.append('text')
			.attr('text-anchor', 'middle')
			.style('font-size', '20px')
			.style('font-weight', '600')
			.style('fill', titleColor)
			.text(eventName.toUpperCase());

		titleGroup.append('text')
			.attr('text-anchor', 'middle')
			.style('font-size', '17px')
			.style('fill', titleColor)
			.style('fill-opacity', 0.5)
			.attr('transform', 'translate(0, -22)')
			.text('POLICIES ASSOCIATED WITH');

		// Inner Nodes
		const rectGroup = chart.append('g')
			.selectAll('g')
			.data(allPolicies)
			.enter()
			.append('g');

		let gradientIndex = getGradient(eventName);
		rectGroup.append('rect')
			.attr('transform', 'translate(25)')
			.attr('x', -rectWidth / 2)
			.attr('y', innerNodesScale)
			.attr('height', rectHeight)
			.attr('width', rectWidth)
			.style('fill', (d, i) => `url(#timeline-gradient-${gradientIndex})`)
			.attr('value', d => `rect ${d}`)
			.on('mouseover', mouseoverRect)
			.on('mouseout', mouseoutRect);

		rectGroup.append('text')
			.attr('transform', 'translate(25)')
			.attr('x', 0)
			.attr('y', d => innerNodesScale(d) + (rectHeight / 2))
			.style('fill', rectTextColor)
			.style('text-anchor', 'middle')
			.style('font-size', innerNodeTextSize)
			.attr('value', d => `recttext ${d}`)
			.html(d => {
				const textWidth = 50;
				const wrapped = wordWrap(
					d,
					textWidth,
					0,
					innerNodesScale(d) + (rectHeight / 2) + 5,
					i => `${i * 1.1}em`);

				const numLines = wrapped.split('<tspan').length - 1;

				if (numLines > 1) {
					const newWrapped = wordWrap(
						d,
						textWidth,
						0,
						innerNodesScale(d) + (rectHeight / 2) - 2,
						i => `${i * 1.1}em`);
					return newWrapped;
				}

				return wrapped;
			})
			.on('mouseover', mouseoverRect)
			.on('mouseout', mouseoutRect);

		rectGroup.append('image')
			.attr('x', rectWidth / 2 - 5)
			.attr('y', d => innerNodesScale(d) + 8)
			.attr('width', 20)
			.attr('height', 24)
			.attr('xlink:href', function (d) {
				if (noLinks.includes(d) === false) {
					return '../../img/white.svg';
				}
			})
			.attr('value', d => `icon ${d}`)
			.on('mouseover', mouseoverRect)
			.on('mouseout', mouseoutRect)
			.on('click', function (d) {
				if (noLinks.includes(d) === false) {
					const win = window.open(docs[d], '_blank');
					if (win) {
						win.focus();
					}
				}
			})
			.each(function (d, i) {
				if (noLinks.includes(d) === false) {
					const content = `<h4 style=font-weight:600>${d}</h4>` +
						`<br><a href="${docs[d]}" target="_blank">View Policy Document</a>`;
					return $(this).tooltipster({
						content: content,
						contentAsHTML: true,
						trigger: 'hover',
						side: 'right',
						interactive: true,
						trackTooltip: true,
					});
				}
			});

		function mouseoverRect(d) {
			if (noLinks.includes(d) === false) {
				// change doc icon to blue when hovered over
				d3.select(`[value='icon ${d}'`).attr('xlink:href', '../../img/blue.svg');
			}
			d3.select(`[value='recttext ${d}'`).style('fill', 'black');
			// when you mouse over a rectangle, make the font slightly more heavily weighted for emphasis
			d3.select(`[value='recttext ${d}'`).style('font-weight', '500');
			d3.select(`[value='rect ${d}']`).style('fill', selectedRectColor);
			d3.selectAll('.connecting-line')
				.sort((a, b) => {
					if (a['Policy Document'].toUpperCase() === d.toUpperCase()) {
						return 1;
					} else {
						return -1;
					}
				});
			d3.selectAll(`[end='${d}']`).style('stroke', selectedLineColor);

			d3.selectAll(`[end='${d}']`).each(function () {
				const circleName = d3.select(this).attr('start');
				d3.selectAll(`[value='${circleName}']`).style('fill', selectedLineColor);
			});
		}

		function mouseoutRect(d, i) {
			if (noLinks.includes(d) === false) {
				d3.select(`[value='icon ${d}'`).attr('xlink:href', '../../img/white.svg');
			}
			d3.select(`[value='recttext ${d}'`).style('fill', rectTextColor);
			// d3.select(`[value='recttext ${d}'`).style('font-weight', '300');
			d3.select(`[value='rect ${d}']`).style('fill', `url(#timeline-gradient-${gradientIndex})`);
			d3.selectAll(`[end='${d}']`).style('stroke', lineColor);

			d3.selectAll(`[end='${d}']`).each(function () {
				const circleName = d3.select(this).attr('start');
				d3.selectAll(`[value='${circleName}']`).style('fill', 'white');
			});
		}

		// EDGE NODES
		// LEFT
		const leftGroup = chart.append('g')
			.attr('class', 'left-group')
			.selectAll('g')
			.data(['UN Organizations', ...allOrgs.filter(d => allUNOrgs.includes(d.abbrev))])
			.enter()
			.append('g')
			.on('mouseover', mouseoverOrg)
			.on('mouseout', mouseoutOrg);

		leftGroup.append('g')
			.append('text')
			.attr('x', d => {
				let value = 0;

				if (d.abbrev === undefined) {
					value = 18; // this is a label, pull the label in by the offset px
				}
				return leftOrgsCurve(d.abbrev || d) + value;
			})
			.attr('y', d => leftOrgsScale(d.abbrev || d))
			.style('fill', d => (d.abbrev === undefined) ? 'black' : textColor)
			.style('text-anchor', 'end')
			.text(d => (d.abbrev === undefined) ? d.toUpperCase() : d.abbrev)
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
			.attr('class', 'right-group')
			.selectAll('g')
			.data(nonUNTitles.concat(allOrgs.filter(d => allNonUNOrgs.includes(d.abbrev))))
			.enter()
			.append('g')
			.on('mouseover', mouseoverOrg)
			.on('mouseout', mouseoutOrg);

		rightGroup.append('g')
			.append('text')
			.attr('x', d => {
				let value = 0;

				if (d.abbrev === undefined) {
					value = 18; // this is a label, pull the label in by the offset px
				}
				return rightOrgsCurve(d.abbrev || d) - value;
			})
			.attr('y', d => rightOrgsScale(d.abbrev || d))
			.style('fill', d => (d.abbrev === undefined) ? 'black' : textColor)
			.style('font-weight', d => (d.abbrev === undefined) ? 600 : 300)
			.style('text-anchor', 'start')
			.text(d => (d.abbrev === undefined) ? d.toUpperCase() : d.abbrev)
			.each(function (d) {
				if (nonUNTitles.includes(d)) {
					return;
				}
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

		// ORG MOUSE EVENTS
		function mouseoverOrg(d) {
			d3.select(`[value='${d.abbrev}']`).style('fill', 'black');
			d3.selectAll(`[start='${d.abbrev}']`).style('stroke', selectedLineColor);
			d3.selectAll(`[start='${d.abbrev}']`).each(function () {
				const policyName = d3.select(this).attr('end');
				d3.selectAll(`[value='rect ${policyName}']`).style('fill', selectedRectColor);
				d3.selectAll(`[value='recttext ${policyName}']`).style('fill', 'black');
			});

			d3.selectAll('.connecting-line')
				.sort((a, b) => {
					if (d.name === undefined) {
						return 0;
					}
					if (a['Policy Stakeholder'].toUpperCase() === d.name.toUpperCase()) {
						return 1;
					} else {
						return -1;
					}
				});
		}

		function mouseoutOrg(d) {
			d3.select(`[value='${d.abbrev}']`).style('fill', 'white');
			d3.selectAll(`[start='${d.abbrev}']`).style('stroke', lineColor);
			d3.selectAll(`[start='${d.abbrev}']`).each(function () {
				const policyName = d3.select(this).attr('end');
				d3.selectAll(`[value='rect ${policyName}']`).style('fill', `url(#timeline-gradient-${gradientIndex})`);
				d3.selectAll(`[value='recttext ${policyName}']`).style('fill', textColor);
			});
		}


		// LINES
		const lineGroup = chart.append('g')
			.selectAll('path')
			.data(data.map(d => {
				d.abbrev = convertOrgName(d['Policy Stakeholder']);
				return d;
			}))
			.enter()
			.append('path')
			.attr('class', 'connecting-line')
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
				const startx = xscale(d.abbrev) - (sign * 15);
				const starty = yscale(d.abbrev) - 5;
				const endx = sign * rectWidth / 2 + 25;
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
