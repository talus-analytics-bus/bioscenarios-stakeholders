(() => {
	App.buildHorizontalStackedBarChart = (selector, data, param = {}) => {
		const colors = ['#4475b6', '#8e536e', '#d93127'].reverse();

		// inject "running x" into data
		data.forEach((d) => {
			let runningValue = 0;
			d.children.forEach((c) => {
				c.value0 = runningValue;
				runningValue += c.value;
				c.value1 = runningValue;
			});
			d.value = runningValue;
		});

		// sort data
		Util.sortByKey(data, 'value', true);

		// start building the chart
		const margin = { top: 45, right: 20, bottom: 60, left: 100 };
		const width = 400;
		const height = 200;

		const chart = d3.select(selector).append('svg')
			.classed('horizontal-stacked-bar-chart', true)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const x = d3.scaleLinear()
			.domain([0, 1.2 * d3.max(data, d => d.value)])
			.range([0, width]);
		const y = d3.scaleBand()
			.padding(0.25)
			.domain(data.map(d => d.name))
			.range([0, height]);
		const colorScale = d3.scaleOrdinal()
			.domain(['positive', 'mixed', 'negative'])
			.range(colors);

		const xAxis = d3.axisTop()
			.ticks(5)
			.tickFormat(d => d / 1e3)
			.scale(x);
		const yAxis = d3.axisLeft()
			.ticks(5)
			.scale(y);

		const barGroups = chart.selectAll('.bar-group')
			.data(data)
			.enter().append('g')
				.attr('class', 'bar-group')
				.attr('transform', d => `translate(0, ${y(d.name)})`);
		barGroups.selectAll('rect')
			.data(d => d.children.map(c => ({ parent: d.id, child: c })))
			.enter().append('rect')
				.attr('x', d => x(d.child.value0))
				.attr('width', d => x(d.child.value1) - x(d.child.value0))
				.attr('height', y.bandwidth())
				.style('fill', d => colorScale(d.child.name));

		// add axes
		chart.append('g')
			.attr('class', 'x axis')
			.call(xAxis);
		chart.append('g')
			.attr('class', 'y axis')
			.call(yAxis);

		// add axes labels
		chart.append('text')
			.attr('class', 'axis-label')
			.attr('x', width / 2)
			.attr('y', -30)
			.style('text-anchor', 'middle')
			.style('font-size', '0.9em')
			.text('# of Conversations');

		// add legend
		const rectWidth = 70;
		const rectHeight = 12;
		const legend = chart.append('g')
			.attr('transform', `translate(70, ${height + 30})`);
		const legendGroups = legend.selectAll('g')
			.data(colors)
			.enter().append('g')
				.attr('transform', (d, i) => `translate(${(rectWidth + 20) * i}, 0)`);
		legendGroups.append('rect')
			.attr('width', rectWidth)
			.attr('height', rectHeight)
			.style('fill', d => d);
		legendGroups.append('text')
			.attr('x', rectWidth / 2)
			.attr('y', rectHeight + 10)
			.attr('dy', '.35em')
			.style('text-anchor', 'middle')
			.text((d, i) => {
				if (i === 0) return 'Positive';
				if (i === 1) return 'Mixed';
				return 'Negative';
			});
	};

	App.buildVerticalStackedBarChart = (selector, data, param = {}) => {
		const colors = ['#4475b6', '#8e536e', '#d93127'].reverse();

		// inject "running x" into data
		data.forEach((d) => {
			let runningValue = 0;
			d.children.forEach((c) => {
				c.value0 = runningValue;
				runningValue += c.value;
				c.value1 = runningValue;
			});
			d.value = runningValue;
		});

		// start building the chart
		const margin = { top: 30, right: 20, bottom: 80, left: 80 };
		const width = 400;
		const height = 200;

		const chart = d3.select(selector).append('svg')
			.classed('category-chart', true)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const x = d3.scaleBand()
			.padding(0.25)
			.domain(data.map(d => d.name))
			.range([0, width]);
		const y = d3.scaleLinear()
			.domain([0, 1.2 * d3.max(data, d => d.value)])
			.range([height, 0]);
		const colorScale = d3.scaleOrdinal()
			.domain(['positive', 'mixed', 'negative'])
			.range(colors);

		const xAxis = d3.axisBottom()
			.ticks(5)
			.scale(x);
		const yAxis = d3.axisLeft()
			.ticks(5)
			.tickFormat(d => d / 1e3)
			.scale(y);

		const barGroups = chart.selectAll('.bar-group')
			.data(data)
			.enter().append('g')
				.attr('class', 'bar-group')
				.attr('transform', d => `translate(${x(d.name)}, 0)`);
		barGroups.selectAll('rect')
			.data(d => d.children.map(c => ({ parent: d.id, child: c })))
			.enter().append('rect')
				.attr('y', d => y(d.child.value1))
				.attr('width', x.bandwidth())
				.attr('height', d => y(d.child.value0) - y(d.child.value1))
				.style('fill', d => colorScale(d.child.name));

		// add axes
		chart.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis);
		chart.append('g')
			.attr('class', 'y axis')
			.call(yAxis);

		// add axes labels
		chart.append('text')
			.attr('class', 'axis-label')
			.attr('x', width / 2)
			.attr('y', height + 50)
			.text('');
		chart.append('text')
			.attr('class', 'axis-label')
			.attr('x', -height / 2)
			.attr('y', -45)
			.attr('transform', 'rotate(-90)')
			.style('font-size', '0.9em')
			.style('text-anchor', 'middle')
			.text('# of Conversations');

		// add legend
		const rectWidth = 70;
		const rectHeight = 12;
		const legend = chart.append('g')
			.attr('transform', `translate(70, ${height + 50})`);
		const legendGroups = legend.selectAll('g')
			.data(colors)
			.enter().append('g')
				.attr('transform', (d, i) => `translate(${(rectWidth + 20) * i}, 0)`);
		legendGroups.append('rect')
			.attr('width', rectWidth)
			.attr('height', rectHeight)
			.style('fill', d => d);
		legendGroups.append('text')
			.attr('x', rectWidth / 2)
			.attr('y', rectHeight + 10)
			.attr('dy', '.35em')
			.style('text-anchor', 'middle')
			.text((d, i) => {
				if (i === 0) return 'Positive';
				if (i === 1) return 'Mixed';
				return 'Negative';
			});
	};
})();
