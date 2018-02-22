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
		data = [{'name': 'jxgSbvZpJy',
			'roles': ['Policy and Governance',
				'Safety and Security',
				'Public Health and Medical',
				'Humanitarian Aid'],
			'size': 3,
			'type': 'Private Sector'},
			{'name': 'UjbeXtbtju',
				'roles': ['Humanitarian Aid', 'Safety and Security'],
				'size': 3,
				'type': 'National Government (non-affected)'},
			{'name': 'ZKtRUuKFgx',
				'roles': ['Humanitarian Aid', 'Policy and Governance'],
				'size': 4,
				'type': 'Private Sector'},
			{'name': 'BYIptmFMON',
				'roles': ['Public Health and Medical',
					'Policy and Governance',
					'Safety and Security',
					'Humanitarian Aid'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'dJPuCgZVOx',
				'roles': ['Policy and Governance',
					'Public Health and Medical',
					'Safety and Security',
					'Humanitarian Aid'],
				'size': 3,
				'type': 'United Nations Organizations'},
			{'name': 'GsjbCfjWZU',
				'roles': ['Public Health and Medical',
					'Policy and Governance',
					'Humanitarian Aid'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'VtBAKgUvjo',
				'roles': ['Public Health and Medical',
					'Policy and Governance',
					'Safety and Security',
					'Humanitarian Aid'],
				'size': 4,
				'type': 'Non-Governmental Organizations'},
			{'name': 'JvmEVkNEQv',
				'roles': ['Humanitarian Aid'],
				'size': 2,
				'type': 'United Nations Organizations'},
			{'name': 'VoXMLITwwd',
				'roles': ['Policy and Governance', 'Humanitarian Aid'],
				'size': 3,
				'type': 'United Nations Organizations'},
			{'name': 'csLWeQGKwF',
				'roles': ['Public Health and Medical',
					'Policy and Governance',
					'Safety and Security',
					'Humanitarian Aid'],
				'size': 2,
				'type': 'National Government (non-affected)'},
			{'name': 'ccYauKtXEl',
				'roles': ['Policy and Governance',
					'Safety and Security',
					'Humanitarian Aid',
					'Public Health and Medical'],
				'size': 4,
				'type': 'Non-Governmental Organizations'},
			{'name': 'HdnjTxApnB',
				'roles': ['Safety and Security',
					'Humanitarian Aid',
					'Public Health and Medical',
					'Policy and Governance'],
				'size': 5,
				'type': 'National Goverment (affected)'},
			{'name': 'WLYpUMVRNm',
				'roles': ['Policy and Governance'],
				'size': 1,
				'type': 'Private Sector'},
			{'name': 'QwabDSKcHb',
				'roles': ['Public Health and Medical'],
				'size': 1,
				'type': 'Non-Governmental Organizations'},
			{'name': 'XGkIOPnGsn',
				'roles': ['Policy and Governance', 'Safety and Security', 'Humanitarian Aid'],
				'size': 5,
				'type': 'United Nations Organizations'},
			{'name': 'JTaEBuEcds',
				'roles': ['Policy and Governance', 'Humanitarian Aid'],
				'size': 4,
				'type': 'Non-Governmental Organizations'},
			{'name': 'qSrcWeEKAm',
				'roles': ['Policy and Governance',
					'Public Health and Medical',
					'Safety and Security',
					'Humanitarian Aid'],
				'size': 1,
				'type': 'United Nations Organizations'},
			{'name': 'NgVHZbujil',
				'roles': ['Public Health and Medical', 'Safety and Security'],
				'size': 3,
				'type': 'United Nations Organizations'},
			{'name': 'StsEfNtgop',
				'roles': ['Humanitarian Aid',
					'Policy and Governance',
					'Public Health and Medical'],
				'size': 4,
				'type': 'Private Sector'},
			{'name': 'WqMciHEpvW',
				'roles': ['Humanitarian Aid', 'Safety and Security'],
				'size': 2,
				'type': 'National Goverment (affected)'},
			{'name': 'RBPSRyhKnB',
				'roles': ['Policy and Governance',
					'Safety and Security',
					'Public Health and Medical'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'anHCxUfgpF',
				'roles': ['Policy and Governance',
					'Public Health and Medical',
					'Humanitarian Aid'],
				'size': 5,
				'type': 'Non-Governmental Organizations'},
			{'name': 'rNybAjtZwe',
				'roles': ['Safety and Security'],
				'size': 3,
				'type': 'Non-Governmental Organizations'},
			{'name': 'fZBPqjXajk',
				'roles': ['Public Health and Medical',
					'Humanitarian Aid',
					'Safety and Security'],
				'size': 2,
				'type': 'United Nations Organizations'},
			{'name': 'bIeRdIDaox',
				'roles': ['Humanitarian Aid', 'Safety and Security'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'UNatGPKSeY',
				'roles': ['Humanitarian Aid',
					'Public Health and Medical',
					'Safety and Security'],
				'size': 5,
				'type': 'National Goverment (affected)'},
			{'name': 'ThrOyHIBFC',
				'roles': ['Safety and Security',
					'Policy and Governance',
					'Public Health and Medical',
					'Humanitarian Aid'],
				'size': 2,
				'type': 'Non-Governmental Organizations'},
			{'name': 'MtVLcyjqGA',
				'roles': ['Public Health and Medical',
					'Safety and Security',
					'Policy and Governance',
					'Humanitarian Aid'],
				'size': 4,
				'type': 'National Goverment (affected)'},
			{'name': 'hsbQuCUWXt',
				'roles': ['Humanitarian Aid', 'Policy and Governance'],
				'size': 5,
				'type': 'United Nations Organizations'},
			{'name': 'GAMtceeBRT',
				'roles': ['Safety and Security',
					'Humanitarian Aid',
					'Public Health and Medical'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'tRXtWltdIG',
				'roles': ['Safety and Security', 'Policy and Governance'],
				'size': 3,
				'type': 'National Goverment (affected)'},
			{'name': 'rxDcXTCvip',
				'roles': ['Policy and Governance',
					'Humanitarian Aid',
					'Public Health and Medical'],
				'size': 2,
				'type': 'Non-Governmental Organizations'},
			{'name': 'zvhIaIaEsO',
				'roles': ['Safety and Security', 'Humanitarian Aid', 'Policy and Governance'],
				'size': 1,
				'type': 'Non-Governmental Organizations'},
			{'name': 'PPIHofTlEm',
				'roles': ['Safety and Security',
					'Humanitarian Aid',
					'Public Health and Medical',
					'Policy and Governance'],
				'size': 3,
				'type': 'Non-Governmental Organizations'},
			{'name': 'JctpejYavP',
				'roles': ['Safety and Security'],
				'size': 4,
				'type': 'National Goverment (affected)'},
			{'name': 'IJDZhcvODz',
				'roles': ['Humanitarian Aid', 'Policy and Governance', 'Safety and Security'],
				'size': 1,
				'type': 'National Government (non-affected)'},
			{'name': 'xBOrYNtjzZ',
				'roles': ['Policy and Governance',
					'Public Health and Medical',
					'Safety and Security'],
				'size': 3,
				'type': 'National Goverment (affected)'},
			{'name': 'AXTsaxNlBz',
				'roles': ['Humanitarian Aid', 'Policy and Governance'],
				'size': 4,
				'type': 'Private Sector'},
			{'name': 'cZrTsgyLrC',
				'roles': ['Safety and Security', 'Humanitarian Aid', 'Policy and Governance'],
				'size': 2,
				'type': 'Non-Governmental Organizations'},
			{'name': 'KtdzslwoaF',
				'roles': ['Humanitarian Aid',
					'Policy and Governance',
					'Public Health and Medical'],
				'size': 4,
				'type': 'Non-Governmental Organizations'},
			{'name': 'KnSVIuRWla',
				'roles': ['Humanitarian Aid'],
				'size': 5,
				'type': 'National Government (non-affected)'},
			{'name': 'ImeGIkMTjn',
				'roles': ['Policy and Governance',
					'Humanitarian Aid',
					'Public Health and Medical'],
				'size': 4,
				'type': 'Non-Governmental Organizations'},
			{'name': 'BbqTnwgNnb',
				'roles': ['Public Health and Medical'],
				'size': 2,
				'type': 'Private Sector'},
			{'name': 'ypSGapzUKP',
				'roles': ['Humanitarian Aid',
					'Safety and Security',
					'Public Health and Medical'],
				'size': 5,
				'type': 'Private Sector'},
			{'name': 'pCELHIFPIk',
				'roles': ['Policy and Governance'],
				'size': 3,
				'type': 'United Nations Organizations'},
			{'name': 'hhqwBhLTuX',
				'roles': ['Humanitarian Aid', 'Policy and Governance', 'Safety and Security'],
				'size': 2,
				'type': 'Non-Governmental Organizations'},
			{'name': 'gPMJYEquUK',
				'roles': ['Humanitarian Aid',
					'Safety and Security',
					'Public Health and Medical',
					'Policy and Governance'],
				'size': 5,
				'type': 'United Nations Organizations'},
			{'name': 'toEcXVOJin',
				'roles': ['Humanitarian Aid',
					'Safety and Security',
					'Public Health and Medical',
					'Policy and Governance'],
				'size': 4,
				'type': 'Private Sector'},
			{'name': 'WDPIULOalz',
				'roles': ['Policy and Governance', 'Safety and Security'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'waWyrgcuhc',
				'roles': ['Humanitarian Aid'],
				'size': 4,
				'type': 'Private Sector'}];
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
				x: width / 8,
				y: height / 8,
			},
			'Humanitarian Aid': {
				x: 7 * width / 8,
				y: height / 8,
			},
			'Safety and Security': {
				x: width / 8,
				y: 7 * height / 8,
			},
			'Policy and Governance': {
				x: 7 * width / 8,
				y: 7 * height / 8,
			},
		};

		const nodes = data.map((d, i) => {
			return {
				index: i,
				type: d.type,
				cluster: d.roles,
				radius: d.size * baseNodeSize,
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
			.style('stroke-opacity', 1)
			.each(function(d, i) {
				const content = `<b>${d.text}</b><br><i>${d.type}</i><br>${d.cluster}`;
				return $(this).tooltipster({
					content: content,
					trigger: 'hover',
					side: 'right',
				});
			});

		// nodeGroup.append('text')
		// 	.text(d => `${d.type}, ${d.cluster}`);

		const ticked = () => {
			nodeGroup.selectAll('circle')
				.attr('cx', d => d.x)
				.attr('cy', d => d.y);

			nodeGroup.selectAll('text')
				.attr('x', d => d.x)
				.attr('y', d => d.y);
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
			.html(d => wordWrap(d, 20, roleAnchors[d].x, roleAnchors[d].y));


	};

})();
