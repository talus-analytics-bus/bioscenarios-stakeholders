(() => {
	App.initDonut = (selector, eventName, rawData, rawOrgInfo) => {

		let data;

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
		data = [{'name': 'VqdNMrLGWx',
			'roles': ['Humanitarian Aid',
				'Policy and Governance',
				'Public Health and Medical'],
			'size': 3,
			'type': 'National Government (non-affected)'},
			{'name': 'SLlQXOGeGT',
				'roles': ['Safety and Security',
					'Humanitarian Aid',
					'Policy and Governance',
					'Public Health and Medical'],
				'size': 4,
				'type': 'Private Sector'},
			{'name': 'mUQGmacyVw',
				'roles': ['Public Health and Medical',
					'Humanitarian Aid',
					'Policy and Governance'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'JxPFEiZWkV',
				'roles': ['Policy and Governance', 'Humanitarian Aid'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'YCcdpgloBp',
				'roles': ['Policy and Governance'],
				'size': 2,
				'type': 'National Government (non-affected)'},
			{'name': 'QOjwXZYPtg',
				'roles': ['Humanitarian Aid'],
				'size': 2,
				'type': 'National Government (non-affected)'},
			{'name': 'fMpiXbtgxn',
				'roles': ['Humanitarian Aid'],
				'size': 2,
				'type': 'United Nations Organizations'},
			{'name': 'QnIVCNPUHa',
				'roles': ['Policy and Governance', 'Humanitarian Aid'],
				'size': 2,
				'type': 'National Government (non-affected)'},
			{'name': 'EfmepecYrG',
				'roles': ['Humanitarian Aid',
					'Policy and Governance',
					'Safety and Security',
					'Public Health and Medical'],
				'size': 2,
				'type': 'National Government (non-affected)'},
			{'name': 'LvTpuoqzRE',
				'roles': ['Safety and Security',
					'Humanitarian Aid',
					'Public Health and Medical'],
				'size': 1,
				'type': 'Private Sector'},
			{'name': 'pryAmlSIgY',
				'roles': ['Public Health and Medical',
					'Humanitarian Aid',
					'Safety and Security'],
				'size': 4,
				'type': 'National Goverment (affected)'},
			{'name': 'DoyTtZdNdn',
				'roles': ['Humanitarian Aid',
					'Safety and Security',
					'Public Health and Medical'],
				'size': 3,
				'type': 'United Nations Organizations'},
			{'name': 'JOssORUPyH',
				'roles': ['Policy and Governance',
					'Humanitarian Aid',
					'Public Health and Medical',
					'Safety and Security'],
				'size': 3,
				'type': 'National Government (non-affected)'},
			{'name': 'oqlyPBtAIN',
				'roles': ['Policy and Governance'],
				'size': 3,
				'type': 'United Nations Organizations'},
			{'name': 'kczimRbsRc',
				'roles': ['Humanitarian Aid', 'Public Health and Medical'],
				'size': 3,
				'type': 'United Nations Organizations'},
			{'name': 'OTHVuXQwki',
				'roles': ['Safety and Security'],
				'size': 3,
				'type': 'United Nations Organizations'},
			{'name': 'GRkoIgavEe',
				'roles': ['Safety and Security'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'SziEEurhna',
				'roles': ['Safety and Security',
					'Policy and Governance',
					'Public Health and Medical',
					'Humanitarian Aid'],
				'size': 4,
				'type': 'National Goverment (affected)'},
			{'name': 'VsdZEpWCEt',
				'roles': ['Public Health and Medical',
					'Safety and Security',
					'Humanitarian Aid'],
				'size': 1,
				'type': 'United Nations Organizations'},
			{'name': 'fqRDzbRUsQ',
				'roles': ['Safety and Security',
					'Public Health and Medical',
					'Humanitarian Aid'],
				'size': 4,
				'type': 'United Nations Organizations'},
			{'name': 'yUXfWTNRGx',
				'roles': ['Policy and Governance'],
				'size': 4,
				'type': 'Private Sector'},
			{'name': 'fQQLbykdnq',
				'roles': ['Humanitarian Aid',
					'Policy and Governance',
					'Safety and Security',
					'Public Health and Medical'],
				'size': 3,
				'type': 'National Goverment (affected)'},
			{'name': 'frcJJpvKwd',
				'roles': ['Humanitarian Aid'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'tzYmUDFAUL',
				'roles': ['Policy and Governance', 'Humanitarian Aid'],
				'size': 2,
				'type': 'United Nations Organizations'},
			{'name': 'AlPvkgAEjW',
				'roles': ['Safety and Security', 'Public Health and Medical'],
				'size': 1,
				'type': 'Private Sector'},
			{'name': 'TxKermyduJ',
				'roles': ['Public Health and Medical',
					'Policy and Governance',
					'Safety and Security'],
				'size': 3,
				'type': 'National Government (non-affected)'},
			{'name': 'GckKYLcBPR',
				'roles': ['Public Health and Medical',
					'Policy and Governance',
					'Safety and Security'],
				'size': 4,
				'type': 'United Nations Organizations'},
			{'name': 'qZhLEaLNRd',
				'roles': ['Public Health and Medical',
					'Policy and Governance',
					'Humanitarian Aid'],
				'size': 3,
				'type': 'Non-Governmental Organizations'},
			{'name': 'XpgQARmUEW',
				'roles': ['Public Health and Medical'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'psBUDWaWLJ',
				'roles': ['Safety and Security',
					'Public Health and Medical',
					'Humanitarian Aid',
					'Policy and Governance'],
				'size': 3,
				'type': 'National Goverment (affected)'}];
		const allCategories = [
			'United Nations Organizations',
			'National Goverment (affected)',
			'Non-Governmental Organizations',
			'Private Sector',
			'National Government (non-affected)',
		];
		const allRoles = [
			'Public Health and Medical',
			'Humanitarian Aid',
			'Safety and Security',
			'Policy and Governance',
		];

		const roleAnchors = {
			'Public Health and Medical': {
				labelX: 100,
				labelY: 25,
				x: width / 7,
				y: height / 7,
			},
			'Humanitarian Aid': {
				labelX: width - 100,
				labelY: 25,
				x: 6 * width / 7,
				y: height / 7,
			},
			'Safety and Security': {
				labelX: 100,
				labelY: height - 50,
				x: width / 7,
				y: 6 * height / 7,
			},
			'Policy and Governance': {
				labelX: width - 100,
				labelY: height - 50,
				x: 6 * width / 7,
				y: 6 * height / 7,
			},
		};

		const nodes = data.map((d, i) => {
			return {
				index: i,
				type: d.type,
				cluster: d.roles,
				radius: Math.pow(d.size, 1.4) * baseNodeSize,
				text: d.name,
				x: 0,
				y: 0,
			};
		});

		const nodeColors = d3.scaleOrdinal()
			.domain(allCategories)
			.range(['#667eae', '#c5443c', '#e89372', '#99c2a9', '#8e87b6']);

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
			.attr('transform', 'translate(25, 400)')
			.style('font-weight', 600)
			.html(wordWrap('Circle Size = Number of Policies Stakeholder is mandated by', 40, 0, 0));

		const legendCircleGroup = legendGroup.append('g')
			.attr('transform', 'translate(80, 450)')
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
			.text(d => d - 1);

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
			/* initialize a new force to prevent out of bounds */
			let cnodes;

			const force = () => {
				if (cnodes !== undefined) {
					var node;
					for (var i = 0; i < cnodes.length; i++) {
						node = cnodes[i];
						if (node.x + node.radius > width) {
							node.x = width - node.radius;
						}
						if (node.x - node.radius < 0) {
							node.x = node.radius;
						}
						if (node.y + node.radius > height) {
							node.y = height - node.radius;
						}
						if (node.y - node.radius < 0) {
							node.y = node.radius;
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
			.force('collide', d3.forceCollide(d => d.radius - 2).strength(0.5))
			.force('x', d3.forceX(d => forceCluster(d, 'x'))
				.strength(1))
			.force('y', d3.forceY(d => forceCluster(d, 'y'))
				.strength(1))
			.force('edge-collision', edgeCollision());

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
			const content = `<b>${d.text}</b><br><i>${d.type}</i><br>${d.cluster}`;
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
				.html(d => {
					if (d.radius > 60) {
						return wordWrap(d.text, 30, d.x, d.y);
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

})();
