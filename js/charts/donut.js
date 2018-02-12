(() => {
	App.initDonut = (selector, data) => {

		/*
		 * Sooo helpful https://bl.ocks.org/kerryrodden/477c1bfb081b783f80ad
		 *
		 */

		data = [
			['First case in humans identified','World Health Organization (WHO)','public health and medical'],
			['First case in animals identified','World Organisation for Animal Health (OIE)','public health and medical'],
			['State request for assistance','Joint United Nations Environment Programme (UNEP)/OCHA Environment Unit (JEU)','humanitarian aid'],
			['State request for assistance','Food and Agriculture Organization of the United Nations (FAO)','humanitarian aid'],
			['State request for assistance','World Organisation for Animal Health (OIE)','humanitarian aid'],
			['State request for assistance','World Health Organization (WHO)','public health and medical; humanitarian aid'],
			['WHO Public Health Emergency Declared','World Health Organization (WHO)','public health and medical; humanitarian aid; governance and policy'],
			['uspicion of Deliberate Use','United Nations Secretary-General\'s Mechanism (UNSGM)','governance and policy; safety and security'],
			['Suspicion of Deliberate Use','Organisation for the Prohibition of Chemical Weapons (OPCW)','governance and policy'],
			['Suspicion of Deliberate Use','International Criminal Police Organization (INTERPOL)','safety and security'],
			['Suspicion of Deliberate Use','United Nations Security Council - 1540 Committee','safety and security; governance and policy'],
			['Suspicion of Deliberate Use','United Nations Office for Disarmament Affairs (UNODA)','safety and security'],
			['Refugees Flee Country','International Maritime Organization (IMO)','safety and security; governance and policy'],
			['State request for Funds','World Bank Group (WBG)','humanitarian aid'],
			['Deployment of UN Personnel to affected country.','United Nations Department for Safety and Security (UNDSS)','safety and security; governance and policy'],
			['UN Security Council requests assistance','Biological Weapons Convention Implementation Support Unit (BWC ISU)','safety and security'],
			['Request from Member State','World Customs Organization (WCO)','safety and security; governance and policy'],
			['Affected State Command and Control Compromised','International Civil Aviation Organization (ICAO)','safety and security; governance and policy'],
			['State request for assistance','United Nations Disaster Assessment and Coordination (UNDAC)','humanitarian aid'],
			['State request for assistance','World Food Programme (WFP)','humanitarian aid'],
			['Refugees Flee Country','United Nations High Commissioner for Refugees (UNHCR)','humanitarian aid'],
			['State request for assistance','United Nations International Strategy for Disaster Reduction (UNISDR)','governance and policy; safety and security'],
		];

		orgInfo = [
			['United Nations Secretary-General\'s Mechanism (UNSGM)','UN Organization'],
			['United Nations Secretary General (UNSG)','UN Organization'],
			['United Nations Department of Public Information (UNDPI)','UN Organization'],
			['Food and Agriculture Organization of the United Nations (FAO)','UN Organization'],
			['Joint United Nations Environment Programme (UNEP)/OCHA Environment Unit (JEU)','UN Organization'],
			['Organisation for the Prohibition of Chemical Weapons (OPCW)','UN Organization'],
			['World Health Organization (WHO)','UN Organization'],
			['United Nations Institute for Disarmament Research (UNIDIR)','UN Organization'],
			['United Nations Office for Disarmament Affairs (UNODA)','UN Organization'],
			['International Criminal Police Organization (INTERPOL)','NGO'],
			['World Organisation for Animal Health (OIE)','NGO'],
			['United Nations Security Council (UNSC)','UN Organization'],
			['World Bank Group (WBG)','UN Organization'],
			['Internnational Maritime Organization (IMO)','UN Organization'],
			['United Nations Department for Safety and Security (UNDSS)','UN Organization'],
			['Biological Weapons Convention Implementation Support Unit (BWC ISU)','UN Organization'],
			['World Customs Organization (WCO)','UN Organization'],
			['International Civil Aviation Organization (ICAO)','UN Organization'],
			['United Nations Disaster Assessment and Coordination (UNDAC)','UN Organization'],
			['World Food Programme (WFP)','UN Organization'],
			['United Nations High Commissioner for Refugees (UNHCR)','UN Organization'],
			['United Nations International Strategy for Disaster Reduction (UNISDR)','UN Organization'],
		]

		const eventName = 'State request for assistance';
		const allRoles = [
		 'public health and medical',
		 'humanitarian aid',
		 'governance and policy',
		 'safety and security',
		];
		const allCategories = d3.nest()
			.key(d => d[1])
			.entries(orgInfo)
			.map(d => d.key);

		data = data.filter(d => d[0] === eventName);

		const width = 960,
			height = Math.floor(width / 2);

		/* In order to display this data, we need the associated "heights"
		 * for each bar. We have 3 heights to establish:
		 * 1. Category height (innermost) -> static
		 * 2. Org Category height -> determined by number of orgs
		 * 3. Org height -> How big is each org -> static
		 */

		const innerRadius    = 75;
		const outerRadius    = width;
		const categoryHeight = 50;
		const orgHeight      = 10;

		/* STEP ONE => MASSAGE THE DATA */

		//          meow
		//   /\_/\
		//  ( o.o )
		//   > ^ <
		//
		// (cause of all the cats here...)
		const catHeights = allRoles.map(function(d) {
			// pull out only the data that is associated with this category
			const catData = data.filter(x => x[2].indexOf(d) !== -1)
				// now join with orgInfo
				.map(function(x) {
					// making fundamental assumption here that every org in data is
					// listed in orgInfo
					const orgType = orgInfo.filter(y => y[0] === x[1])[0][1];
					return x.concat([orgType]);
				});
			// now group by the type of org
			const catCounts = d3.nest()
				.key(x => x[3])
				.entries(catData)
				.sort((a, b) => a.key < b.key);
			// pull out just the org types
			const orgTypes = catCounts.map(x => x.key);
			// Count how many entries in each
			const orgHeights = catCounts.map(function(x) {
				return {
					name: x.key,
					height: x.values.length
				};
			});
			const sortedCatData = catData.sort((a, b) => a[3] < b[3])
			return {
				name: d,
				data: catData,
				orgCounts: catCounts,
				orgTypes: orgTypes,
				orgHeights: orgHeights,
				sortedCatData: sortedCatData,
			};
		})
		.sort((a, b) => a.name > b.name);

		// Now append arc data to the catHeights
		var cdepth;
		const catArcs = catHeights.map(function(d, i) {
			const arcPortion = (1 / allRoles.length) * (2 * Math.PI);
			// first set the global category info
			const orgRadius = innerRadius + categoryHeight;
			cdepth = -orgHeight;
			const orgArcs = d.sortedCatData.map(function(x) {
				cdepth += orgHeight;
				return {
					name: x[1],
					type: x[3],
					innerRadius: orgRadius + cdepth,
					outerRadius: orgRadius + cdepth + orgHeight,
					startAngle: arcPortion * i,
					endAngle: arcPortion * (i + 1),
				}
			})
			return {
				name: d.name,
				data: d.data,
				// arc info
				innerRadius: innerRadius,
				outerRadius: orgRadius,
				startAngle: arcPortion * i,
				endAngle: arcPortion * (i + 1),
				// sub arcs
				orgCounts: d.orgCounts,
				orgTypes: d.orgTypes,
				orgHeights: d.orgHeights,
				orgArcs: orgArcs,
			}
		});

		console.log(catArcs);

		/* STEP TWO => DISPLAY THE DATA */
		const chart = d3.select(selector)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		const defs = chart.append('defs');

		// colours
		const innerColor = '#4d4e4e';
		const textColor = '#ffffff';
		const UNColor = '#a59a95';
		const NGOColor = '#005272';

		const arc = d3.arc()
			.innerRadius(d => d.innerRadius)
			.outerRadius(d => d.outerRadius)
			.startAngle(d => d.startAngle)
			.endAngle(d => d.endAngle)
			.padAngle(0.01);

		const textArc = d3.arc()
			.outerRadius(d => d.innerRadius + ((d.outerRadius - d.innerRadius) / 2))
			.startAngle(d => d.startAngle + 0.25)
			.endAngle(d => d.endAngle)
			.padAngle(0.05);

		const innerArcGroup = chart.append('g')
			.classed('arc-group', true);

		innerArcGroup.selectAll('path')
			.data(catArcs)
			.enter()
			.append('path')
			.attr('d', arc)
			.style('fill', innerColor);

		// append path for text
		defs.selectAll('path')
			.data(catArcs)
			.enter()
			.append('path')
			.attr('d', textArc)
			.attr('id', (d, i) => `inner-arc-label-path-${i}`);

		const innerArcLabels = chart.append('g')
			.classed('arc-group-labels', true);

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

		// now time for org arcs
		const orgArcGroup = chart.append('g')
			.classed('arc-group', true);

		arcData = catArcs.reduce(function(acc, cval) {
			return acc.concat(cval.orgArcs);
		}, []);

		orgArcGroup.selectAll('path')
			.data(arcData)
			.enter()
			.append('path')
			.attr('d', arc)
			.style('fill', function(d) {
				if (d.type === 'UN Organization') {
					return UNColor;
				} else {
					return NGOColor;
				}
			})



	}
})();
