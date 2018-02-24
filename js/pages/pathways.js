(() => {
	App.initPathways = () => {
        let timeline;


        let timelineData = App.timelineData;
        let policyEventData = App.policyEventData;
        let roleData = App.roleData;
        let stakeholderData = App.stakeholderData;

        if (!timelineData) {
            App.initialize(loadData); // initialize the application first!

        }
        else {
            init();
        }

        function loadData() {
            // the data loading callback. This is the first time that someone hit the site. They should really start at home.
            timelineData = App.timelineData;
            policyEventData = App.policyEventData;
            roleData = App.roleData;
            stakeholderData = App.stakeholderData;
            init();
        }

        function init() {
            timelineData = App.timelineData;
            policyEventData = App.policyEventData;
            roleData = App.roleData;
            stakeholderData = App.stakeholderData;
            initGraphs();

        }

		function initGraphs() {
			timeline = App.initTimeline('.timeline', timelineData, policyEventData);

		}

	};
})();
