(() => {
	App.initDonut = (selector, eventName, rawData, rawOrgInfo, nodeScaling=2) => {
		let data;
		let allCategories;
		let allRoles;
		let roleAnchors;

		const margin = {top: 25, right: 25, bottom: 50, left: 300};
		const width = 800;
		const height = width;
		const baseNodeSize = 10;

		/* STEP ONE => MASSAGE THE DATA */
		//		  meow
		//   /\_/\
		//  ( o.o )
		//   > ^ <
		//
		// (there are cats here)
		// data = [{'name': 'VqdNMrLGWx',
		// 	'roles': ['Humanitarian Aid',
		// 		'Policy and Governance',
		// 		'Public Health and Medical'],
		// 	'size': 3,
		// 	'type': 'National Government (non-affected)'},
		// 	{'name': 'SLlQXOGeGT',
		// 		'roles': ['Safety and Security',
		// 			'Humanitarian Aid',
		// 			'Policy and Governance',
		// 			'Public Health and Medical'],
		// 		'size': 4,
		// 		'type': 'Private Sector'}];
		function parseData() {
			allCategories = [
				'UN Organizations',
				'Non-UN International Organizations',
				'NGOs',
				'Non-affected Member States',
				'Affected Member State',
				'Private Sector',
			];
			allRoles = [
				'Public Health and Medical',
				'Humanitarian Aid',
				'Safety and Security',
				'Governance and Policy',
			];

			roleAnchors = {
				'Public Health and Medical': {
					labelX: 75,
					labelY: 25,
					x: width / 7,
					y: height / 7,
				},
				'Humanitarian Aid': {
					labelX: width - 75,
					labelY: 25,
					x: 6 * width / 7,
					y: height / 7,
				},
				'Safety and Security': {
					labelX: 75,
					labelY: height - 25,
					x: width / 7,
					y: 6 * height / 7,
				},
				'Governance and Policy': {
					labelX: width - 75,
					labelY: height - 25,
					x: 6 * width / 7,
					y: 6 * height / 7,
				},
			};
			Object.keys(roleAnchors).forEach(k => {
				roleAnchors[k.toLowerCase()] = roleAnchors[k];
			});

			let filteredData;
			if (eventName === null) {
				filteredData = rawData;
			} else {
				filteredData = rawData
					.filter(d => d['Timeline Event'].toLowerCase() === eventName.toLowerCase());
			}

			data = filteredData.map(old => {
					var d = Object.assign({}, old);
					const orgName = d['Stakeholder'].toLowerCase();
					const orgRow = rawOrgInfo.filter(o => o['Stakeholder Name'].toLowerCase() === orgName);
					if (orgRow.length === 0) {
						console.log(`error, ${orgName} has no associated data.... skipping`);
						console.log(d);
					} else {
						Object.assign(d, orgRow[0]);
						d.name = d['Stakeholder'];
						d.roles = d['Stakeholder Role'].split(';').map(r => r.trim());
						d.size = d['Mandates'].split(';').length;
						d.type = d['Organization Category'];
						if (d.type === 'International Organization') {
							d.type = 'Interational Organizations';
						}
						return d;
					}
				})
				.filter(d => d !== undefined);
		}
		parseData();

		const nodes = data.map((d, i) => {
			return {
				index: i,
				type: d.type,
				cluster: d.roles,
				radius: Math.pow(d.size, nodeScaling) * baseNodeSize + 20,
				text: d.name,
				x: 0,
				y: 0,
				size: d.size,
			};
		});

		const nodeColors = d3.scaleOrdinal()
			.domain(allCategories)
			.range([
				'#667eae',  // UN Orgs
				'#DBD195',  // International orgs
				'#e89372',  // NGOs
				'#8e87b6',  // non affected states
				'#c5443c',  // affected states
				'#99c2a9',  // Private sector
			]);

		const chart = d3.select(selector)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g');

		/* LEGEND */
		const legendGroup = chart.append('g')
			.attr('transform', `translate(0, ${margin.top})`)
			.attr('class', 'legend-group');

		const categoryLabelGroup = legendGroup.append('g')
			.attr('transform', 'translate(0, 50)');

		categoryLabelGroup.append('text')
			.attr('transform', 'translate(25, -25)')
			.style('font-weight', 600)
			.text('Color = Organization Type');

		const categoryLabels = categoryLabelGroup.selectAll('g')
			.data(allCategories)
			.enter()
			.append('g');

		categoryLabels.append('text')
			.attr('transform', (d, i) => `translate(100, ${i * 50})`)
			.style('font-size', '1.1em')
			.html(d => wordWrap(d, 20, 0, 0));

		categoryLabels.append('rect')
			.attr('transform', (d, i) => `translate(25, ${(i * 50) - 12})`)
			.attr('width', 40)
			.attr('height', 40)
			.attr('rx', 6)
			.attr('ry', 6)
			.style('fill', d => nodeColors(d))
			.style('fill-opacity', 0.9)
			.style('stroke', d => d3.color(nodeColors(d)).darker())
			.style('stroke-opacity', 1);

		legendGroup.append('text')
			.attr('transform', 'translate(25, 450)')
			.style('font-weight', 600)
			.html(wordWrap('Circle Size = Number of Policies Stakeholder is mandated by', 40, 0, 0));

		const legendCircleGroup = legendGroup.append('g')
			.attr('transform', 'translate(80, 500)')
			.selectAll('g')
			.data([1, 2, 4])
			.enter()
			.append('g')
			.attr('transform', d => 'translate(50)');

		legendCircleGroup.append('circle')
			.attr('r', d => baseNodeSize * d * 2)
			.attr('cy', d => baseNodeSize * d * 2)
			.style('fill-opacity', 0)
			.style('stroke', 'black')
			.style('stroke-opacity', 0.8)
			.style('stroke-dasharray', ('3, 3'));

		legendCircleGroup.append('text')
			.attr('dy', d => (d * baseNodeSize * 4) - 5)
			.style('text-anchor', 'middle')
			.style('font-size', '1.15em')
			.text(d => d);

		/* BUBBLES */
		const bubbleGroup = chart.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)
			.style('background', 'white');

		bubbleGroup.append('rect')
			.attr('width', width)
			.attr('height', height)
			.style('fill-opacity', 0)
			.style('stroke', 'black')
			.style('stroke-opacity', 0.2);

		// first do gridlines
		const gridlines = bubbleGroup.append('g')
			.attr('class', 'gridlines');

		gridlines.append('line')
			.attr('x1', 0)
			.attr('x2', width)
			.attr('y1', height / 2)
			.attr('y2', height / 2);

		gridlines.append('line')
			.attr('x1', width / 2)
			.attr('x2', width / 2)
			.attr('y1', 0)
			.attr('y2', height);

		gridlines.style('stroke', 'black')
			.style('stroke-opacity', 0.3)
			.style('stroke-dasharray', ('1, 1'));

		// now force layout
		// first setup simulation
		let value;
		let initial;
		const forceCluster = (d, direction) => {
			const numClusters = d.cluster.length;
			if (numClusters === 1) {
				value = roleAnchors[d.cluster[0]][direction];
			} else {
				if (direction === 'x') {
					initial = width / 2;
				} else {
					initial = height / 2;
				}
				value = d.cluster
					.reduce((acc, cval) => acc + roleAnchors[cval][direction], 0);
				value /= numClusters;
			}
			return value;
		};

		const edgeCollision = () => {
			/*
			 * Initialize a new force to prevent out of bounds
			 * We also make this bounding box a little smaller than the rect
			 * To prevent overlapping on the text
			 */
			let cnodes;

			const force = () => {
				if (cnodes !== undefined) {
					var node;
					for (var i = 0; i < cnodes.length; i++) {
						node = cnodes[i];
						if (node.x + node.radius > width - 75) {
							node.x = width - node.radius - 75;
						}
						if (node.x - node.radius < 75) {
							node.x = node.radius + 75;
						}
						if (node.y + node.radius > height - 50) {
							node.y = height - node.radius - 50;
						}
						if (node.y - node.radius < 50) {
							node.y = node.radius + 50;
						}
					}
				}
			};

			force.initialize = (_) => {
				cnodes = _;
			};

			return force;
		};

		const simulation = d3.forceSimulation(nodes)
			.force('collide', d3.forceCollide(d => d.radius - (d.radius / 10)).strength(0.5)) // dynamic collision 10%
			.force('x', d3.forceX(d => forceCluster(d, 'x'))
				.strength(1))
			.force('y', d3.forceY(d => forceCluster(d, 'y'))
				.strength(1))
			.force('edge-collision', edgeCollision())
			.alphaMin(0.001);

		// we don't have any links
		// need nodes
		const nodeGroup = bubbleGroup.append('g')
			.attr('class', 'node-group')
			.selectAll('g')
			.data(nodes)
			.enter()
			.append('g');

		nodeGroup.append('circle')
			.attr('r', d => d.radius)
			.style('fill', d => nodeColors(d.type))
			.style('fill-opacity', 0.9)
			.style('stroke', d => d3.color(nodeColors(d.type)).darker())
			.style('stroke-opacity', 1);

		nodeGroup.append('text')
			.style('fill', 'white')
			.style('text-anchor', 'middle');

		nodeGroup.each(function(d, i) {
			const content = `<b>${d.text}</b><br><i>${d.type}</i><br>${d.cluster}<br><b>Number of Mandates</b> ${d.size}`;
			return $(this).tooltipster({
				content: content,
				trigger: 'hover',
				side: 'right',
			});
		});

		const ticked = () => {
			nodeGroup.selectAll('circle')
				.attr('cx', d => d.x)
				.attr('cy', d => d.y);

			nodeGroup.selectAll('text')
				.attr('x', d => {
					return d.x;
				})
				.attr('y', d => {
					return d.y;
				})
				.html(d => {
					if (d.radius > 60) {
						return wordWrap(d.text, 30, d.x, d.y);
					} else {
						const shortName = getShortName(d.text);
						if (shortName !== d.text) {
							return shortName;
						}
					}
				});
		};

		simulation
			.nodes(nodes)
			.on('tick', ticked);

		// now labels
		const labelGroup = bubbleGroup.append('g')
			.classed('cluster-labels', true);

		labelGroup.selectAll('text')
			.data(allRoles)
			.enter()
			.append('text')
			.style('font-size', '1.2em')
			.style('font-weight', 600)
			.style('text-anchor', 'middle')
			.html(d => wordWrap(d, 20, roleAnchors[d].labelX, roleAnchors[d].labelY));


	};

	function getShortName(s) {
		const shortname = /\(([A-Z]+)\)/.exec(s);
		if (shortname === null) {
			return s;
		} else {
			return shortname[1];
		}
	}

})();
