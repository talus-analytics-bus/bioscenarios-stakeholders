(() => {
	App.initRoles = () => {

        let timeline;
        let donut;

        let timelineData = App.timelineData;
        let policyEventData = App.policyEventData;
        let roleData = App.roleData;
        let stakeholderData = App.stakeholderData;

        $('body').unbind(); // unbind any event listeners

        const bubbleScale = 3;
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
            initListeners();
        }

        function initGraphs() {

            timeline = App.initTimeline('.timeline', timelineData, policyEventData);

            let eventName = timelineData[0]['Timeline Event']; // default event name
            if (App.currentEventName.length > 0)
            {
                eventName = App.currentEventName; // there is a previously selected event name. Send it to the concept map
            }

            donut = App.initBubbleChart(
                '.donut-chart',
                eventName,
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

                    d3.select('.donut-chart').select('svg').remove();

                    donut = App.initBubbleChart(
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
                    donut = App.initBubbleChart(
                        '.donut-chart',
                        null,
                        policyEventData,
                        roleData,
                        stakeholderData,
                        timelineData,
						2.7,
                    );
                } else {
                    d3.select('.donut-chart').select('svg').remove();
                    donut = App.initBubbleChart(
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
