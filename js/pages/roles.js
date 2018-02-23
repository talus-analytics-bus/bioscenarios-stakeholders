(() => {
	App.initRoles = () => {
        let conceptMap;
        let timeline;
        let donut;

        let timelineData;
        let policyEventData;
        let roleData;
        let stakeholderData;

        const bubbleScale = 1.8;
        if (!timelineData) {
            App.initialize(init); // initialize the application first!

        }
        else {
            init();
        }



        function init() {
            timelineData = App.timelineData;
            policyEventData = App.policyEventData;
            roleData = App.roleData;
            stakeholderData = App.stakeholderData;
            initGraphs();
            initListeners();
        }

        function initGraphs() {

            timeline = App.initTimeline('.timeline', timelineData, policyEventData);
            conceptMap = App.initConceptMap('.concept-map', timelineData[0]['Timeline Event'], policyEventData, stakeholderData);
            donut = App.initDonut(
                '.donut-chart',
                timelineData[0]['Timeline Event'],
                policyEventData,
                roleData,
                stakeholderData,
                timelineData,
                bubbleScale,
            );
        }

        function initListeners() {
            // https://stackoverflow.com/questions/15657686/jquery-event-detect-changes-to-the-html-text-of-a-div
            // TODO: deprecated?
            var previousEvent = null;
            $('body').on('DOMSubtreeModified', '.what-event-is-it', function() {
                const event = d3.select(this).text();
                if ((event !== null) && (event !== previousEvent)) {
                    d3.select('.concept-map').select('svg').remove();
                    d3.select('.donut-chart').select('svg').remove();
                    conceptMap = App.initConceptMap('.concept-map', event, policyEventData, stakeholderData);

                    donut = App.initDonut(
                        '.donut-chart',
                        event,
                        policyEventData,
                        roleData,
                        stakeholderData,
                        timelineData,
                        bubbleScale
                    );

                    previousEvent = event;

                    // reset checkbox
                    $('input[type=checkbox][value=alignbox]').prop('checked', false);
                }
            });

            $('input[type=checkbox][value=alignbox]').on('change', function() {
                const isChecked = $(this).prop('checked');
                if (isChecked) {
                    d3.select('.donut-chart').select('svg').remove();
                    donut = App.initDonut(
                        '.donut-chart',
                        null,
                        policyEventData,
                        roleData,
                        stakeholderData,
                        timelineData,
                        1.4,
                    );
                } else {
                    d3.select('.donut-chart').select('svg').remove();
                    donut = App.initDonut(
                        '.donut-chart',
                        previousEvent || timelineData[0]['Timeline Event'],
                        policyEventData,
                        roleData,
                        stakeholderData,
                        timelineData,
                        bubbleScale,
                    );
                }
            });
        }


    };
})();
