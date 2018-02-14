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
		const orgHeight = 20;    // how "tall" is each org listed

		// colours
		const innerColor = '#4d4e4e';
		const textColor = '#ffffff';
		const UNColor = '#a59a95';
		const NGOColor = '#005272';
		const selectedColor = '#ccc9c8';

		// parseRawData declarations - gonna bind to these
		let allRoles;
		let allCategories;
		let data;
		let orgInfo;
		let catArcs;

		/* STEP ONE => MASSAGE THE DATA */
		function parseRawData() {
			data = rawData.filter(d => d['Timeline Event'] === eventName);
			orgInfo = rawOrgInfo;
			allRoles = [
				'public health and medical',
				'humanitarian aid',
				'governance and policy',
				'safety and security',
			];
			allCategories = d3.nest()
				.key(d => d['Organization Category'].toUpperCase())
				.entries(orgInfo)
				.map(d => d.key)
				.sort();

			//		  meow
			//   /\_/\
			//  ( o.o )
			//   > ^ <
			//
			// (cause of all the cats here...)
			let cdepth;
			catArcs = allRoles.map(d => {
				// pull out only the data that is associated with this category
				// and join with org info for each row
				const catData = data.filter(x => x['Stakeholder Role'].indexOf(d) !== -1)
				// now join with orgInfo
					.map((x) => {
						// making fundamental assumption here that every org in data is
						// listed in orgInfo
						const orgType = orgInfo.filter(
							y => y['Stakeholder Name'] === x['Stakeholder'])[0]['Organization Category'];
						x['Organization Category'] = orgType;
						return x;
					});
				// now group by the type of org
				const catCounts = d3.nest()
					.key(x => x['Organization Category'].toUpperCase())
					.entries(catData)
					.sort((a, b) => a.key < b.key);
				// pull out just the org types
				const orgTypes = catCounts.map(x => x.key);
				// Count how many entries in each
				const orgHeights = catCounts.map(function (x) {
					return {
						name: x.key,
						height: x.values.length,
					};
				});
				// sort catData by category
				const sortedCatData = catData.sort((a, b) => a['Organization Category'] < b['Organization Category']);
				return {
					name: d,
					data: catData,
					orgCounts: catCounts,
					orgTypes: orgTypes,
					orgHeights: orgHeights,
					sortedCatData: sortedCatData,
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
				const padding = 0.01;
				// we have a couple different sub-arcs
				// role arcs
				const rootData = {
					name: d.name,
					innerRadius: innerRadius,
					outerRadius: innerRadius + roleHeight,
					startAngle: startAngle,
					endAngle: endAngle,
					padding: padding,
				};
				cdepth = -1;
				const orgData = d.sortedCatData.map(x => {
					cdepth += 1;
					return {
						name: x['Stakeholder'],
						type: x['Organization Category'].toUpperCase(),
						innerRadius: innerRadius + roleHeight + (cdepth * orgHeight),
						outerRadius: innerRadius + roleHeight + ((cdepth + 1) * orgHeight),
						startAngle: startAngle,
						endAngle: endAngle,
						padding: padding,
					};
				});
				return {
					startAngle: startAngle,
					endAngle: endAngle,
					padding: padding,
					rootArc: rootData,
					orgArcs: orgData,
				};
			});
		}
		parseRawData();

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
			.padAngle(0.01);

		// Arc function responsible for drawing textPath arcs
		const textArc = d3.arc()
			.outerRadius(d => d.innerRadius + ((d.outerRadius - d.innerRadius) / 2))
			.startAngle(d => d.startAngle + (d.offset || 0.25))
			.endAngle(d => d.endAngle);

		// console.log(catArcs);
		// Start by drawing 4 (number of categories) groups, these groups will act in tandem for start and end angles
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
		const innerArcDefs = chart.append('defs')
			.classed('inner-arc-defs', true);

		innerArcDefs.selectAll('path')
			.data(catArcs)
			.enter()
			.append('path')
			.attr('d', textArc)
			.attr('id', (d, i) => `inner-arc-label-path-${i}`);

		const innerArcLabels = chart.append('g')
			.classed('inner-arc-group-labels', true);

		// append text itself
		innerArcLabels.selectAll('text')
			.data(catArcs)
			.enter()
			.append('text')
			.append('textPath')
			.attr('xlink:href', (d, i) => `#inner-arc-label-path-${i}`)
			.style('fill', textColor)
			.style('font-size', '0.6em')
			.text(d => d.name);

		/* OUTER */
		// now time for org arcs
		const orgArcGroup = chart.append('g')
			.classed('arc-group', true);

		const arcData = catArcs.reduce(function (acc, cval) {
			return acc.concat(cval.orgArcs);
		}, []).map(function(d) {
			d.padding = 0.001;
			return d;
		});

		orgArcGroup.selectAll('path')
			.data(arcData)
			.enter()
			.append('path')
			.attr('d', arc)
			.style('fill', (d) => {
				if (d.type.toUpperCase() === 'UN ORGANIZATION') {
					return UNColor;
				} else {
					return NGOColor;
				}
			})
			.each(function(d) {
				const content = `<div class="tooltip-title">${d.name}</div>`;
				$(this).tooltipster({
					content: content,
					trigger: 'hover',
					side: 'right',   // TODO: dynamic positioning of tooltip based on arc location
				});
			});

		// let's get labels on the categories
		// first need group
		const arcLabels = chart.append('g')
			.classed('arc-labels', true);

		// now need paths for the text
		const outerArcDefs = chart.append('defs')
			.classed('outer-arc-defs', true);
		outerArcDefs.selectAll('path')
			.data(arcData)
			.enter()
			.append('path')
			.attr('d', textArc)
			.attr('id', (d, i) => `org-arc-label-path-${i}`);

		// now we can add text
		arcLabels.selectAll('text')
			.data(arcData)
			.enter()
			.append('text')
			.append('textPath')
			.attr('xlink:href', (d, i) => `#org-arc-label-path-${i}`)
			.style('fill', textColor)
			.style('font-size', '0.5em')
			.style('text-anchor', 'start')
			.text(d => convertOrgName(d.name));

		// now add cover for this
		const bigArcData = d3.nest()
			.key(d => d.startAngle)
			.key(d => d.type)
			.rollup(d => {
				return {
					innerRadius: d[0].innerRadius,
					outerRadius: d3.max(d, x => x.outerRadius),
					startAngle: d[0].startAngle,
					endAngle: d[0].endAngle,
					type: d[0].type,
				};
			})
			.entries(arcData)
			.map(d => {
				return d.values.map(x => {
					x.startAngle = d.key;
					Object.keys(x.value).forEach(y => x[y] = x.value[y]);
					return x;
				});
			})
			.reduce((acc, cval) => acc.concat(cval), []);

		// draw cover Arcs
		const coverArcGroup = chart.append('g')
			.classed('cover-arc-group', true);

		// labels arcs
		const coverDefs = chart.append('defs')
			.classed('cover-defs', true);
		coverDefs.selectAll('path')
			.data(bigArcData.map(d => {
				d.offset = 0.01;
				// d.outerRadius -= orgHeight / 2;
				return d;
			}))
			.enter()
			.append('path')
			.attr('d', textArc)
			.attr('id', (d, i) => `cover-arc-labels-${i}`);

		// https://github.com/d3/d3/issues/2644
		// tl;dr arrow notation override this *for some reason*
		// so upset
		// i hate bugs
		const coverArcs = coverArcGroup.selectAll('g')
			.data(bigArcData)
			.enter()
			.append('g')
			.on('mouseover', function() {
				d3.select(this)
					.selectAll('text')
					.attr('fill-opacity', 0);
				d3.select(this)
					.selectAll('path')
					.attr('fill-opacity', 0);
			})
			.on('mouseout', function() {
				d3.select(this)
					.selectAll('text')
					.attr('fill-opacity', 1);
				d3.select(this)
					.selectAll('path')
					.attr('fill-opacity', 1);
			});

		coverArcs.append('path')
			.attr('d', arc)
			.style('fill', d => (d.type.toUpperCase() === 'UN ORGANIZATION') ? UNColor : NGOColor);

		coverArcs.append('text')
			.append('textPath')
			.attr('xlink:href', (d, i) => `#cover-arc-labels-${i}`)
			.style('fill', textColor)
			.style('font-size', '1.25em')
			.style('text-anchor', 'start')
			.classed('cover-arc-labels', true)
			.text(d => `${d.key}`);

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
