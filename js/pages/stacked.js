(() => {
	App.initStacked = () => {
		const stackData = [
			{
				name: 'June 2017',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
			{
				name: 'July 2017',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
			{
				name: 'August 2017',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
			{
				name: 'September 2017',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
		];

		const hStackData = [
			{
				name: 'Facebook',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
			{
				name: 'Twitter',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
			{
				name: 'Instagram',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
			{
				name: 'Broadcasts',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
			{
				name: 'News',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
			{
				name: 'Video',
				children: [
					{ name: 'positive', value: 1e5 * Math.random() },
					{ name: 'mixed', value: 1e5 * Math.random() },
					{ name: 'negative', value: 1e5 * Math.random() },
				],
			},
		];

		App.buildVerticalStackedBarChart('.vertical-bar-chart', stackData);
		App.buildHorizontalStackedBarChart('.horizontal-bar-chart', hStackData);
	};
})();
