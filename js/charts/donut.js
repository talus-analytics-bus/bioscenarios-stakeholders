(() => {
	App.initDonut = (selector, eventName, rawData, rawOrgInfo) => {

		let data;

		const margin = {top: 25, right: 25, bottom: 50, left: 25};
		const width = 900;
		const height = width * 0.8;
		const baseNodeSize = 10;


		/* STEP ONE => MASSAGE THE DATA */
		//		  meow
		//   /\_/\
		//  ( o.o )
		//   > ^ <
		//
		// (there are cats here)
		data = [{'name': 'AUMIpHmOui',
			'roles': ['Humanitarian Aid'],
			'size': 3,
			'type': 'United Nations Organizations'},
			{'name': 'sXWBXKnlFi',
				'roles': ['Public Health and Medical',
					'Policy and Governance',
					'Safety and Security'],
				'size': 2,
				'type': 'National Government (non-affected)'},
			{'name': 'eqGzRNaboL',
				'roles': ['Safety and Security',
					'Humanitarian Aid',
					'Humanitarian Aid',
					'Policy and Governance'],
				'size': 5,
				'type': 'National Government (non-affected)'},
			{'name': 'OCnGzaxFKZ',
				'roles': ['Humanitarian Aid',
					'Public Health and Medical',
					'Humanitarian Aid',
					'Humanitarian Aid'],
				'size': 1,
				'type': 'Non-Governmental Organizations'},
			{'name': 'hZioLhrLDy',
				'roles': ['Policy and Governance'],
				'size': 4,
				'type': 'National Government (non-affected)'},
			{'name': 'FBOtStynqL',
				'roles': ['Policy and Governance', 'Humanitarian Aid'],
				'size': 5,
				'type': 'Private Sector'},
			{'name': 'QsbVdReyxW',
				'roles': ['Humanitarian Aid', 'Public Health and Medical'],
				'size': 3,
				'type': 'National Goverment (affected)'},
			{'name': 'tLRkWsKeMb',
				'roles': ['Safety and Security'],
				'size': 1,
				'type': 'United Nations Organizations'},
			{'name': 'QxRsLjgnvH',
				'roles': ['Safety and Security', 'Policy and Governance', 'Humanitarian Aid'],
				'size': 2,
				'type': 'Private Sector'},
			{'name': 'MkPkKNhinJ',
				'roles': ['Safety and Security',
					'Public Health and Medical',
					'Policy and Governance',
					'Public Health and Medical'],
				'size': 5,
				'type': 'National Goverment (affected)'},
			{'name': 'XfRdUyujLQ',
				'roles': ['Policy and Governance',
					'Humanitarian Aid',
					'Public Health and Medical'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'jryPwZPAAI',
				'roles': ['Safety and Security'],
				'size': 1,
				'type': 'Private Sector'},
			{'name': 'gvRUCeafia',
				'roles': ['Public Health and Medical', 'Public Health and Medical'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'RUtHvzpzuR',
				'roles': ['Policy and Governance', 'Policy and Governance'],
				'size': 4,
				'type': 'Private Sector'},
			{'name': 'KGbpGuwLCM',
				'roles': ['Humanitarian Aid'],
				'size': 1,
				'type': 'National Government (non-affected)'},
			{'name': 'uBQeljgGIc',
				'roles': ['Public Health and Medical'],
				'size': 3,
				'type': 'Non-Governmental Organizations'},
			{'name': 'hPMcukXjlh',
				'roles': ['Policy and Governance',
					'Policy and Governance',
					'Policy and Governance'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'oDuPznSBie',
				'roles': ['Safety and Security',
					'Policy and Governance',
					'Policy and Governance',
					'Policy and Governance'],
				'size': 3,
				'type': 'Non-Governmental Organizations'},
			{'name': 'ImYWAKIVdB',
				'roles': ['Public Health and Medical',
					'Humanitarian Aid',
					'Humanitarian Aid',
					'Humanitarian Aid'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'GbXGvhNtYT',
				'roles': ['Policy and Governance',
					'Safety and Security',
					'Public Health and Medical',
					'Policy and Governance'],
				'size': 2,
				'type': 'National Goverment (affected)'},
			{'name': 'LMEdhOdrHr',
				'roles': ['Policy and Governance'],
				'size': 2,
				'type': 'Private Sector'},
			{'name': 'ajVsXdPNPQ',
				'roles': ['Public Health and Medical', 'Policy and Governance'],
				'size': 4,
				'type': 'National Goverment (affected)'},
			{'name': 'CahychrYaR',
				'roles': ['Public Health and Medical', 'Policy and Governance'],
				'size': 1,
				'type': 'National Government (non-affected)'},
			{'name': 'OoEiyMlERq',
				'roles': ['Humanitarian Aid'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'LtTsGaAwpP',
				'roles': ['Policy and Governance',
					'Policy and Governance',
					'Policy and Governance',
					'Policy and Governance'],
				'size': 4,
				'type': 'Private Sector'},
			{'name': 'ZYCtAIOjtm',
				'roles': ['Humanitarian Aid'],
				'size': 2,
				'type': 'United Nations Organizations'},
			{'name': 'ZESEJRSwkL',
				'roles': ['Policy and Governance', 'Humanitarian Aid', 'Humanitarian Aid'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'ssBqvlRJAd',
				'roles': ['Humanitarian Aid',
					'Public Health and Medical',
					'Humanitarian Aid'],
				'size': 5,
				'type': 'Private Sector'},
			{'name': 'bSTjHxjQPI',
				'roles': ['Policy and Governance', 'Safety and Security', 'Humanitarian Aid'],
				'size': 4,
				'type': 'United Nations Organizations'},
			{'name': 'rEIQfRVDTM',
				'roles': ['Policy and Governance',
					'Safety and Security',
					'Humanitarian Aid',
					'Safety and Security'],
				'size': 3,
				'type': 'Non-Governmental Organizations'},
			{'name': 'MORKNDKfXS',
				'roles': ['Humanitarian Aid',
					'Humanitarian Aid',
					'Policy and Governance',
					'Public Health and Medical'],
				'size': 3,
				'type': 'National Government (non-affected)'},
			{'name': 'EpVtcTYukM',
				'roles': ['Humanitarian Aid', 'Safety and Security', 'Humanitarian Aid'],
				'size': 4,
				'type': 'National Government (non-affected)'},
			{'name': 'CMwihLGseI',
				'roles': ['Safety and Security',
					'Public Health and Medical',
					'Humanitarian Aid',
					'Humanitarian Aid'],
				'size': 5,
				'type': 'United Nations Organizations'},
			{'name': 'YhUFfgxbKD',
				'roles': ['Policy and Governance',
					'Policy and Governance',
					'Humanitarian Aid'],
				'size': 3,
				'type': 'Private Sector'},
			{'name': 'EdkRXZyIhZ',
				'roles': ['Humanitarian Aid',
					'Public Health and Medical',
					'Safety and Security'],
				'size': 2,
				'type': 'Non-Governmental Organizations'},
			{'name': 'yJaCbrrXdj',
				'roles': ['Humanitarian Aid'],
				'size': 4,
				'type': 'United Nations Organizations'},
			{'name': 'gOrZSKxdYx',
				'roles': ['Policy and Governance'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'QcXYvyRHXX',
				'roles': ['Public Health and Medical',
					'Policy and Governance',
					'Public Health and Medical'],
				'size': 5,
				'type': 'United Nations Organizations'},
			{'name': 'zhLHaExLuL',
				'roles': ['Safety and Security',
					'Policy and Governance',
					'Policy and Governance'],
				'size': 2,
				'type': 'United Nations Organizations'},
			{'name': 'uEMfAaXJWx',
				'roles': ['Policy and Governance',
					'Safety and Security',
					'Safety and Security',
					'Policy and Governance'],
				'size': 4,
				'type': 'National Government (non-affected)'},
			{'name': 'lnlvCmWLqa',
				'roles': ['Policy and Governance',
					'Public Health and Medical',
					'Safety and Security',
					'Humanitarian Aid'],
				'size': 5,
				'type': 'National Goverment (affected)'},
			{'name': 'vcybogdcKf',
				'roles': ['Safety and Security',
					'Safety and Security',
					'Public Health and Medical'],
				'size': 2,
				'type': 'National Government (non-affected)'},
			{'name': 'MfkhrDPZcA',
				'roles': ['Policy and Governance', 'Public Health and Medical'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'VDuoPOuDIx',
				'roles': ['Humanitarian Aid',
					'Policy and Governance',
					'Safety and Security',
					'Safety and Security'],
				'size': 3,
				'type': 'United Nations Organizations'},
			{'name': 'HYIQXzKmsh',
				'roles': ['Humanitarian Aid',
					'Policy and Governance',
					'Policy and Governance',
					'Humanitarian Aid'],
				'size': 1,
				'type': 'Private Sector'},
			{'name': 'rSwIeFeMuC',
				'roles': ['Humanitarian Aid',
					'Public Health and Medical',
					'Public Health and Medical',
					'Public Health and Medical'],
				'size': 1,
				'type': 'United Nations Organizations'},
			{'name': 'neEKsTJncj',
				'roles': ['Safety and Security', 'Policy and Governance'],
				'size': 1,
				'type': 'National Goverment (affected)'},
			{'name': 'yGDWBEgJYF',
				'roles': ['Safety and Security',
					'Safety and Security',
					'Public Health and Medical'],
				'size': 1,
				'type': 'National Government (non-affected)'},
			{'name': 'WgjDrpRaFa',
				'roles': ['Safety and Security'],
				'size': 3,
				'type': 'National Goverment (affected)'},
			{'name': 'PiiMIYJuPc',
				'roles': ['Policy and Governance'],
				'size': 4,
				'type': 'National Government (non-affected)'}];
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
				x: width / 4,
				y: width / 4,
			},
			'Humanitarian Aid': {
				x: 3 * width / 4,
				y: width / 4,
			},
			'Safety and Security': {
				x: width / 4,
				y: 3 * width / 4,
			},
			'Policy and Governance': {
				x: 3 * width / 4,
				y: 3 * width / 4,
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
			.range(['purple', 'blue', 'red', 'green', 'yellow']);

		const chart = d3.select(selector)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		// first do gridlines
		const gridlines = chart.append('g')
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

		// now labels
		const labelGroup = chart.append('g')
			.classed('cluster-labels', true);

		labelGroup.selectAll('text')
			.data(allRoles)
			.enter()
			.append('text')
			.attr('x', d => roleAnchors[d].x)
			.attr('y', d => roleAnchors[d].y)
			.style('font-size', '1em')
			.style('font-weight', 600)
			.text(d => d);

		// now force layout
		// first setup simulation
		let value;
		const forceCluster = (d, direction) => {
			const numClusters = d.cluster.length;
			if (numClusters === 1) {
				value = roleAnchors[d.cluster[0]][direction];
			} else {
				value = d.cluster
					.reduce((acc, cval) => acc + roleAnchors[cval][direction], 0) / numClusters;
			}
			return value;
		};

		const simulation = d3.forceSimulation(nodes)
			.force('collide', d3.forceCollide(d => d.radius - 2))
			.force('x', d3.forceX(d => forceCluster(d, 'x'))
				.strength(2))
			.force('y', d3.forceY(d => forceCluster(d, 'y'))
				.strength(2));

		// we don't have any links
		// need nodes
		const nodeGroup = chart.append('g')
			.attr('class', 'node-group')
			.selectAll('g')
			.data(nodes)
			.enter()
			.append('g');

		nodeGroup.append('circle')
			.attr('r', d => d.radius)
			.style('fill', d => nodeColors(d.type))
			.style('fill-opacity', 0.2)
			.style('stroke', d => d3.color(nodeColors(d.type)).darker())
			.style('stroke-opacity', 1);

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


	};

})();
