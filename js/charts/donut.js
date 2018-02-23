(() => {
	App.initDonut = (selector, eventName, rawPolicyData, rawData, rawOrgInfo, rawTimelineData, nodeScaling = 2) => {
		let data;
		let allCategories;
		let allRoles;
		let roleAnchors;
		let orgTypeSizes;

		const margin = {top: 0, right: 25, bottom: 50, left: 300};
		const width = 800;
		const height = width;

		let baseNodeSize;
		if (eventName === null) {
			baseNodeSize = 2;
		} else {
			baseNodeSize = 2;
		}

		/* STEP ONE => MASSAGE THE DATA */
		//		  meow
		//   /\_/\
		//  ( o.o )
		//   > ^ <
		//
		// (there are cats here)
		// (need to get data in this format)
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
					labelX: 20,
					labelY: 30,
					align: 'start',
					x: width / 7,
					y: height / 7,
				},
				'Humanitarian Aid': {
					labelX: width - 20,
					labelY: 30,
					align: 'end',
					x: 6 * width / 7,
					y: height / 7,
				},
				'Safety and Security': {
					labelX: 20,
					labelY: height - 30,
					align: 'start',
					x: width / 7,
					y: 6 * height / 7,
				},
				'Governance and Policy': {
					labelX: width - 20,
					labelY: height - 30,
					align: 'end',
					x: 6 * width / 7,
					y: 6 * height / 7,
				},
			};
			// Add lowered versions of the keys here, since our datasets is lowered
			Object.keys(roleAnchors).forEach(k => {
				roleAnchors[k.toLowerCase()] = roleAnchors[k];
			});

			const getEventNum = (name) => {
				const num = parseInt(
					rawTimelineData
						.filter(e => {
							return e['Timeline Event'].toLowerCase() === name.toLowerCase();
						})[0]['Event number']
				);
				return num;
			};

			// If we're not passed an eventName, plot all data
			let filteredData;
			let filteredPolicyData;
			if (eventName === null) {
				filteredData = rawData;
				filteredPolicyData = rawPolicyData;
			} else {
				// Determine which event num this one is
				const eventNum = getEventNum(eventName);

				// Otherwise initially filter our roles to just orgs involved in event
				filteredData = rawData
					.filter(d => d['Timeline Event'].toLowerCase() === eventName.toLowerCase());
				// need to filter to every event *up until this one*
				filteredPolicyData = rawPolicyData
					.filter(d => {
						const policyEventNum = getEventNum(d['Timeline Event']);
						// a policy is "happening" if it's specified event number in policyevents is the event currently selected
						const happening = (policyEventNum == eventNum);
						// a policy is still appliable if the policy started during a prior part of the timeline (relative to what was suggested)
						// AND if the value "Persistent" is true
						// note: eventNum is the thing selected by the user in the navigation
						const isPersistent = ((policyEventNum <= eventNum) && (d['Persistent'] === 'TRUE'));
						return happening || isPersistent;
					});
			}
			// Now we need to add the info we need
			data = filteredData.map(old => {
				// first initialize new var to work with
				var d = Object.assign({}, old);
				// set name
				d.name = d['Stakeholder'];
				// set roles
				d.roles = d['Stakeholder Role'].split(';').map(r => r.trim());
				// get the org
				const orgName = d['Stakeholder'].toLowerCase();
				// pull the org row
				const orgRow = rawOrgInfo.filter(o => o['Stakeholder Name'].toLowerCase() === orgName);
				if (orgRow.length === 0) {
					console.log(`error, ${orgName} has no associated data.... skipping`);
					console.log(d);
				} else {
					d.type = orgRow[0]['Organization Category'];
					if (d.type === 'International Organization') {
						d.type = 'Interational Organizations';
					}
				}
				// now need to pull the policy docs
				const policyRows = filteredPolicyData
					.filter(p => p['Policy Stakeholder'].toLowerCase() === orgName);
				d.size = policyRows.length;
				d.policies = policyRows;
				return d;
			})
			.filter(d => d !== undefined);

			orgTypeSizes = d3.nest()
				.key(d => d.type)
				.rollup(v => [d3.min(v, _ => _.size), d3.max(v, _ => _.size)])
				.entries(data)
				.reduce((acc, cval) =>{
					acc[cval.key] = cval.value;
					return acc;
				}, {});

			allCategories.forEach(c => {
				const includedOrgs = Object.keys(orgTypeSizes);
				if (!includedOrgs.includes(c)) {
					orgTypeSizes[c] = [0, 1];
				};
			});

		}

		parseData();

		let minRadius;
		let shift;
		let power;
		if (eventName === null) {
			minRadius = 4;
			shift = 1;
			power = (x0, x1) => Math.pow(x1, x0);
		} else {
			minRadius = 20;
			shift = 1;
			power = (x0, x1) => Math.pow(x0, x1);
		}
		const getRadius = (size) => power(size + shift, nodeScaling) * baseNodeSize + minRadius;

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

		const nodes = data.map((d, i) => {
			return {
				index: i,
				type: d.type,
				cluster: d.roles,
				radius: getRadius(d.size),
				text: d.name,
				size: d.size,
			};
		}).map(d => {
			return Object.assign(d, {
				x: forceCluster(d, 'x'),
				y: forceCluster(d, 'y'),
				forceX: forceCluster(d, 'x'),
				forceY: forceCluster(d, 'y'),
			});
		});


		// these are colouring *just* the borders
		const nodeColors = d3.scaleOrdinal()
			.domain(allCategories)
			.range([
				'#082b84',  // UN Orgs
				'#d7c333',  // International orgs
				'#ef7733',  // NGOs
				'#3b2f60',  // non affected states
				'#c5443c',  // affected states
				'#326921',  // Private sector
			]);

		const genScale = (domain, range) => d3.scaleLinear().domain(domain.reverse()).range(range);
		const nodeGradients = d3.scaleOrdinal()
			.domain(allCategories)
			.range([
				// UN Orgs
				genScale(
					orgTypeSizes['UN Organizations'],
					[
						'#667EAE',
						'#7C99C5',
						'#96AACF',
						'#AEBEDE',
					]),
				// International orgs
				genScale(
					orgTypeSizes['Non-UN International Organizations'],
					[
						'#DBD195',
						'#E2DEC7',
					]),
				// NGOs
				genScale(
					orgTypeSizes['NGOs'],
					[
						'#E89372',
						'#EFB9A0',
					]),
				// non affected states
				genScale(
					orgTypeSizes['Non-affected Member States'],
					[
						'#8E87B6',
						'#8C89A5',
					]),
				// affected states
				genScale(
					orgTypeSizes['Affected Member State'],
					[
						'#c91414',
						'#C15757',
					]),
				// Private sector
				genScale(
					orgTypeSizes['Private Sector'],
					[
						'#99C2A9',
						'#ADC6BC',
					]),
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
			.attr('transform', 'translate(0, 40)');

		categoryLabelGroup.append('text')
			.attr('transform', 'translate(0, -25)')
			.style('font-weight', 600)
			.text('Organization Type');

		const categoryLabels = categoryLabelGroup.selectAll('g')
			.data(allCategories)
			.enter()
			.append('g')
			.attr('transform', 'translate(0, 10)');

		categoryLabels.append('text')
			.attr('transform', (d, i) => `translate(25, ${i * 30})`)
			.style('font-size', '1.1em')
			.text(d => d);

		categoryLabels.append('rect')
			.attr('transform', (d, i) => `translate(0, ${(i * 30) - 16})`)
			.attr('width', 20)
			.attr('height', 20)
			.attr('rx', 6)
			.attr('ry', 6)
			.style('fill', d => nodeGradients(d)(orgTypeSizes[d][0]))
			.style('fill-opacity', 0.9)
			.style('stroke', d => nodeColors(d))
			.style('stroke-opacity', 1);

		legendGroup.append('text')
			.attr('transform', 'translate(0, 250)')
			.style('font-weight', 600)
			.html(wordWrap('Number of Policies Stakeholder is mandated by', 30, 0, 0));

		const legendCircleGroup = legendGroup.append('g')
			.attr('transform', 'translate(55, 287)')
			.selectAll('g')
			.data((eventName === null) ? [4, 8, 12] : [0, 2, 4])
			.enter()
			.append('g')
			.attr('transform', d => 'translate(50)');

		legendCircleGroup.append('circle')
			.attr('r', d => getRadius(d))
			.attr('cy', d => getRadius(d))
			.style('fill-opacity', 0)
			.style('stroke', 'black')
			.style('stroke-opacity', 0.8)
			.style('stroke-dasharray', ('3, 3'));

		legendCircleGroup.append('text')
			.attr('dy', d => getRadius(d) * 2 - 5)
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
		const edgeCollision = () => {
			/*
			 * Initialize a new force to prevent out of bounds
			 * We also make this bounding box a little smaller than the rect
			 * To prevent overlapping on the text
			 * We're gonna flip to polar coordinates here too, just to make things easy
			 */
			let cnodes;
			const edgeRadius = width / 2;

			const toPolar = (x, y) => {
				return [
					Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), // r
					Math.atan2(y, x),  // t
				];
			};

			const toCart = (r, t) => {
				return [
					r * Math.cos(t),  // x
					r * Math.sin(t),  // y
				];
			};

			const force = () => {
				if (cnodes !== undefined) {
					var node;
					for (var i = 0; i < cnodes.length; i++) {
						node = cnodes[i];
						const polar = toPolar(node.x - width / 2, node.y - width / 2);
						let cart;
						if (polar[0] + node.radius >= edgeRadius) {
							cart = toCart(edgeRadius - node.radius, polar[1]);
							node.x = cart[0] + width / 2;
							node.y = cart[1] + width / 2;
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
			.force('collide', d3.forceCollide(d => d.radius - (d.radius / 10)).strength(1)) // dynamic collision 10%
			.force('x', d3.forceX(d => d.forceX)
				.strength(0.05))
			.force('y', d3.forceY(d => d.forceY)
				.strength(0.05))
			.force('edge-collision', edgeCollision())
			.alphaMin(0.0001);

		// we don't have any links
		// need nodes
		const nodeGroup = bubbleGroup.append('g')
			.attr('class', 'node-group')
			.selectAll('g')
			.data(nodes)
			.enter()
			.append('g');

		nodeGroup.append('circle')
			.transition()
			.duration(500)
			.attr('r', d => d.radius)
			.style('fill', d => nodeGradients(d.type)(d.size))
			.style('fill-opacity', 0.7)
			.style('stroke', d => nodeColors(d.type))
			.style('stroke-opacity', 1);

		if (eventName !== null) {
			nodeGroup.append('text')
				.style('fill', 'white')
				.style('text-anchor', 'middle');
		}

		nodeGroup.each(function (d, i) {
			const content = `<b>${d.text}</b><br><i>${d.type}</i><br><br><b>Roles: </b>${d.cluster}<br><b>Number of Mandates:</b> ${d.size}`;
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

			if (eventName !== null) {
				nodeGroup.selectAll('text')
					.attr('x', d => {
						return d.x;
					})
					.attr('y', d => {
						return d.y;
					})
					.html(d => {
						if (d.size >= 6) {
							return wordWrap(d.text, 30, d.x, d.y);
						}
					});
			}
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
			.style('text-anchor', d => roleAnchors[d].align)
			.html(d => wordWrap(d, 14, roleAnchors[d].labelX, roleAnchors[d].labelY));


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
