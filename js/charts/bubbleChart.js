(() => {
	App.initBubbleChart = (selector, eventName, rawPolicyData, rawData, rawOrgInfo, rawTimelineData, nodeScaling = 2) => {
		let data;
		let allCategories;
		let allRoles;
		let roleAnchors;
		let orgTypeSizes;

		const margin = {top: 25, right: 25, bottom: 50, left: 300};
		const width = 800;
		const height = width;

		let baseNodeSize;
		if (eventName === null) {
			baseNodeSize = 1;
		} else {
			baseNodeSize = 1;
		}

		// const eventsWithArrow = [
		// 	'Suspicion of deliberate use',
		// 	'Investigative response',
		// 	'Confirmation of deliberate use',
		// ];
		// if (eventsWithArrow.includes(eventName) === false) {
		// 	$('.right-arrow-container').hide();
		// } else {
		// 	$('.right-arrow-container').show();
		// }

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

			const getRoles = (roleStr) => {
				return roleStr.split(';').map(r => r.trim()).filter(r => r !== '');
			};

			// If we're not passed an eventName, plot all data
			let filteredData;
			let filteredPolicyData;
			var seenDocs = [];
			const uniqueFields = ['Policy Document', 'Policy Stakeholder'];
			if (eventName === null) {
				// so there was a bug that on the 'show all' view, multiple nodes were being generated for
				// a single org. This is because a single org could be (and probably will be) involved in
				// several events. We need to prune this list of duplicates and concat the roles together
				filteredData = d3.nest()
					.key(d => d['Stakeholder']) // group by name
					.rollup(v => {
						return {
							primaryRoles: Util.unique(
								v.reduce(
									(acc, cval) => acc.concat(getRoles(cval['Stakeholder Role'])),
									[]
								)
							),
							secondaryRoles: Util.unique(
								v.reduce(
									(acc, cval) => acc.concat(getRoles(cval['Secondary Role'])),
									[]
								)
							),
						};
					})
					.entries(rawData)
					.map(d => {
						return {
							'Stakeholder': d.key,
							'Stakeholder Role': d.value.primaryRoles.join(';'),
							'Secondary Role': d.value.secondaryRoles.join(';'),
							'Timeline Event': 'all',
						};
					});
				filteredPolicyData = rawPolicyData
					.filter(d => {
						// need to filter again to just use unique docs
						const isSeen = seenDocs.filter(s => {
							return uniqueFields.reduce((acc, k) => acc && (s[k] === d[k]), true);
						}).length > 0;
						if (isSeen) {
							return false;
						} else {
							seenDocs.push(d);
							return true;
						}
					});
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
						// a policy is 'happening' if it's specified event number in policyevents
						// is the event currently selected
						const happening = (policyEventNum === eventNum);
						// a policy is still applicable if the policy started during a prior part
						// of the timeline(relative to what was suggested)
						// AND if the value 'Persistent' is true
						// note: eventNum is the thing selected by the user in the navigation
						const isPersistent = ((policyEventNum <= eventNum) && (d['Persistent'] === 'TRUE'));
						return happening || isPersistent;
					})
					.sort((a, b) => d3.ascending(getEventNum(a['Timeline Event']), getEventNum(b['Timeline Event'])))
					.filter(d => {
						// need to filter again to just use unique docs
						const isSeen = seenDocs.filter(s => {
							return uniqueFields.reduce((acc, k) => acc && (s[k] === d[k]), true);
						}).length > 0;
						if (isSeen) {
							return false;
						} else {
							seenDocs.push(d);
							return true;
						}
					});
			}
			// Now we need to add the info we need
			data = filteredData.map(old => {
				// first initialize new var to work with
				var d = Object.assign({}, old);
				// set name
				d.name = d['Stakeholder'];
				// set roles
				d.roles = getRoles(d['Stakeholder Role']);
				d.secondaryRoles = getRoles(d['Secondary Role']).filter(r => !d.roles.includes(r));
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
				.reduce((acc, cval) => {
					acc[cval.key] = cval.value;
					return acc;
				}, {});


			allCategories.forEach(c => {
				const includedOrgs = Object.keys(orgTypeSizes);
				if (!includedOrgs.includes(c)) {
					orgTypeSizes[c] = [0, 1];
				}
			});

		}

		parseData();

		let minRadius = 20;
		let shift;
		let power;
		if (eventName === null) {
			power = (x0, x1) => Math.exp(nodeScaling) * Math.pow(x0, 0.8);
		} else {
			power = (x0, x1) => Math.exp(nodeScaling) * Math.pow(x0, 0.8);
		}
		// const getRadius = (size) => power(size, nodeScaling) * baseNodeSize + minRadius;

		const maxSize = 15;
		const sizeScale = d3.scaleLinear()
			.domain([1, maxSize])
			.range([35, 120]);
		const getRadius = (x) => {
			if (x === 0) {
				return 10;
			} else {
				return sizeScale(x);
			}
		};

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

		var sizeSum = 0;
		var nodeCount = 0;
		const nodes = data
			.filter(d => d.name !== '')
			.map((d, i) => {
				sizeSum += d.size;
				nodeCount += 1;
				return {
					index: i,
					type: d.type,
					cluster: d.roles,
					cluster2: d.secondaryRoles,
					radius: getRadius(d.size),
					text: d.name,
					abbrev: getShortName(d.name),
					size: d.size,
					policies: d.policies,
				};
			}).map(d => {
				// const doLabel = d.size >= (sizeSum / nodeCount);
				let doLabel = true;
				if ((d.size === 1) && (d.abbrev.length > 25)) {
					doLabel = false;
				}
				return Object.assign(d, {
					// x: forceCluster(d, 'x') + Math.random() * 100 - 50,
					x: (forceCluster(
						Object.assign(
							Object.assign({}, d),
							{
								cluster: d.cluster.concat(d.cluster2),
							}), 'x') || 0) + Math.random() * 100 - 50,
					// y: forceCluster(d, 'y') + Math.random() * 100 - 50,
					y: (forceCluster(
						Object.assign(
							Object.assign({}, d),
							{
								cluster: d.cluster.concat(d.cluster2),
							}), 'y') || 0) + Math.random() * 100 - 50,
					forceX: forceCluster(d, 'x'),
					forceY: forceCluster(d, 'y'),
					secondaryForceX: forceCluster(
						Object.assign(
							Object.assign({}, d),
							{
								cluster: d.cluster2,
							}), 'x') || 0,
					secondaryForceY: forceCluster(
						Object.assign(
							Object.assign({}, d),
							{
								cluster: d.cluster2,
							}), 'y') || 0,
					doLabel: doLabel,
				});
			})
			.filter(d => d.size !== 0);    // NOTE: remove this to include zero-mandate nodes

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
						'#667EAE',
						// '#7C99C5',
						// '#96AACF',
						// '#AEBEDE',
					]),
				// International orgs
				genScale(
					orgTypeSizes['Non-UN International Organizations'],
					[
						'#DBD195',
						'#DBD195',
						// '#E2DEC7',
					]),
				// NGOs
				genScale(
					orgTypeSizes['NGOs'],
					[
						// '#E89372',
						'#EFB9A0',
						'#EFB9A0',
					]),
				// non affected states
				genScale(
					orgTypeSizes['Non-affected Member States'],
					[
						'#8E87B6',
						'#8E87B6',
						// '#8C89A5',
					]),
				// affected states
				genScale(
					orgTypeSizes['Affected Member State'],
					[
						// '#c91414',
						'#C15757',
						'#C15757',
					]),
				// Private sector
				genScale(
					orgTypeSizes['Private Sector'],
					[
						// '#99C2A9',
						'#ADC6BC',
						'#ADC6BC',
					]),
			]);

		const chart = d3.select(selector)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g');

		/* LEGEND */
		// TODO @steph Adjust here for legend spacing (increase number for more space)
		const legendGroup = chart.append('g')
			.attr('transform', `translate(0, ${margin.top + 150})`)
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
			.attr('transform', (d, i) => `translate(27, ${i * 30})`)
			.style('font-size', '1.1em')
			.text(d => d);

		categoryLabels.append('rect')
			.attr('transform', (d, i) => `translate(2, ${(i * 30) - 13})`)
			.attr('width', 15)
			.attr('height', 15)
			.attr('rx', 3)
			.attr('ry', 3)
			.style('fill', d => nodeGradients(d)(orgTypeSizes[d][0]))
			.style('fill-opacity', 0.9)
			.style('stroke', d => nodeColors(d))
			.style('stroke-opacity', 1);

		legendGroup.append('text')
			.attr('transform', 'translate(0, 250)')
			.style('font-weight', 600)
			.html(wordWrap('Policies per stakeholder', 30, 0, 0));

		const labels = ['Fewer', '', 'More'];
		const legendCircleGroup = legendGroup.append('g')
			.attr('transform', 'translate(55, 287)')
			.selectAll('g')
			// .data((eventName === null) ? [2, 6, 9] : [1, 2, 4])
			.data([1, 3, 7])
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
			.style('text-anchor', 'middle')
			.style('font-size', '1em')
			.html((d, i) => {
				if (i !== 1) {
					const offset = getRadius(d) * 2 - 30;
					return `
						<tspan x="0" y="0" dy="${offset}">${labels[i]}</tspan>
						<tspan x="0" y="0" dy="${offset + 15}">Policies</tspan>
					`;
				}
			});

		/* BUBBLES */
		const bubbleGroup = chart.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)
			.style('background', 'white');

		// bubbleGroup.append('rect')
		// 	.attr('width', width)
		// 	.attr('height', height)
		// 	.style('fill-opacity', 0)
		// 	.style('stroke', 'black')
		// 	.style('stroke-opacity', 0.2);

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
			.force('collide', d3.forceCollide(d => d.radius - (d.radius / 20)).strength(0.75)) // dynamic collision n%
			.force('x', d3.forceX(d => d.forceX)
				.strength(0.06))
			.force('y', d3.forceY(d => d.forceY)
				.strength(0.06))
			.force('secondary-x', d3.forceX(d => d.secondaryForceX)
				.strength(d => (d.secondaryForceX === 0) ? 0 : 0.024))
			.force('secondary-y', d3.forceY(d => d.secondaryForceY)
				.strength(d => (d.secondaryForceY === 0) ? 0 : 0.024))
			.force('edge-collision', edgeCollision())
			.alphaMin(0.0001);

		// we don't have any links
		// need nodes
		const nodeGroup = bubbleGroup.append('g')
			.attr('class', 'node-group')
			.selectAll('g')
			.data(nodes)
			.enter()
			.append('g')
			.style('cursor', 'default')
			.attr('name', d => d.abbrev);

		nodeGroup.append('circle')
			.transition()
			.duration(1200)
			.attr('r', d => d.radius)
			.style('fill', d => nodeGradients(d.type)(d.size))
			// .style('fill', d => nodeColors(d.type))
			.style('fill-opacity', 0.9)
			.style('stroke', d => nodeColors(d.type))
			.style('stroke-opacity', 1);

		nodeGroup.append('text')
			.style('fill', 'white')
			.style('text-anchor', 'middle')
			.style('pointer-events', 'none')
			.attr('class', d => {
				if (d.doLabel) {
					return 'bubble-label';
				}
			})
			.style('font-size', d => {
				if ((eventName === null) || ((d.size <= 2) && (d.abbrev === d.text))) {
					return '0.8em';
				} else {
					return '1em';
				}
			});

		nodeGroup.on('mouseover', function () {
			// $('g.tooltipstered').tooltipster('close');
			d3.select(this)
				.select('circle')
				.style('stroke-width', 2)
				.style('stroke', 'black');
		}).on('mouseout', function () {
			d3.select(this)
				.select('circle')
				.style('stroke-width', 1)
				.style('stroke', d => nodeColors(d.type));
		});

		nodeGroup.each(function (d, i) {
			const splitRoles = d.cluster.map(r => r.split(' ').map(Util.capitalize).join(' ')).join(', ');
			const splitSecondaryRoles = d.cluster2.map(r => r.split(' ').map(Util.capitalize).join(' ')).join(', ');

			const primaryTooltip = `
				<img class="info-tooltip"
					src="img/info.png"
					data-contents="<b>Primary roles</b> describe the area(s) in which a stakeholder is mandated to play a central role in coordination or response operations. A stakeholder may have one or more primary role." />
			`;

			const secondaryTooltip = `
				<img class="info-tooltip"
					src="img/info.png"
					data-contents="<b>Secondary roles</b> describe the area(s), if any, that a stakeholder is mandated to support in a non-primary role, for instance, by providing governance and oversight, or by supporting partnerships." />
			`;

			let orgtype = d.type;
			if (d.type.endsWith('s')){
				orgtype = orgtype.slice(0, -1);
			}

			const mandateList = d.policies
				.sort((a, b) => d3.ascending(a['Policy Document'], b['Policy Document']))
				.map(p => {
					return `
						<ul class="dashed">
							<li>${p['Policy Document']}</li>
						</ul>
					`;
				}).join('');
			let splitSecondaryRolesText;
			if (d.cluster2.length === 0) {
				splitSecondaryRolesText = '';
			} else {
				splitSecondaryRolesText = `
					<div class="tooltip-section">
						<div class="tooltip-section-header">
							${splitSecondaryRoles}
						</div>
						<div class="tooltip-section-contents">
							Secondary Role${(d.cluster2.length > 1) ? 's' : ''}
							${secondaryTooltip}
						</div>
					</div>
				`;
			}

			const content = `
				<div class="tooltip-contents">
					<div class="tooltip-header">
						<div class="tooltip-primary-header">
						${d.text}
						</div>
						<div class="tooltip-sub-header">
						${orgtype}
						</div>
					</div>
					
					<div class="tooltip-section">
						<div class="tooltip-section-header">
							${splitRoles}
						</div>
						<div class="tooltip-section-contents">
							Primary Role${(d.cluster.length > 1) ? 's' : ''}
							${primaryTooltip}
						</div>
					</div>
					
					${splitSecondaryRolesText}
					
					<div class="tooltip-section">
						<div class="tooltip-section-header">
							Mandates
						</div>
						<div class="tooltip-section-contents">
							<div class="tooltip-list">
								${mandateList}
							</div>
						</div>
					</div>
				</div>
			`;
			// const content = `<b>${d.text}</b>
			// 	<br><i>${d.type}</i>
			// 	<br><br><b>Roles: </b>${splitRoles}
			// 	${splitSecondaryRolesText}
			// 	<br><br><b>Mandates: </b>${d.size}`;
			// const splitRoles = d.cluster.concat(d.cluster2).map(r => r.split(' ').map(Util.capitalize).join(' ')).join(', ');
			// const content = `<b>${d.text}</b>` +
			// 	`<br><i>${d.type}</i>` +
			// 	`<br><br><b>Roles: </b>${splitRoles}` +
			// 	`<br><br><b>Number of Mandates:</b> ${d.size}`;
			return $(this).tooltipster({
				content: content,
				trigger: 'hover',
				side: 'right',
				delay: [0, 100],
				animationDuration: [350, 0],
				theme: ['tooltipster-shadow', 'tooltipster-talus'],
				interactive: true,
				functionReady: () => {
					$('.tooltip-contents .info-tooltip')
						.each(function() {
							$(this).tooltipster({
								content: $(this).data('contents'),
								delay: 0,
								trigger: 'hover',
							});
						});
				},
			});
		});

		const ticked = () => {
			nodeGroup.selectAll('circle')
				.attr('cx', d => d.x)
				.attr('cy', d => d.y);

			const yOffset = 1;
			nodeGroup.selectAll('.bubble-label')
				.attr('x', d => {
					return d.x;
				})
				.attr('y', d => {
					return d.y + yOffset;
				})
				.html(d => {
					let newText;
					if (d.size <= 3) {
						newText = d.abbrev;
					} else if (d.text.length > 30) {
						if (d.size > 7) {
							newText = d.text;
						} else {
							newText = d.abbrev;
						}
					} else {
						newText = d.text;
					}

					if (newText.length >= 7) {
						return wordWrap(newText, 17, d.x, d.y + yOffset, i => `${i * 1.25}em`);
					} else {
						return newText;
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
			.style('text-anchor', d => roleAnchors[d].align)
			.html(d => wordWrap(d, 14, roleAnchors[d].labelX, roleAnchors[d].labelY));


	};

	function getShortName(s) {
		const shortname = /\(([A-Z ]+)\)/.exec(s);
		if (shortname === null) {
			return s;
		} else {
			return shortname[1];
		}
	}

})();
