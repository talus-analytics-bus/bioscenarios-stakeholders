(() => {
	App.initForce = () => {
		d3.tsv('data/network_nodes.tsv', (error, edges) => {
			App.buildForceDiagram('.force-chart', edges);
		});
	};
})();
