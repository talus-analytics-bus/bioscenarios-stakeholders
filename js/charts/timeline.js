(() => {
	App.initTimeline = (selector, rawData, policyEventData, param = {}) => {
		const margin = {top: 25, right: 25, bottom: 50, left: 25};
		const width = param.width || 1000;
		const height = width * 0.2;

		const cases = [10, 10, 20, 30, 50, 80, 80, 40, 10, 5];
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
		const backgroundColors = ['#cccab8', '#ededee'];
		const legendColor = '#c9c9c9';
		const textColor = '#333333';
		const textBoldColor = '#666666';
		const pointColor = '#989898';
		const highlightColor = '#000000';
		const scatterlineColor = '#2d9de2';

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
			.text('Number of cases');

		// Upper left label
		const title = chart.append('text')
			.attr('transform', 'translate(35, 20)')
			.attr('fill', textBoldColor)
			.style('font-size', '0.8em')
			.text('EPIDEMIOLOGICAL CURVE');

		// Event Label
		const whatEvent = chart.append('text')
			.attr('class', 'what-event-is-it')
			.attr('transform', 'translate(35, 40)')
			.attr('fill', textBoldColor)
			.attr('font-style', 'italic')
			.style('font-size', '0.8em')
			.attr('event', eventLabelsLower[0])
			.text(eventLabelsLower[0]);

		// day label
		const whatDay = chart.append('text')
			.attr('class', 'what-day-is-it')
			.attr('transform', 'translate(35, 60)')
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
			.attr('transform', `translate(0, ${height + 10})`);

		scatterline.append('rect')
			.attr('width', width)
			.attr('height', height / 8)
			.attr('fill', 'url(#timeline-gradient)');

		scatterline.append('text')
			.attr('transform', 'translate(2, 18)')
			.attr('fill', textColor)
			.attr('font-style', 'italic')
			.style('font-weight', '600')
			.text('Policies');

		scatterline.append('g')
			.selectAll('rect')
			.data(policyEventData)
			.enter()
			.append('rect')
			.attr('x', d => x(d['Timeline Event'].toUpperCase()))
			.attr('width', 5)
			.attr('height', height / 8)
			.style('fill', scatterlineColor);


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
			.attr('fill', pointColor);

		// graph point lines
		eventGroup.append('line')
			.attr('x1', d => x(d.eventName.toUpperCase()))
			.attr('x2', d => x(d.eventName.toUpperCase()))
			.attr('y1', height)
			.attr('y2', d => y(d.numCases))
			.attr('stroke-width', 1)
			.attr('stroke', pointColor)
			.style('stroke-dasharray', ('3, 3'));

		// label each point
		eventGroup.append('text')
			.attr('class', 'event-label')
			.attr('fill', (d, i) => (i === 0) ? 'black' : textColor)
			.attr('text-anchor', 'middle')
			.style('font-size', (d, i) => (i === 0) ? '1em' : '0.75em')
			.html(function (d) {
				return wordWrap(
					d.eventName,
					20,
					x(d.eventName.toUpperCase()),
					y(d.numCases) - 20)
			});

		const rectWidth = 120;
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
				// now set text
				const group = d3.select(`.event-group-${i}`);
				group.selectAll('text')
					.style('font-size', '1em')
					.style('fill', 'black');
				// now set rect
				d3.select(this)
					.style('fill-opacity', 0.15);

				// now update labels
				whatEvent.text(d.eventName)
					.attr('value', d.eventName);
				whatDay.text(`Day ${dayScale(d.eventName.toUpperCase())}`);
			});

		d3.select(`[value="${eventLabels[0]}"]`)
			.style('fill-opacity', 0.15);

		return chart;
	};
})();
