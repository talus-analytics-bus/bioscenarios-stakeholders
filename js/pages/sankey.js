(() => {
	App.initSankey = () => {
		const exampleData = {
			nodes: [
				{ name: 'Known' },
				{ name: 'Novel' },
				{ name: 'Contagious' },
				{ name: 'Non-contagious' },
				{ name: 'Only unapproved for experiments' },
				{ name: 'MCM available' },
				{ name: 'No MCM' },
				{ name: 'No MCM because Novel' }
			],
			links: [
				{ source: 0, target: 2, value: 70 },
				{ source: 0, target: 3, value: 10 },
				{ source: 1, target: 2, value: 15 },
				{ source: 1, target: 3, value: 5 },
				{ source: 2, target: 4, value: 9 },
				{ source: 2, target: 5, value: 37 },
				{ source: 2, target: 6, value: 24 },
				{ source: 3, target: 4, value: 1 },
				{ source: 3, target: 5, value: 3 },
				{ source: 3, target: 6, value: 6 },
				{ source: 3, target: 7, value: 5 }
			]
		}
		App.buildSankey('.sankey-chart', exampleData);
	}
})();
