(() => {
	App.initMain = () => {
		let policyData;
		let policyEventData;
		let roleData;
		let stakeholderData;
		let timelineData;

		d3.queue()
			.defer(d3.tsv, 'data/policydocs.tsv')
			.defer(d3.tsv, 'data/policyevents.tsv')
			.defer(d3.tsv, 'data/roles.tsv')
			.defer(d3.tsv, 'data/stakeholders.tsv')
			.defer(d3.tsv, 'data/timeline.tsv')
			.await((error, rawPolicyData, rawPolicyEventData, rawRoleData, rawStakeholderData, rawTimelineData) => {
				policyEventData = rawPolicyEventData;
				stakeholderData = rawStakeholderData;
				timelineData = rawTimelineData;
				policyData = rawPolicyData;
				roleData = rawRoleData;
				init();
			});

		let conceptMap;
		let timeline;
		let donut;

		function init() {
			initGraphs();
		}

		function initGraphs() {
			timeline = App.initTimeline('.timeline', timelineData);
			conceptMap = App.initConceptMap('.concept-map', timelineData[4]['Timeline Event'], policyEventData, stakeholderData);
			donut = App.initDonut('.donut-chart', timelineData[4]['Timeline Event'], roleData, stakeholderData);
		}


	};
})();
