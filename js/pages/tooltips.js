(() => {
	App.initTooltips = () => {
		$('.hover-box').tooltipster({
			trigger: 'hover',
			content: 'Hello, I am a hover tooltipster.',
		});
		$('.click-box').tooltipster({
			trigger: 'click',
			content: 'Hello, I am a click tooltipster.',
		});

		// an example to generate more complex content in the tooltip
		const container = d3.select(document.createElement('div'));
		container.append('div')
			.attr('class', 'tooltip-title')
			.text('More Complex Content');
		container.append('div')
			.attr('class', 'tooltip-main-value')
			.text(d3.format(',.1f')(1320847));
		container.append('div')
			.attr('class', 'tooltip-main-value-label')
			.text('with a take-home value');

		$('.extra-box').tooltipster({
			trigger: 'click',
			content: container.html(),
		});
	};
})();
