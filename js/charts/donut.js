(() => {
	App.initDonut = (selector, eventName, rawData, rawOrgInfo) => {

		/*
		 * Sooo helpful https://bl.ocks.org/kerryrodden/477c1bfb081b783f80ad
		 *
		 */

		/* In order to display this data, we need the associated 'heights'
		 * for each bar. We have 3 heights to establish:
		 * 1. Category height (innermost) -> static
		 * 2. Org Category height -> determined by number of orgs
		 * 3. Org height -> How big is each org -> static
		 */
		// chart constants
		const width = 900;
		const height = width;
		const innerRadius = 100;
		const roleHeight = 50;   // how "tall" is the innermost ring
		const orgHeight = 30;    // how "tall" is each org listed
		const coverHeight = 30;

		// colours
		const innerColor = '#756a65';
		const textColor = '#ffffff';
		const selectedColor = '#ccc9c8';

		// parseRawData declarations - gonna bind to these
		let allRoles;
		let allCategories;
		let allStakeholders;
		let data;
		let orgInfo;
		let catArcs;
		let orgPositions;
		let coverPositions;

		/* STEP ONE => MASSAGE THE DATA */
		//		  meow
		//   /\_/\
		//  ( o.o )
		//   > ^ <
		//
		// (there used to be cats here)
		// (leaving this one)
		function parseRawData() {
			data = rawData.filter(d => d['Timeline Event'] === eventName);
			orgInfo = rawOrgInfo;
			allRoles = [
				'public health and medical',
				'humanitarian aid',
				'governance and policy',
				'safety and security',
			];
			const order = {
				'NATIONAL GOVERNMENT (AFFECTED)': 0,
				'NATIONAL GOVERNMENT (NON-AFFECTED)': 1,
				'UN ORGANIZATION': 2,
				'NGO': 3,
				'PRIVATE SECTOR': 4,
			};
			allCategories = d3.nest()
				.key(d => d['Organization Category'].toUpperCase())
				.entries(orgInfo)
				.map(d => d.key)
				.sort((a, b) => order[a] > order[b]);

			allStakeholders = d3.nest()
				.key(d => d)
				.entries(data.map(d => d['Stakeholder']))
				.map(d => d.key);

			let cdepth;
			cdepth = 0;
			orgPositions = orgInfo.map(d => {
				d.category = d['Organization Category'].toUpperCase();
				return d;
			})
			.sort((a, b) => order[a.category] > order[b.category])
			.filter(d => {
				return allStakeholders.includes(d['Stakeholder Name']);
			})
			.map(d => {
				d.level = cdepth;
				cdepth += 1;
				return d;
			});

			cdepth = 0;
			coverPositions = allCategories.map(d => {
				const newData = {
					name: d,
					level: cdepth,
				};
				cdepth += 1;
				return newData;
			});

			catArcs = allRoles.map(d => {
				// pull out only the data that is associated with this category
				// and join with org info for each row
				const catData = data.filter(x => x['Stakeholder Role'].indexOf(d) !== -1)
				// now join with orgInfo
					.map((x) => {
						// making fundamental assumption here that every org in data is
						// listed in orgInfo
						const orgType = orgPositions.filter(
							y => y['Stakeholder Name'] === x['Stakeholder'])[0];
						x['Organization Category'] = orgType['Organization Category'];
						x.level = orgType.level;
						return x;
					});
				// // now group by the type of org
				// const catCounts = d3.nest()
				// 	.key(x => x['Organization Category'].toUpperCase())
				// 	.entries(catData)
				// 	.sort((a, b) => a.key < b.key);
				// // pull out just the org types
				// const orgTypes = catCounts.map(x => x.key);
				// // Count how many entries in each
				// const orgHeights = catCounts.map(function (x) {
				// 	return {
				// 		name: x.key,
				// 		height: x.values.length,
				// 	};
				// });
				// sort catData by category
				// const sortedCatData = catData.sort((a, b) => {
				// 	return a['Organization Category'] < b['Organization Category'];
				// });
				return {
					name: d,
					data: catData,
					// orgCounts: catCounts,
					// orgTypes: orgTypes,
					// orgHeights: orgHeights,
					// sortedCatData: sortedCatData,
				};
			})
			// pause to sort
			.sort((a, b) => a.name > b.name)
			// Now we append arc data to the catData
			.map((d, i) => {
				// first figure out given how many roles we have,
				// what percentage of the circle should each role take up
				const arcPortion = (1 / allRoles.length) * 2 * Math.PI;
				// now let's figure out these group-consistent arcs
				const startAngle = i * arcPortion;
				const endAngle = (i + 1) * arcPortion;
				const padding = 0.0;
				// we have a couple different sub-arcs
				// role arcs
				const rootData = {
					name: d.name,
					innerRadius: innerRadius,
					outerRadius: innerRadius + roleHeight,
					startAngle: startAngle,
					endAngle: endAngle,
					padding: 0.01,
				};
				const orgData = d.data.map(x => {
					return {
						name: x['Stakeholder'],
						type: x['Organization Category'].toUpperCase(),
						innerRadius: innerRadius + roleHeight + (x.level * orgHeight),
						outerRadius: innerRadius + roleHeight + ((x.level + 1) * orgHeight),
						startAngle: startAngle,
						endAngle: endAngle,
						padding: padding,
					};
				});

				const currentCats = d3.nest()
					.key(x => x.type)
					.entries(orgData)
					.map(x => x.key);
				const covers = coverPositions.filter(x => currentCats.includes(x.name))
					.map(x => {
						return {
							name: x.name,
							startAngle: startAngle,
							endAngle: endAngle,
							padding: padding,
							innerRadius: innerRadius + roleHeight + (x.level * coverHeight),
							outerRadius: innerRadius + roleHeight + ((x.level + 1) * coverHeight),
						};
					});

				return {
					startAngle: startAngle,
					endAngle: endAngle,
					padding: padding,
					rootArc: rootData,
					orgArcs: orgData,
					coverArcs: covers,
				};
			});
			const flatOrgs = catArcs.map(d => d.orgArcs)
				.reduce((acc, cval) => acc.concat(cval), []);
			const orgsByCat = d3.nest()
				.key(d => d.type)
				.entries(flatOrgs);
			catArcs.orgs = orgsByCat;
			const flatCovers = catArcs.map(d => d.coverArcs)
				.reduce((acc, cval) => acc.concat(cval), []);
			const coversByCat = d3.nest()
				.key(d => d.name)
				.entries(flatCovers);
			catArcs.covers = coversByCat;
		}
		parseRawData();

		// one more colour after we set data
		const categoryColorScale = d3.scaleOrdinal()
			.domain(allCategories)
			.range(['#66a9d8', '#4682b4', '#2c6993', '#18537a', d3.color('#18537a').darker()]);

		/* STEP TWO => DISPLAY THE DATA */
		// declare and transform chart
		const chart = d3.select(selector)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		// Arc function responsible for setting *all* visible arcs
		const arc = d3.arc()
			.innerRadius(d => d.innerRadius)
			.outerRadius(d => d.outerRadius)
			.startAngle(d => d.startAngle)
			.endAngle(d => d.endAngle)
			.padAngle(d => d.padding);

		// Arc function responsible for drawing textPath arcs
		const textArc = d3.arc()
			.outerRadius(d => d.innerRadius + ((d.outerRadius - d.innerRadius) / 2))
			.innerRadius(d => d.innerRadius + ((d.outerRadius - d.innerRadius) / 2))
			.startAngle(d => d.startAngle + (d.offset || 0))
			.endAngle(d => d.endAngle);

		// console.log(catArcs);
		// Start by drawing 4 (number of categories) groups,
		// these groups will act in tandem for start and end angles
		const arcGroups = chart.selectAll('g')
			.data(catArcs)
			.enter()
			.append('g');

		// now innermost arcs
		arcGroups.append('path')
			.attr('d', d => arc(d.rootArc))
			.style('fill', innerColor)
			.attr('value', d => d.name)
			.classed('inner-arc-group', true);

		// need to set offsets
		// append path for text
		chart.append('defs')
			.selectAll('path')
			.data(catArcs)
			.enter()
			.append('path')
			.attr('d', d => textArc(d.rootArc))
			.attr('id', (d, i) => `inner-arc-label-path-${i}`);

		const innerArcLabels = chart.append('g')
			.selectAll('text')
			.data(catArcs)
			.enter()
			.append('text')
			.append('textPath')
			.attr('xlink:href', (d, i) => `#inner-arc-label-path-${i}`)
			.style('fill', textColor)
			.style('font-size', '1em')
			.style('text-anchor', 'start')
			.text(d => d.rootArc.name);

		// TIME FOR COVERS
		var selected = null;
		catArcs.covers.forEach(d => {
			chart.append('g')
				.selectAll('path')
				.data(d.values)
				.enter()
				.append('path')
				.attr('d', arc)
				.attr('value', d => `cover-${d.name}`)
				.style('fill', x => categoryColorScale(x.name))
				.on('click', function(x) {
					const cover = d3.selectAll(`[value="cover-${x.name}"]`);
					if (selected === x.name) {
						cover.transition()
							.duration(500)
							.attrTween('d', function(y) {
							var interpolate = d3.interpolate(y.innerRadius + 5, y.innerRadius + coverHeight);
							return function(t) {
								y.outerRadius = interpolate(t);
								return arc(y);
							};
						});
						selected = null;
					} else {
						cover.transition()
							.duration(500)
							.attrTween('d', function(y) {
							var interpolate = d3.interpolate(y.outerRadius, y.innerRadius + 5);
							return function(t) {
								y.outerRadius = interpolate(t);
								return arc(y);
							};
						});
						selected = x.name;
					}
				});
		});

		// cover labels
		chart.append('defs')
			.selectAll('path')
			.data(catArcs.covers)
			.enter()
			.append('path')
			.attr('d', d => {
				return textArc({
					startAngle: 0,
					endAngle: d.values[0].endAngle,
					innerRadius: d.values[0].innerRadius,
					outerRadius: d.values[0].outerRadius,
				});
			})
			.attr('id', (d, i) => `cover-arc-label-path-${i}`);

		chart.append('g')
			.selectAll('text')
			.data(catArcs.covers)
			.enter()
			.append('text')
			.append('textPath')
			.attr('xlink:href', (d, i) => `#cover-arc-label-path-${i}`)
			.style('fill', d => {
				if (d.values[0].startAngle !== 0) {
					return 'black';
				} else {
					return textColor;
				}
			})
			.style('font-size', '1em')
			.style('text-anchor', 'start')
			.text(d => d.values[0].name);

		/* OUTER */
		// now time for org arcs
		// const orgArcGroup = chart.append('g')
		// 	.classed('arc-group', true);
		//
		// const arcData = catArcs.reduce(function (acc, cval) {
		// 	return acc.concat(cval.orgArcs);
		// }, []).map(function(d) {
		// 	d.padding = 0.001;
		// 	return d;
		// });
		//
		// orgArcGroup.selectAll('path')
		// 	.data(arcData)
		// 	.enter()
		// 	.append('path')
		// 	.attr('d', arc)
		// 	.style('fill', d => categoryColorScale(d.type.toUpperCase()))
		// 	.each(function(d) {
		// 		const content = `<div class="tooltip-title">${d.name}</div>`;
		// 		$(this).tooltipster({
		// 			content: content,
		// 			trigger: 'hover',
		// 			side: 'right',   // TODO: dynamic positioning of tooltip based on arc location
		// 		});
		// 	});
		//
		// // let's get labels on the categories
		// // first need group
		// const arcLabels = chart.append('g')
		// 	.classed('arc-labels', true);
		//
		// // now need paths for the text
		// const outerArcDefs = chart.append('defs')
		// 	.classed('outer-arc-defs', true);
		// outerArcDefs.selectAll('path')
		// 	.data(arcData)
		// 	.enter()
		// 	.append('path')
		// 	.attr('d', textArc)
		// 	.attr('id', (d, i) => `org-arc-label-path-${i}`);
		//
		// // now we can add text
		// arcLabels.selectAll('text')
		// 	.data(arcData)
		// 	.enter()
		// 	.append('text')
		// 	.append('textPath')
		// 	.attr('xlink:href', (d, i) => `#org-arc-label-path-${i}`)
		// 	.style('fill', textColor)
		// 	.style('font-size', '0.5em')
		// 	.style('text-anchor', 'start')
		// 	.text(d => convertOrgName(d.name));


		// add a center label
		chart.append('text')
			.style('font-size', '2em')
			.html(wordWrap(eventName, 15, -85, 0));

		/* STEP N - Helpful functions */
		function convertOrgName(s) {
			/* Converts Org name to just it's abbreviation (if provided) */
			const abbrev = s.match(/\(([A-Za-z0-9 ]+)\)/);
			// if there's not a match, just return normal name
			if (abbrev === null) {
				return s;
			} else {
				return abbrev[1];
			}
		}

		// http://bl.ocks.org/mbostock/5100636
		function arcTween(newAngle) {
			return function(d) {
				const interpolate = d3.interpolate(d.endAngle, newAngle);
				return function(t) {
					d.endAngle = interpolate(t);
					return arc(d);
				};
			};
		}
	};
})();
