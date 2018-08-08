const App = {};

(() => {

	App.initialize = (callback) => {
		$('.logout-link').click(Auth.logout);

        d3.queue()
            .defer(d3.tsv, 'data/policydocs.tsv')
            .defer(d3.tsv, 'data/policyevents.tsv')
            .defer(d3.tsv, 'data/roles.tsv')
            .defer(d3.tsv, 'data/stakeholders.tsv')
            .defer(d3.tsv, 'data/timeline.tsv')
            .await((error, rawPolicyData, rawPolicyEventData, rawRoleData, rawStakeholderData,
                    rawTimelineData) => {
                App.policyEventData = rawPolicyEventData;
                App.stakeholderData = rawStakeholderData;
                App.timelineData = rawTimelineData;
                App.policyData = rawPolicyData;
                App.roleData = rawRoleData;

                // console.log(App.roleData.filter(d => d['Stakeholder'].startsWith('National')));
                if (callback) {
                	callback();
				}
            });

        App.currentEventIndex = 0;
        App.currentEventName ="";

        
	};




	/* ------------------ Vendor Defaults ------------------- */
	// tooltipster defaults
	$.tooltipster.setDefaults({
		contentAsHTML: true,
		trigger: 'hover',
		offset: [5, -25],
		theme: 'tooltipster-shadow',
		maxWidth: 320,
	});

	// noty defaults
	$.noty.defaults.type = 'warning';
	$.noty.defaults.layout = 'center';
	$.noty.defaults.timeout = 2000;
})();
