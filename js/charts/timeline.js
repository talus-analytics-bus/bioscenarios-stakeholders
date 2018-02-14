(() => {
	App.initTimeline = (selector, rawData, param={}) => {
		const margin = { top: 25, right: 25, bottom: 25, left: 25 };
		const width = param.width || 1000;
		const height = width * 0.2;

		const cases = [10, 10, 20, 30, 50, 80, 80, 40, 10, 5]
		const data = rawData.map((d, i) => {
			return {
				eventName: d['Timeline Event'],
				eventDescription: d['Timeline Event Description'],
				numCases: cases[i],
			};
		});

		// TODO => rationalize data
		const eventLabels = data.map(d => d.eventName.toUpperCase());

		// Colours
		const backgroundColors    = ['#cccab8', '#ededee'];
		const legendColor = '#c9c9c9';
		const textColor = '#333333';
		const textBoldColor = '#666666';
		const pointColor = '#989898';
		const highlightColor = '#000000';

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
		chart.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("fill", 'url(#timeline-gradient)');

		// small labelling rectangle on the left
		chart.append("rect")
			.attr("width", 30)
			.attr("height", height)
			.attr("fill", legendColor)
			.attr('fill-opacity', 0.5);

		// Labelling Rectangle contents
		chart.append("text")
			.attr("transform", "translate(20,"+String(height-10)+")rotate(-90)")
			.attr("fill", textColor)
			.attr("font-style", "italic")
			.style("font-weight", "600")
			.text("Number of cases");

		// Upper left label
		const title = chart.append('text')
			.attr('transform', 'translate(35, 20)')
			.attr('fill', textBoldColor)
			.style("font-size", "0.8em")
			.text('EPIDEMIOLOGICAL CURVE');

		// Event Label
		const whatEvent = chart.append('text')
			.attr('class', 'what-event-is-it')
			.attr('transform', 'translate(35, 40)')
			.attr('fill', textBoldColor)
			.attr("font-style", "italic")
			.style("font-size", "0.8em")
			.text(eventLabels[0]);

		// day label
		const whatDay = chart.append('text')
			.attr('class', 'what-day-is-it')
			.attr('transform', 'translate(35, 60)')
			.attr('fill', textBoldColor)
			.attr("font-style", "italic")
			.style("font-size", "0.8em")
			.text('Day 1');

		// define scales
		const x = d3.scaleBand()
			.domain(eventLabels)
			.range([0, width])
			.padding(1);

		const reverseX = d3.scaleQuantize()
			.domain([x(eventLabels[0]), x(eventLabels[eventLabels.length - 1]) - 100])
			.range(eventLabels);

		const dayScale = d3.scaleLinear()
			.domain([0, width])
			.rangeRound([1, 30 * eventLabels.length])

		const y = d3.scaleLinear()
			.domain([0, 100])
			.range([height, 0]);

		// graph line
		var line = d3.line()
			.curve(d3.curveCardinal)
			.x(function(d) {return x(d[0])})
			.y(function(d) {return y(d[1])});
		chart.append("path")
			.attr("fill", "none")
			.style("stroke", "white")
			.datum(data.map(d => [d.eventName.toUpperCase(), d.numCases]))
			.attr("d", line);

		// graph points
		const curvePoints = chart.append('g')
			.attr('class', 'curve-points');

		curvePoints.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', d => x(d.eventName.toUpperCase()))
			.attr('cy', d => y(d.numCases))
			.attr('r', '4')
			.attr('fill', pointColor);

		// graph point lines
		const curveDashLines = chart.append('g')
			.attr('class', 'curve-dash-lines');

		curveDashLines.selectAll('line')
			.data(data)
			.enter()
			.append('line')
			.attr('x1', d => x(d.eventName.toUpperCase()))
			.attr('x2', d => x(d.eventName.toUpperCase()))
			.attr('y1', height)
			.attr('y2', d => y(d.numCases))
			.attr('stroke-width', 1)
			.attr('stroke', pointColor)
			.style("stroke-dasharray", ("3, 3"));

		// label each point
		const curveLabelGroup = chart.append('g')
			.attr('class', 'curve-labels');

		const epiCurveLabels = curveLabelGroup.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.attr("fill", (d, i) => (i === 0) ? 'black' : textColor)
			.attr("text-anchor", 'middle')
			.style("font-size", (d, i) => (i === 0) ? '1em' : "0.75em")
			.html(function(d) {
				return wordWrap(
					d.eventName,
					20,
					x(d.eventName.toUpperCase()),
					y(d.numCases) - 20)
			})

		// draw indicator
		const indicatorGroup = chart.append('g')
			.attr('class', 'indicator-group');

		// click vs. drag
		// https://bl.ocks.org/mbostock/a84aeb78fea81e1ad806<Paste>
		var currentSelected = eventLabels[0];
		const drag = d3.drag()
			.on('drag', function(d) {
				// TODO: better math around newX
				var newX = d3.event.sourceEvent.x + d3.event.dx - 80 - margin.left;
				newX = Math.max(0, newX);
				newX = Math.min(width - margin.right - 160, newX);
				indicatorGroup.selectAll('rect')
					.attr('x', newX);

				indicatorGroup.attr('value', reverseX(newX));
				currentSelected = reverseX(newX);

				d3.select('.what-day-is-it')
					.text(`Day ${dayScale(newX)}`);

				d3.select('.what-event-is-it')
					.text(`${reverseX(newX)}`);

				$('.timeline-event-dropdown').val(reverseX(newX));

				// TODO: make overlap checking work
				checkOverlap = (d) => (Math.abs(x(d.eventName.toUpperCase()) - newX - 50) < 45);
				curveLabelGroup.selectAll('text')
					.attr('fill', d => (checkOverlap(d)) ? 'black' : textColor)
					.style("font-size", d => (checkOverlap(d)) ? '1em' : '0.75em');
			});

		const indicatorBox = indicatorGroup.append('rect')
			.attr('transform', `translate(50)`)
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', 100)
			.attr('height', height)
			.style('fill', highlightColor)
			.style('fill-opacity', 0.15)
			.call(drag);

		chart.currentSelected = currentSelected;

		return chart;
	};
})();
