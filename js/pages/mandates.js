(() => {
	App.initMandatesPage = () => {

        let conceptMap;
        let timeline;
        let donut;

        let timelineData = App.timelineData;
        let policyEventData = App.policyEventData;
        let roleData = App.roleData;
        let stakeholderData = App.stakeholderData;

        const bubbleScale = 1.8;
        if (!timelineData) {
            App.initialize(loadData); // initialize the application first!

        }
        else {
            init();
        }

        function loadData() {
            timelineData = App.timelineData;
            policyEventData = App.policyEventData;
            roleData = App.roleData;
            stakeholderData = App.stakeholderData;
            init();
        }

        function init() {

            initGraphs();
            initListeners();
        }

        function initGraphs() {

            timeline = App.initTimeline('.timeline', timelineData, policyEventData);
            conceptMap = App.initConceptMap('.concept-map', timelineData[0]['Timeline Event'], policyEventData, stakeholderData);

        }

        function initListeners() {
            // https://stackoverflow.com/questions/15657686/jquery-event-detect-changes-to-the-html-text-of-a-div
            // TODO: deprecated?
            var previousEvent = null;
            $('body').on('DOMSubtreeModified', '.what-event-is-it', function() {
                const event = d3.select(this).text();
                if ((event !== null) && (event !== previousEvent)) {
                    d3.select('.concept-map').select('svg').remove();
                    conceptMap = App.initConceptMap('.concept-map', event, policyEventData, stakeholderData);


                    previousEvent = event;

                    // reset checkbox

                }
            });


        }


    };
})();
