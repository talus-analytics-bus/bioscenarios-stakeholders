(() => {
	App.initTimeline = (selector, rawData, policyEventData, param = {}) => {
		const margin = {top: 25, right: 25, bottom: 50, left: 25};
		const width = param.width || 1000;
		const height = width * 0.3;

		const cases = [10, 10, 20, 30, 50, 70, 70, 40, 10, 5];
		const data = rawData.map((d, i) => {
			return {
				eventName: d['Timeline Event'],
				eventDescription: d['Timeline Event Description'],
				numCases: cases[i],
			};
		});

		// TODO => rationalize data
		const eventLabels = data.map(d => d.eventName.toUpperCase());
		const eventLabelsLower = data.map(d => d.eventName);

		// Colours
		const backgroundColors = ['#94A0C3', 'white'];
		const legendColor = '#f7f8fa';
		const textColor = '#333333';
		const textBoldColor = '#666666';
		const pointColor = '#989898';
		const selectedPointColor = '#C91414';
		const highlightColor = '#000000';
		const scatterlineColor = '#2d9de2';
		const selectedTimelineGroup = '#C91414';


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

		const reverseX = d3.scaleQuantize()
			.domain([x(eventLabels[0]), x(eventLabels[eventLabels.length - 1]) - 100])
			.range(eventLabels);

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
			.datum(data.map(d => [d.eventName.toUpperCase(), d.numCases]))
			.attr('d', line);

		// draw the policy graph
		const scatterline = chart.append('g')
			.attr('transform', `translate(0, ${height + 5})`);

		scatterline.append('rect')
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
			.selectAll('rect')
			.data(policyEventData)
			.enter()
			.append('rect')
			.attr('x', d => x(d['Timeline Event'].toUpperCase()))
			.attr('width', 5)
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
            .data(data)
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
			.data(data)
			.enter()
			.append('g')
			.attr('class', (d, i) => `event-group-${i}`);

		// graph points
		eventGroup.append('circle')
			.attr('cx', d => x(d.eventName.toUpperCase()))
			.attr('cy', d => y(d.numCases))
			.attr('r', '4')
			.attr('class', (d, i) => (i === 0) ? 'selected-circle' : '')
			.attr('fill', (d,i) => (i === 0) ? selectedPointColor : pointColor);

		// graph point lines
		eventGroup.append('line')
			.attr('x1', d => x(d.eventName.toUpperCase()))
			.attr('x2', d => x(d.eventName.toUpperCase()))
			.attr('y1', height)
			.attr('y2', d => y(d.numCases))
			.attr('stroke-width', 1)
            .attr('class', (d, i) => (i === 0) ? 'selected-line' : '')
			.attr('stroke', (d,i) => (i === 0) ? selectedPointColor : pointColor)
			.style('stroke-dasharray', ('3, 3'));

		// label each point
		eventGroup.append('text')
			.attr('class', 'event-label')
			.attr('fill', (d, i) => (i === 0) ? 'black' : textColor)
			.attr('text-anchor', 'middle')
			.style('font-size', (d, i) => (i === 0) ? '1.1em' : '0.75em')
			.style('font-weight', (d, i) => (i === 0) ? 600 : '')
			.html(function (d) {
				return wordWrap(
					d.eventName,
					20,
					x(d.eventName.toUpperCase()),
					y(d.numCases) - 20);
			});

		const rectWidth = 120;
		const markerWidth = rectWidth / 2;
		const markerHeight = height / 12;

		let previousSelectedPointColor = pointColor;

		eventGroup.append('rect')
			.attr('x', d => x(d.eventName.toUpperCase()) - (rectWidth / 2))
			.attr('width', rectWidth)
			.attr('height', height + 10 + (height / 8))
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
					.style('font-size', '0.75em');

                d3.selectAll('.event-marker-highlight-icon')
                    .style('visibility', 'hidden');

                d3.select('.selected-circle')
					.attr('class', '')
					.attr('fill', previousSelectedPointColor);
                d3.select('.selected-line')
                    .attr('class', '')
                    .attr('stroke', previousSelectedPointColor);

				// now set text
				const group = d3.select(`.event-group-${i}`);
				group.selectAll('text')
					.style('font-size', '1.1em')
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

        // Drawing the three vertical lines
        markerGroup.append('line')
            .attr('x1', d => x(d.eventName.toUpperCase()) - 10)
            .attr('x2', d => x(d.eventName.toUpperCase()) - 10)
            .attr('y1', 0)
            .attr('y2', markerHeight)
            .attr('stroke-width', 1)
            .attr('stroke', 'white');

        markerGroup.append('line')
            .attr('x1', d => x(d.eventName.toUpperCase()))
            .attr('x2', d => x(d.eventName.toUpperCase()))
            .attr('y1', 0)
            .attr('y2', markerHeight)
            .attr('stroke-width', 1)
            .attr('stroke', 'white');

        markerGroup.append('line')
            .attr('x1', d => x(d.eventName.toUpperCase()) + 10)
            .attr('x2', d => x(d.eventName.toUpperCase()) + 10)
            .attr('y1', 0)
            .attr('y2', markerHeight)
            .attr('stroke-width', 1)
            .attr('stroke', 'white');

        d3.selectAll('.event-marker-highlight-icon')
            .style('visibility', 'hidden'); // start with all of the red marker widgets hidden

		d3.select('.event-marker-highlight-icon')
            .style('visibility', 'visible');

		d3.select(`[value="${eventLabels[0]}"]`)
			.style('fill-opacity', 0.15);

		return chart;
	};
})();
