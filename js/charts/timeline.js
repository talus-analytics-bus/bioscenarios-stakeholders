(() => {
	App.initTimeline = (selector, data, param={}) => {
		const margin = { top: 25, right: 25, bottom: 100, left: 25 };
		const width = param.width || 900;
		const height = param.height || 140;

		const cases = [0,5,10,20,40,77,10, 0];

		const event_labels = data.map(d => d.toUpperCase());

		var timelineData = event_labels.map(function(e, i) {
			return [e, cases[i]];
		});
		var event;

		// Colours
		const backgroundColor    = '#e8e8e8';
		const leftRectLabelColor = '#c9c9c9';
		const highlightColor = '#076eb5'

		// add chart to DOM
		const chart = d3.select(selector).append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`);

		// fill background
		chart.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("fill", backgroundColor);

		// small labelling rectangle on the left
		chart.append("rect")
			.attr("width", 30)
			.attr("height", height)
			.attr("fill", leftRectLabelColor);

		// Labelling Rectangle contents
		chart.append("text")
			.attr("transform", "translate(20,"+String(height-10)+")rotate(-90)")
			.attr("fill", "white")
			.attr("font-style", "italic")
			.style("font-weight", "600")
			.text("Number of cases");

		// define scales
		const x = d3.scaleBand()
			.domain(event_labels)
			.range([0, width])
			.padding(1);
		const reverseX = d3.scaleQuantize()
			.domain([0, width])
			.range(event_labels);
		const y = d3.scaleLinear()
			.domain([0, 100])
			.range([height, 0]);

		// graph line
		var line = d3.line()
			.curve(d3.curveBasis)
			.x(function(d) {return x(d[0])})
			.y(function(d) {return y(d[1])});
		chart.append("path")
			.attr("fill", "none")
			.style("stroke", "white")
			.datum(timelineData)
			.attr("d", line);

		// add axes to DOM
		const xAxis = d3.axisBottom()
			.tickSize(-height)
			.scale(x);

		var xaxis = chart.append("g")
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis);

		xaxis.selectAll("path").attr("stroke", "white");
		xaxis.selectAll("line").attr("stroke", "white");
		// Add x axis labels
		xaxis.selectAll("text")
			.attr("class", "timeline-label")
			.attr('transform', `translate(0, 20)`)
			.attr("font-size", 12)
			.call(wrap, 75);

		const indicatorGroup = chart.append('g')
			.attr('class', 'indicator-group');

		const indicatorLine = indicatorGroup.append('line')
			.attr('transform', `translate(50)`)
			.attr('x1', 50)
			.attr('x2', 50)
			.attr('y1', 0)
			.attr('y2', height)
			.attr('stroke-width', 3)
			.attr('stroke', highlightColor);

		// click vs. drag
		// https://bl.ocks.org/mbostock/a84aeb78fea81e1ad806<Paste>
		const drag = d3.drag()
			.on('drag', function(d) {
				var newX = d3.event.sourceEvent.x + d3.event.dx - 80 - margin.left;
				newX = Math.max(0, newX);
				newX = Math.min(width - margin.right - 175, newX);
				indicatorGroup.selectAll('line')
					.attr('x1', newX + 50)
					.attr('x2', newX + 50);
				indicatorGroup.selectAll('rect')
					.attr('x', newX);
				indicatorGroup.attr('value', reverseX(newX));
			});

		const indicatorBox = indicatorGroup.append('rect')
			.attr('transform', `translate(50)`)
			.attr('x', 0)
			.attr('y', height)
			.attr('width', 100)
			.attr('height', 60)
			.style('fill', highlightColor)
			.style('fill-opacity', 0.5)
			.call(drag);

	};
})();
