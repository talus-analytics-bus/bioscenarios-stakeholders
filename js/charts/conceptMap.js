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



		const includedOrgs = data.map(d => d['Policy Stakeholder'].toLowerCase());

		const allOrgs = stakeholderData.map(d => {
			return {
				name: d['Stakeholder Name'],
				category: d['Organization Category'],
				abbrev: convertOrgName(d['Stakeholder Name']),
				role: d['Overall Role'],
			};
		}).filter(d => includedOrgs.includes(d.name.toLowerCase()));

		const allCategories = d3.nest()
			.key(d => d.category.toUpperCase())
			.entries(allOrgs)
			.map(d => d.key);

		const allPolicies = d3.nest()
			.key(d => d['Policy Document'])
			.entries(data)
			.map(d => d.key);

		const allUNOrgs = allOrgs
			.filter(d => d.category.toUpperCase() === 'UN ORGANIZATION')
			.map(d => d.abbrev);

		const allNonUNOrgs = allOrgs
			.filter(d => d.category.toUpperCase() !== 'UN ORGANIZATION')
			.map(d => d.abbrev);

		/* CONSTANTS */
		const height = 1000;
		const width = 1.2 * height;
		const rectHeight = 50;
		const rectWidth = 200;

        const timelineEvents = ['Case in humans', ...new Set(rawData.map(d => {return d['Timeline Event'];}))];

        // these are the gradients behind the time line events. these will be used in the policy documents and stakeholders graphic
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
            if (eventName) {
				index = timelineEvents.findIndex(d => {
                    return d === eventName;
                });
            }

            return index; // -1 is found
		}

		const leftCircleRadius = width / 2;
		const rightCircleRadius = 5 * width / 8;

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
		const innerNodesScale = d3.scaleBand()
			.domain(allPolicies)
			.range([-0.4 * height, 0.4 * height]);

		const leftOrgsScale = d3.scaleBand()
			.domain(allUNOrgs)
			.range([-0.35 * height, 0.35 * height]);

		const rightOrgsScale = d3.scaleBand()
			.domain(allNonUNOrgs)
			.range([-0.35 * height, 0.35 * height]);

		const leftCircle = d3.arc()
			.innerRadius(leftCircleRadius)
			.outerRadius(leftCircleRadius)
			.startAngle(-(1 / 4) * Math.PI)
			.endAngle(-(3 / 4) * Math.PI);

		const rightCircle = d3.arc()
			.innerRadius(rightCircleRadius)
			.outerRadius(rightCircleRadius)
			.startAngle((1 / 4) * Math.PI)
			.endAngle((3 / 4) * Math.PI);

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
        timelineEventGradients.forEach( (item, index, array) => {
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
		// chart.append('path')
		// 	.attr('transform', `translate(${width / 4})`)
		// 	.attr('d', leftCircle)
		// 	.style('stroke', 'red');
		//
		// chart.append('path')
		// 	.attr('transform', `translate(-${width / 3})`)
		// 	.attr('d', rightCircle)
		// 	.style('stroke', 'red');

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
			.html(d => wordWrap(d, rectWidth / 6, 0, innerNodesScale(d) + (rectHeight / 2)))
			.on('mouseover', mouseoverRect)
			.on('mouseout', mouseoutRect);

		function mouseoverRect(d) {
			d3.select(`[value="recttext ${d}"`).style('fill', 'black');
			d3.select(`[value="recttext ${d}"`).style('font-size', '0.75em');
			// when you mouse over a rectangle, make the font slightly more heavily weighted for emphasis
			d3.select(`[value="recttext ${d}"`).style('font-weight', '500');
			d3.select(`[value="rect ${d}"]`).style('fill', selectedRectColor);
			d3.selectAll(`[end="${d}"]`).style('stroke', selectedRectColor);
		}

		function mouseoutRect(d) {
			d3.select(`[value="recttext ${d}"`).style('fill', rectTextColor);
			d3.select(`[value="recttext ${d}"`).style('font-size', '0.75em');
			d3.select(`[value="recttext ${d}"`).style('font-weight', '300');
			d3.select(`[value="rect ${d}"]`).style('fill', rectColor);
			d3.selectAll(`[end="${d}"]`).style('stroke', lineColor);
		}

		const leftGroup = chart.append('g')
			.selectAll('g')
			.data(allOrgs.filter(d => d.category.toUpperCase() === 'UN ORGANIZATION'))
			.enter();

		leftGroup.append('g')
			.append('text')
			.attr('x', d => -0.26 * width)
			.attr('y', d => leftOrgsScale(d.abbrev))
			.style('fill', textColor)
			.style('text-anchor', 'end')
			.text(d => d.abbrev)
			.each(function(d) {
				const content = `<b>${d.name}</b> <br> Overall Role: ${d.role}`;
				return $(this).tooltipster({
					content: content,
					trigger: 'hover',
					side: 'left',
				});
			});

		const leftCircles  = leftGroup.append('g')
			.attr('transform', d => `translate(${-0.25 * width}, ${leftOrgsScale(d.abbrev) - 5})`);

		leftCircles.append('circle')
			.attr('r', 5.2)
			.attr('value', d => d.abbrev)
			.style('fill', circleColor);

		leftCircles.append('circle')
			.attr('r', 3)
			.classed('center-circle', true)
			.attr('value', d => d.abbrev)
			.style('fill', 'white');

		const rightGroup = chart.append('g')
			.selectAll('g')
			.data(allOrgs.filter(d => d.category.toUpperCase() !== 'UN ORGANIZATION'))
			.enter();

		rightGroup.append('g')
			.append('text')
			.attr('x', 0.26 * width)
			.attr('y', d => rightOrgsScale(d.abbrev))
			.style('fill', textColor)
			.style('text-anchor', 'start')
			.text(d => d.abbrev)
			.each(function(d) {
				const content = `<b>${d.name} </b><br> Overall Role: ${d.role}`;
				return $(this).tooltipster({
					content: content,
					trigger: 'hover',
					side: 'right',
				});
			});

		const rightCircles = rightGroup.append('g')
			.attr('transform', d => `translate(${0.25 * width}, ${rightOrgsScale(d.abbrev) - 5})`);

		rightCircles.append('circle')
			.attr('r', 5.2)
			.attr('value', d => d.abbrev)
			.style('fill', circleColor);

		rightCircles.append('circle')
			.attr('r', 3)
			.classed('center-circle', true)
			.attr('value', d => d.abbrev)
			.style('fill', 'white');


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
				let scale;
				let sign;
				if (allUNOrgs.includes(d.abbrev)) {
					scale = leftOrgsScale;
					sign = -1;
				} else {
					scale = rightOrgsScale;
					sign = 1;
				}
				const startx = sign * 0.245 * width;
				const starty = scale(d.abbrev) - 5;
				const endx = sign * rectWidth / 2;
				const endy = innerNodesScale(d['Policy Document']) + (rectHeight / 2);
				return line([
					{
						x: startx,
						y: starty,
					},
					{
						x: startx + (-sign * 75),
						y: starty,
					},
					{
						x: endx + (sign * 75),
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

		// TODO use this func below to define our bezier points
		//define bezier curve from inner to outer nodes
		function diagonal(d) {
			return 'M' + String(-d.outer.y * Math.sin(projectX(d.outer.x))) + ',' + String(d.outer.y * Math.cos(projectX(d.outer.x)))
				+ ' ' + 'C'
				+ ' ' + String((-d.outer.y * Math.sin(projectX(d.outer.x)) + (d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width)) / 2) + ',' + String(d.outer.y * Math.cos(projectX(d.outer.x)))
				+ ' ' + String((-d.outer.y * Math.sin(projectX(d.outer.x)) + (d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width)) / 2) + ',' + String(d.inner.y + rect_height / 2)
				+ ' ' + String(d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width) + ',' + String(d.inner.y + rect_height / 2);
		}


		// var outer = d3.map();
		// var inner = [];
		// var links = [];
		//
		// var outerId = [0];
		//
		// //format the data
		// data.forEach(function (d) {
		// 	if (d == null)
		// 		return;
		//
		// 	i = {id: 'i' + inner.length, name: d.Task, related_links: []};
		// 	i.related_nodes = [i.id];
		// 	inner.push(i);
		// 	if (typeof d.Stakeholders == 'string') {
		// 		d.Stakeholders = JSON.parse(d.Stakeholders);
		// 	}
		// 	;
		//
		//
		// 	d.Stakeholders.forEach(function (d1) {
		//
		// 		o = outer.get(d1);
		//
		// 		if (o == null) {
		// 			o = {name: d1, id: 'o' + outerId[0], related_links: []};
		// 			o.related_nodes = [o.id];
		// 			outerId[0] = outerId[0] + 1;
		//
		// 			outer.set(d1, o);
		// 		}
		//
		// 		// create the links
		// 		l = {id: 'l-' + i.id + '-' + o.id, inner: i, outer: o}
		// 		links.push(l);
		//
		// 		// and the relationships
		// 		i.related_nodes.push(o.id);
		// 		i.related_links.push(l.id);
		// 		o.related_nodes.push(i.id);
		// 		o.related_links.push(l.id);
		// 	});
		// });
		//
		// inner.splice(0, 3); //get rid of inner nodes genereated from added outer nodes
		// links.splice(0, total); //get rid of nonexistant links to outer nodes
		//
		// data = {
		// 	inner: inner,
		// 	outer: outer.values(),
		// 	links: links
		// }
		//
		// outer = data.outer;
		// data.outer = Array(outer.length);
		//
		// var i1 = 0;
		// var i2 = outer.length - 1;
		//
		// // place outer nodes around the outer circle
		// for (var i = 0; i < data.outer.length; ++i) {
		// 	if (i <= 25) { //putting UN organizations on the left
		// 		data.outer[i2--] = outer[i];
		// 	} else {
		// 		data.outer[i1++] = outer[i];
		// 	}
		// }
		//
		// var rect_width = 250;
		// var rect_height = 100;
		//
		// var il = data.inner.length;
		// var ol = data.outer.length;
		//
		// var inner_y = d3.scaleLinear()
		// 	.domain([0, il])
		// 	.range([-(il * rect_height) / 2, (il * rect_height) / 2]);
		//
		// var outer_x_UN = d3.scaleLinear()
		// 	.domain([0, 26])
		// 	.range([50, 135]); //sets how spread out outer nodes on the left will be
		//
		// var outer_x_non = d3.scaleLinear()
		// 	.domain([26, data.outer.length])
		// 	.range([215, 320]); //sets how spread out outer nodes on the right will be
		//
		// var outer_y = d3.scaleLinear()
		// 	.domain([0, data.outer.length])
		// 	.range([0, diameter / 2 - 120]);
		//
		// // setup positioning
		// data.outer = data.outer.map(function (d, i) {
		// 	if (i <= total - 27) {
		// 		d.x = outer_x_UN(i);
		// 	} else {
		// 		d.x = outer_x_non(i);
		// 	}
		// 	;
		// 	d.y = diameter / 3;
		// 	return d;
		// });
		//
		// //set coordinates for inner nodes
		// data.inner = data.inner.map(function (d, i) {
		// 	d.x = -(rect_width / 2);
		// 	d.y = inner_y(i);
		// 	return d;
		// });
		//
		// function projectX(x) {
		// 	return ((x - 90) / 180 * Math.PI) - (Math.PI / 2);
		// }
		//
		//
		// // add links
		// var link = svg.append('g').attr('class', 'links').selectAll('.link')
		// 	.data(data.links)
		// 	.enter().append('path')
		// 	.attr('class', 'link')
		// 	.attr('d', diagonal)
		// 	.attr('id', function (d) {
		// 		return d.id
		// 	})
		// 	.attr('fill', 'none')
		// 	.style('stroke-width', '1px')
		// 	.style('stroke', '#e5e5e5');
		//
		//
		// // outer nodes
		// var onode = svg.append('g').selectAll('.outer_node')
		// 	.data(data.outer)
		// 	.enter().append('g')
		// 	.attr('class', 'outer_node')
		// 	.attr('transform', function (d) {
		// 		return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
		// 	})
		// 	.on('mouseover', mouseover)
		// 	.on('mouseout', mouseout);
		//
		// function circle_color(d) {
		// 	if (titles.includes(d.name)) {
		// 		return 'white' // no circle for nodes representing titles
		// 	} else {
		// 		return '#e8e8e8'
		// 	}
		// };
		// onode.append('circle')
		// 	.attr('id', function (d) {
		// 		return d.id
		// 	})
		// 	.style('fill', circle_color)
		// 	.attr('r', 5.2);
		//
		// function outer_color(d) {
		// 	if (titles.includes(d.name)) {
		// 		return 'black' // style nodes representing titles
		// 	} else {
		// 		return '#c1c1c1'
		// 	}
		// };
		//
		// function outer_dec(d) {
		// 	if (titles.includes(d.name)) {
		// 		return 'underline' // style nodes representing titles
		// 	} else {
		// 		return 'none'
		// 	}
		// };
		//
		// function outer_style(d) {
		// 	if (titles.includes(d.name)) {
		// 		return 'italic' // style nodes representing titles
		// 	} else {
		// 		return 'none'
		// 	}
		// };
		//
		// function outer_size(d) {
		// 	if (titles.includes(d.name)) {
		// 		return 19 // style nodes representing titles
		// 	} else {
		// 		return 16
		// 	}
		// };
		// onode.append('text')
		// 	.attr('id', function (d) {
		// 		return d.id + '-txt';
		// 	})
		// 	.attr('dy', '.31em')
		// 	.attr('text-anchor', function (d) {
		// 		return d.x < 180 ? 'start' : 'end';
		// 	})
		// 	.attr('transform', function (d) {
		// 		return d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)';
		// 	})
		// 	.attr('fill', outer_color)
		// 	.attr('font-size', outer_size)
		// 	.attr('text-decoration', outer_dec)
		// 	.attr('font-style', outer_style)
		// 	.text(function (d) {
		// 		return d.name;
		// 	});
		//
		// // inner nodes
		// var inode = svg.append('g').selectAll('.inner_node')
		// 	.data(data.inner)
		// 	.enter().append('g')
		// 	.attr('class', 'inner_node')
		// 	.attr('transform', function (d, i) {
		// 		return 'translate(' + d.x + ',' + d.y + ')'
		// 	})
		// 	.on('mouseover', mouseover)
		// 	.on('mouseout', mouseout);
		// // large inner node rectangles
		// inode.append('rect')
		// 	.attr('width', rect_width)
		// 	.attr('height', rect_height)
		// 	.attr('id', function (d) {
		// 		return d.id;
		// 	})
		// 	.attr('fill', '#e8e8e8');
		// // add white rectangles between inner node rectangles to put space between them
		// inode.append('rect')
		// 	.attr('width', rect_width + 2)
		// 	.attr('height', 21)
		// 	.attr('transform', 'translate(-1, -1)')
		// 	.style('fill', '#ffffff');
		//
		// inode.append('text')
		// 	.attr('id', function (d) {
		// 		return d.id + '-txt';
		// 	})
		// 	.attr('text-anchor', 'middle')
		// 	.attr('transform', 'translate(' + rect_width / 2 + ', ' + rect_height * .75 + ')')
		// 	.attr('fill', '#4f4f4f')
		// 	.attr('font-size', 16)
		// 	.attr('dy', -0.8)
		// 	.text(function (d) {
		// 		return d.name
		// 	})
		// 	.call(wrap, 180);
		//
		// // need to specify x/y/etc
		// d3.select(self.frameElement).style('height', diameter - 150 + 'px');
		//
		// function mouseover(d) {
		// 	// bring moused links to front
		// 	d3.selectAll('.links .link').sort(function (a, b) {
		// 		return d.related_links.indexOf(a.id);
		// 	});
		//
		// 	for (var i = 0; i < d.related_nodes.length; i++) {
		// 		if (!titles.includes(d.name)) { // interactivity only for non-title nodes
		// 			d3.select('#' + d.related_nodes[i]).classed('highlight', true).style('fill', '#076eb5'); // color related nodes blue
		// 			if (d.related_nodes[i][0] == 'i') {
		// 				d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#f2f3f4');
		// 			} // color inner node text lighter
		// 			else {
		// 				d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#076eb5').attr('font-size', 19).style('font-weight', '600');
		// 			}
		// 			; // color outer text blue and bigger
		// 		}
		// 	}
		//
		// 	for (var i = 0; i < d.related_links.length; i++)
		// 		d3.select('#' + d.related_links[i]).style('stroke', '#076eb5').style('stroke-width', '1.5px'); //make links blue and thicker
		// }
		//
		// function mouseout(d) // set everything back to normal
		// {
		// 	for (var i = 0; i < d.related_nodes.length; i++) {
		// 		if (!titles.includes(d.name)) {
		// 			d3.select('#' + d.related_nodes[i]).classed('highlight', false).style('fill', '#e8e8e8');
		// 			if (d.related_nodes[i][0] == 'i') {
		// 				d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#4f4f4f');
		// 			}
		// 			else {
		// 				d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#c1c1c1').attr('font-size', 16).style('font-weight', 'normal');
		// 			}
		// 			;
		// 		}
		// 	}
		//
		// 	for (var i = 0; i < d.related_links.length; i++)
		// 		d3.select('#' + d.related_links[i]).style('stroke-width', '1px').style('stroke', '#e5e5e5');
		// }
	};
})();
