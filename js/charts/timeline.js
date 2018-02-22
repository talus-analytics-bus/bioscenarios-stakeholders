(() => {
	App.initTimeline = (selector, rawData, policyEventData, param = {}) => {
		const margin = {top: 25, right: 25, bottom: 50, left: 25};
		const width = param.width || 1000;
		const height = width * 0.25;

		// How high should the y axis be?
		// these numbers don't actualy show up, just define relative size of y axis on plot (number of cases)
        const cases = [
        10, // case identified
        10, // agent identified
        18, // humanitarian response
        30, // suspicion of deliberate use
        50, // investigative response
        70, // state request for assistance
        56, // WHO PH emergency declared
        34, // response and recovery
        16,  // confirmation of deliberate use
        5 // ongoing response and recovery
        ];

        let xTmpCorrd = 200;
        let yTmpCoord = 222;
        // This data set statically places the noTimeCase circles onto the line. To move the circles, you need to
		// manipulate the coordinates here. These are relative to the case events.
		const noTimeCases = [
			[xTmpCorrd, yTmpCoord], // notification of cases
			[xTmpCorrd += 22, yTmpCoord-=3.2], // coordinated medical response initiated
			[xTmpCorrd += 32, yTmpCoord-=9.2], // begin epidemiological investigation
            // humanitarian response
            [xTmpCorrd += 60, yTmpCoord-= 15], // define and identify cases
            [xTmpCorrd += 30, yTmpCoord-= 12], // implement control and prevention measures
            // suspicion of deliberate use
            [xTmpCorrd += 78, yTmpCoord-= 38], // monitor and treat new cases
            // investigative response
            [xTmpCorrd = 500, yTmpCoord= 95], // continued medical response to cases
            // state request for assistance
            // WHO PHE declared
            [xTmpCorrd = 660, yTmpCoord= 123], // continued epidemiological investigation
            [xTmpCorrd = 680, yTmpCoord = 136], // increased prevention and control measures
            // Response and recovery
            [xTmpCorrd = 765, yTmpCoord = 185], // monitor for new cases
            // Confirmation of deliberate use
            [xTmpCorrd = 850, yTmpCoord = 221], // Sanctions issued
            [xTmpCorrd =710, yTmpCoord=68],
            [xTmpCorrd += 12, yTmpCoord-= 1], 
            [xTmpCorrd = 820, yTmpCoord = 99],
			];
		const data = rawData
            .map((d, i) => {
			return {
				eventName: d['Timeline Event'],
				eventDescription: d['Timeline Event Description'],
				numCases: cases[i],
                alwaysOccurs: d['Always occurs'],
                hasAssociatedPolicies: d['Has associated policies'],
			};
		});

		// The noTimeline case details are here
		const noCaseEventCircles = rawData.filter( (x) => x['Has associated policies'] !== 'TRUE')
            .map((d, i) => {
                return {
                    eventName: d['Timeline Event'],
                    eventDescription: d['Timeline Event Description'],
                    //numCases: i,
					position: i,

                    alwaysOccurs: d['Always occurs'],
                    hasAssociatedPolicies: d['Has associated policies'],
                };
            });


		const filterData = rawData.filter( (x) => x['Has associated policies'] !== 'FALSE')
            .map((d, i) => {
                return {
                    eventName: d['Timeline Event'],
                    eventDescription: d['Timeline Event Description'],
                    numCases: cases[i],

                    alwaysOccurs: d['Always occurs'],
                    hasAssociatedPolicies: d['Has associated policies'],
                };
            });


		const eventLabels = data.filter( (x) => x.hasAssociatedPolicies !== 'FALSE')
            .map(d => d.eventName.toUpperCase());
		const eventLabelsLower = data.filter( (x) => x.hasAssociatedPolicies !== 'FALSE')
            .map(d => d.eventName);


        const policyData = eventLabelsLower.map((d, i) => {
            return {
                count: policyEventData.filter( (x) => d === x['Timeline Event']).length,
				eventName: d
            };
		});

        let a = policyEventData.filter( d=> d['Timeline Event'] == 'Case identified by medical professionals');
		// Colours
		const backgroundColors = ['#94A0C3', 'white'];
		const legendColor = '#f7f8fa';
		const textColor = '#333333';
		const textBoldColor = '#666666';
		const pointColor = '#989898';
        const alwaysOccursPointColor = '#000000';
		const selectedPointColor = '#C91414';
		const highlightColor = '#000000';
		const scatterlineColor = '#082B84';
		const selectedTimelineGroup = '#C91414';
		const noTimeEventColor = '#000000';


		// add chart to DOM
		const chart = d3.select(selector)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const defs = chart.append('defs');

		const backgroundGradient = defs.append('linearGradient')
			.attr('id', 'timeline-gradient')
			.attr('x1', '0%')
			.attr('x2', '100%')
			.attr('y1', '0%')
			.attr('y2', '0%');
		backgroundGradient.append('stop')
			.attr('stop-color', backgroundColors[1])
			.attr('stop-opacity', 1)
			.attr('offset', '0%');
		backgroundGradient.append('stop')
			.attr('stop-color', backgroundColors[0])
			.attr('stop-opacity', 178 / 255)
			.attr('offset', '100%');

		// fill background
		chart.append('rect')
			.attr('width', width)
			.attr('height', height)
			.attr('fill', 'url(#timeline-gradient)');

		// small labelling rectangle on the left
		chart.append('rect')
			.attr('width', 30)
			.attr('height', height)
			.attr('fill', legendColor)
			.attr('fill-opacity', 0.5);

		// Labelling Rectangle contents
		chart.append('text')
			.attr('transform', 'translate(20,' + String(height - 10) + ')rotate(-90)')
			.attr('fill', textColor)
			.attr('font-style', 'italic')
			.style('font-weight', '600')
			.attr('font-size', '10px')
			.text('Number of cases');

		// Upper left label
		const title = chart.append('text')
			.attr('transform', 'translate(35, 40)')
			.attr('fill', textBoldColor)
			.style('font-size', '0.8em')
			.text('EPIDEMIOLOGICAL CURVE');

		// Event Label
		const whatEvent = chart.append('text')
			.attr('class', 'what-event-is-it')
			.attr('transform', 'translate(35, 60)')
			.attr('fill', textBoldColor)
			.attr('font-style', 'italic')
			.style('font-size', '0.8em')
			.attr('event', eventLabelsLower[0])
			.text(eventLabelsLower[0]);

		// day label
		const whatDay = chart.append('text')
			.attr('class', 'what-day-is-it')
			.attr('transform', 'translate(35, 80)')
			.attr('fill', textBoldColor)
			.attr('font-style', 'italic')
			.style('font-size', '0.8em')
			.text('Day 1');

		// define scales
		const x = d3.scaleBand()
			.domain(eventLabels)
			.range([0, width])
			.padding(1);


		const dayScale = d3.scaleOrdinal()
			.domain(eventLabels)
			.range([1, 2, 10, 30, 50, 55, 75, 80, 91, 100]);

		const y = d3.scaleLinear()
			.domain([0, 100])
			.range([height, 0]);

		// graph line
		var line = d3.line()
			.curve(d3.curveCardinal)
			.x(function (d) {
				return x(d[0])
			})
			.y(function (d) {
				return y(d[1])
			});

		chart.append('path')
			.attr('fill', 'none')
			.style('stroke', 'white')
			.datum(filterData.map(d => [d.eventName.toUpperCase(), d.numCases]))
			.attr('d', line);

		// draw the policy graph
		const scatterline = chart.append('g').attr('class', 'policy-tract-group')
			.attr('transform', `translate(0, ${height + 5})`);

		scatterline.append('rect')
			.attr('class', 'policy-tract-container')
			.attr('width', width)
			.attr('height', 45)
			.attr('fill', 'url(#timeline-gradient)');

		scatterline.append('text')
			.attr('transform', 'translate(20, 42)rotate(-90)')
			.attr('fill', textColor)
			.attr('font-style', 'italic')
			.attr('font-size', '10px')
			.style('font-weight', '600')
			.text('Policies');

		scatterline.append('g')
			.attr('class', 'policy-tract-markers')
			.selectAll('rect')
			.data(policyData)
			.enter()
			.append('rect')
			.attr('class', (d, i) => `policy-tract-${i}`)
			.attr('x', d => x(d.eventName.toUpperCase()) - d.count)
			.attr('width', d=> d.count*2)
			.attr('height', 45)
			.style('fill', scatterlineColor);


		const markerLine = chart.append('g').attr('class', 'marker-line')
            .attr('transform', 'translate(0, 0)');
		markerLine.append('rect')
            .attr('width', width)
            .attr('height', 25)
			.style('fill-opacity', 0.35)
            .attr('fill', '#b5bed5');

        markerLine.append('g')
            .selectAll('g')
            .data(filterData)
            .enter()
			.append('line').attr('class', 'event-line-mark')
            .attr('x1', d => x(d.eventName.toUpperCase()))
            .attr('x2', d => x(d.eventName.toUpperCase()))
            .attr('y1', 0)
            .attr('y2', 25)
            .attr('stroke-width', 1)
            .attr('stroke', '#999a9b');


		// Group for each event
		const eventGroup = chart.append('g')
			.selectAll('g')
			.data(filterData)
			.enter()
			.append('g')
			.attr('class', (d, i) => `event-group-${i}`);

		// graph points on the line
		eventGroup.append('circle')
			.attr('cx', d => x(d.eventName.toUpperCase()))
			.attr('cy', d => y(d.numCases))
			.attr('r', '4')
			.attr('class', (d, i) => (i === 0) ? 'selected-circle' : '')
			.attr('stroke', noTimeEventColor)
            .attr('stroke-width', 0.75)
			.attr('fill', (d, i) => {
                if (i === 0) {
			      return selectedPointColor;
                } else {
                    if (d.alwaysOccurs.toUpperCase() === 'ALWAYS OCCURS') {
			            return alwaysOccursPointColor;
                    }
                    else {
			            return pointColor;
                    }
                }
			});

		// graph point lines
		eventGroup.append('line')
			.attr('x1', d => x(d.eventName.toUpperCase()))
			.attr('x2', d => x(d.eventName.toUpperCase()))
			.attr('y1', height)
			.attr('y2', d => y(d.numCases))
			.attr('stroke-width', 1)
            .attr('class', (d, i) => (i === 0) ? 'selected-line' : '')
			.attr('stroke', (d, i) => {
                if (i === 0) {
                    return selectedPointColor;
                } else {
                    if (d.alwaysOccurs.toUpperCase() === 'ALWAYS OCCURS') {
                        return alwaysOccursPointColor;
                    }
                    else {
                        return pointColor;
                    }
                }
            })
            .style('stroke-dasharray', ('3, 3'));

		// label each point
		eventGroup.append('text')
			.attr('class', 'event-label')
			.attr('fill', (d, i) => (i === 0) ? 'black' : textColor)
			.attr('text-anchor', 'middle')
			.style('font-size', (d, i) => (i === 0) ? '0.70em' : '0.70em')
			.style('font-weight', (d, i) => (i === 0) ? 600 : '')
			.html(function (d) {
				return wordWrap(
					d.eventName,
					20,
					x(d.eventName.toUpperCase()),
					y(d.numCases) - 20);
			});



        // you need to remember the previous color so that you can reset it
        // once it is deselected
        let previousSelectedPointColor = pointColor;

        const rectWidth = 120;
        const rectHeight = 300;
        const markerWidth = 60;
        const markerHeight = 25;

		eventGroup.append('rect')
			.attr('x', d => x(d.eventName.toUpperCase()) - (rectWidth / 2))
			.attr('width', rectWidth)
			.attr('height', rectHeight)
			.attr('class', 'event-highlight-rect')
			.attr('value', d => d.eventName.toUpperCase())
			.style('fill', highlightColor)
			.style('fill-opacity', 0.)
			.on('click', function(d, i) {

				// reset all changes
				d3.selectAll('.event-highlight-rect')
					.style('fill-opacity', 0);
				d3.selectAll('.event-label')
					.style('fill', textColor)
					.style('font-size', '0.70em');

                d3.selectAll('.event-marker-highlight-icon')
                    .style('visibility', 'hidden');

                d3.selectAll('.policy-tract-markers rect')
					.style('fill', scatterlineColor);

                d3.select('.selected-circle')
					.attr('class', '')
					.attr('fill', previousSelectedPointColor);
                d3.select('.selected-line')
                    .attr('class', '')
                    .attr('stroke', previousSelectedPointColor);

				// now set text
				const group = d3.select(`.event-group-${i}`);
				group.selectAll('text')
					.style('font-size', '0.7em')
					.style('fill', 'black')
					.style('font-weight', 600);
				// now set rect
				d3.select(this)
					.style('fill-opacity', 0.15);

				let circle = d3.select(this.parentElement)
					.select('circle');
				previousSelectedPointColor = circle.attr('fill');

				circle.attr('fill', selectedPointColor)
					.attr('class', 'selected-circle');

                d3.select(this.parentElement)
					.select('line')
					.attr('stroke', selectedPointColor)
                    .attr('class', 'selected-line');

				// Set red marker
                d3.select(this.nextElementSibling)
                   .style('visibility', 'visible');

                // Set the policy rectangle red as well
				d3.select(`.policy-tract-${i}`)
					.style('fill', selectedPointColor);

				// now update labels
				whatEvent.text(d.eventName)
					.attr('value', d.eventName);
				whatDay.text(`Day ${dayScale(d.eventName.toUpperCase())}`);
			});



		// create the marker groups
        const markerGroup = eventGroup.append('g').attr('class', 'event-marker-highlight-icon');

		markerGroup.append('rect')
            .attr('width', markerWidth)
            .attr('height', markerHeight)
			.attr('fill', selectedTimelineGroup)
			.attr('x', d => x(d.eventName.toUpperCase()) - (markerWidth / 2))
			.attr('rx', '3')
            .attr('ry', '3')
            .style('fill-opacity', 0.85);

		let lineHeight = markerHeight - 3;
        // Drawing the three vertical lines
        markerGroup.append('line')
            .attr('x1', d => x(d.eventName.toUpperCase()) - 10)
            .attr('x2', d => x(d.eventName.toUpperCase()) - 10)
            .attr('y1', 3)
            .attr('y2', lineHeight)
            .attr('stroke-width', 1)
            .attr('stroke', 'white');

        markerGroup.append('line')
            .attr('x1', d => x(d.eventName.toUpperCase()))
            .attr('x2', d => x(d.eventName.toUpperCase()))
            .attr('y1', 3)
            .attr('y2', lineHeight)
            .attr('stroke-width', 1)
            .attr('stroke', 'white');

        markerGroup.append('line')
            .attr('x1', d => x(d.eventName.toUpperCase()) + 10)
            .attr('x2', d => x(d.eventName.toUpperCase()) + 10)
            .attr('y1', 3	)
            .attr('y2', lineHeight)
            .attr('stroke-width', 1)
            .attr('stroke', 'white');

        // Add the circles to the line. These are statically placed. These only show the event name within the tooltip
        const noTimelineEvent = chart.append('g').attr('class', 'no-timeline-event-details')
            .selectAll('g')
            .data(noCaseEventCircles)
            .enter()
            .append('g')
            .attr('class', (d, i) => `no-timeline-event-group-${i}`);
        noTimelineEvent.append('circle')
            .attr('cx', d => noTimeCases[d.position][0])
            .attr('cy', d => noTimeCases[d.position][1])
            .attr('r', '4')
            .attr('class', '')
            .attr('stroke', noTimeEventColor)
            .attr('stroke-width', 0.75)
			.attr('fill', '#e6e9f1')
            .each(function(d) {
                const content = `<b>${d.eventName}</b>`;
                return $(this).tooltipster({
                    content: content,
                    trigger: 'hover',
                    side: 'bottom',
                });
            });

        d3.selectAll('.event-marker-highlight-icon')
            .style('visibility', 'hidden'); // start with all of the red marker widgets hidden

		d3.select('.policy-tract-0')
			.style('fill', selectedPointColor);

		d3.select('.event-marker-highlight-icon')
            .style('visibility', 'visible');

		d3.select(`[value="${eventLabels[0]}"]`)
			.style('fill-opacity', 0.15);

		return chart;
	};
})();
