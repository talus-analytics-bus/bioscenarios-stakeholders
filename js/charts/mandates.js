(() => {
	App.initMandates = (selector, eventName, data, param={}) => {
		header = [
			['Tasking Stakeholder','Stakeholder Being Tasked','Associated Mandate or Regulation'],
			['The stakeholder who tasks another stakeholder at a specific point in time or based on an associated mandate or regulation',
			'The organization being tasked',
			'The mandate or regulation through which the tasking stakeholder has authority to task the stakeholder being tasked or through which the recipient stakeholder has the authority to act'],
		]
		data = [
			['Ministry of health','Health care workers','Local regulations'],
			['Ministry of health','Veterinary care providers','Local regulations'],
			['Ministry of health','Local NGOs','Local regulations'],
			['National government (affected)','Ministry of health','National regulations'],
			['National government (affected)','Food and Agriculture Organization of the United Nations (FAO)','FAO Constitution'],
			['National governments (unaffected)','United Nations Secretary General (UNSG)','General Assembly resolution (42/37C) and Security Council 620 (1988)'],
			['United Nations Secretary General (UNSG)','United Nations Secretary-General’s Mechanism (UNSGM)','General Assembly resolution (42/37C) and Security Council 620 (1988)'],
			['National government (affected)','World Organization for Animal Health (OIE)','OIE Organic statutes'],
			['National government (affected)','World Health Organization (WHO)','Articles 1-2 WHO Constitution; International Health Regulations (IHR); WHA Resolution 65.20'],
			['World Health Organization (WHO)','National government (affected)','Tasked through IHR NFP to provide additional information'],
			['International Federation of Red Cross and Red Crescent Societies (IFRC)','','Geneva Conventions of 1949; Statutes and those of the International Red Cross and Red Crescent Movement; the resolutions of the International Conferences of the Red Cross and Red Crescent'],
			['International Committee of the Red Cross (ICRC)','','Geneva Conventions of 1949; Statutes and those of the International Red Cross and Red Crescent Movement; the resolutions of the International Conferences of the Red Cross and Red Crescent'],
			['Médecins Sans Frontières (MSF)','',''],
			['International NGOs','',''],
			['National government (affected)','National governments (non-affected)',''],
			['National governments (unaffected)','International Organization For Migration (IOM)',''],
			['National government (affected)','United Nations Office for the Coordination of Humanitarian Affairs (OCHA)','UN GA resolution 46/182'],
			['United Nations Office for the Coordination of Humanitarian Affairs (OCHA)','United Nations Disaster Assessment and Coordination (UNDAC)','United Nations General Assembly resolution 57/150'],
			['National government (affected)','World Food Programme (WFP)','UN GA Res/1714(XVI)'],
			['United Nations High Commissioner for Refugees (UNHCR)','National governments (non-affected)','UN GA Res/428(V); UN GA Res/58/153'],
			['United Nations International Children\'s Emergency Fund (UNICEF)','',''],
			['Gavi',' the Vaccine Alliance"','','Organization\'s mission'],
			['Coalition for Epidemic Preparedness Innovations (CEPI)','','Organization\'s mission'],
			['Sabin Vaccine Institute','','Organization\'s mission'],
			['Pharmaceutical and biotechnology companies','','Company goals'],
			['Pharmaceutical and biotechnology companies','World Intellectual Property Organization (WIPO)','UN GA Res/3346(XXIX)'],
			['World Trade Organization (WTO)','',''],
			['United Nations Department for Safety and Security (UNDSS)','','UN GA Res/59/276'],
		];

		const nodeDict = {};
		data.map(function(d) {
			if (nodeDict[d[0]] === undefined) {
				nodeDict[d[0]] = {
					edges: [{
						node: d[1],
						edge: d[2]
					}],
					level: 0,
				}
			} else {
				nodeDict[d[0]].edges.push({
					node: d[1],
					edge: d[2]
				})
			}
		});
		Object.keys(nodeDict)
			.forEach(function(m) {
				Object.keys(nodeDict)
					.forEach(function(n) {
						if (nodeDict[n].edges.map(d => d.node).includes(m)) {
							nodeDict[m].level = nodeDict[n].level + 1;
						}
					});
			});
		const nodeList = [];
		Object.keys(nodeDict).forEach(function(d) {
			const node = nodeDict[d];
			node.name = d;
			nodeList.push(node);
		})

		const margin = { top: 25, right: 25, bottom: 25, left: 25 };
		const width = param.width || 800;
		const height = width;

		const nodeColor      = '#a6cde0';
		const nodeLabelColor = '#333333';
		const edgeColor      = '#e6e6e5';
		const edgeLabelColor = '#808080';

		const chart = d3.select(selector)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const allNodes = Object.keys(nodeDict);

		const nodeGroup = chart.append('g')
			.attr('class', 'nodes');

		nodeGroup.selectAll('circle')
			.data(allNodes)
			.enter()
			.append('circle')
			.attr('cx', 50)
			.attr('cy', (d, i) => 50 * i)
			.attr('r', 50)
			.style('fill', nodeColor);

	}
})();
