(() => {
	App.buildForceDiagram = (selector, data, param = {}) => {
		const width = param.width || 800;
		const height = param.height || 400;

		const network = d3.select(selector).append('svg')
			.attr('width', width)
			.attr('height', height);
		const simulation = d3.forceSimulation()
			.velocityDecay(param.velocityDecay || 0.2)
			.force('link', d3.forceLink().id(d => d.index))
			.force('charge', d3.forceManyBody().strength(param.charge || -25))
			.force('center', d3.forceCenter(width / 2, height / 2));

		// prepare data (nodes and edges)
		const allNodes = data.map(d => d.source).concat(data.map(d => d.target));
		const nodeList = [];
		const nodeIndexLookup = {};
		for (let i = 0; i < allNodes.length; i++) {
			let alreadyThere = false;
			for (let j = 0; j < nodeList.length; j++) {
				if (allNodes[i] === nodeList[j].name) {
					alreadyThere = true;
					break;
				}
			}
			if (!alreadyThere) {
				nodeIndexLookup[allNodes[i]] = nodeList.length;
				nodeList.push({ name: allNodes[i] });
			}
		}
		const edgeList = [];
		data.forEach((d) => {
			edgeList.push({
				index: d.index,
				source: nodeIndexLookup[d.source],
				target: nodeIndexLookup[d.target],
			});
		});

		// draw nodes and links
		const link = network.append('g')
			.attr('class', 'links')
			.selectAll('.link')
				.data(edgeList)
				.enter().append('line')
					.attr('class', 'link');
		const node = network.append('g')
			.attr('class', 'nodes')
			.selectAll('.node')
				.data(nodeList)
				.enter().append('circle')
					.attr('class', 'node')
					.attr('r', 5)
					.call(d3.drag()
						.on('start', dragstarted)
						.on('drag', dragged)
						.on('end', dragended));

		// start simulation
		simulation
			.nodes(nodeList)
			.on('tick', () => {
				link.attr('x1', d => d.source.x)
					.attr('y1', d => d.source.y)
					.attr('x2', d => d.target.x)
					.attr('y2', d => d.target.y);
				node.attr('cx', d => d.x)
					.attr('cy', d => d.y);
			});
		simulation.force('link').links(edgeList);


		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}
		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}
		function dragended(d) {
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}
	};
})();
