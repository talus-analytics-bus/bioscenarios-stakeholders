(() => {
	App.initRoles = () => {

        let timeline;
        let donut;

        let timelineData = App.timelineData;
        let policyEventData = App.policyEventData;
        let roleData = App.roleData;
        let stakeholderData = App.stakeholderData;

        $('body').unbind(); // unbind any event listeners

        // const bubbleScale = 2.45;
		const bubbleScale = 2.75;
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

			$('.nav li').removeClass('active');
			$('[value="roles"]').addClass('active');
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

			// set checkbox
			$('input[type=radio][name=starburstradio][value=timeline]').prop('checked', true);
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
					$('input[type=radio][name=starburstradio][value=timeline]').prop('checked', true);
                }
            });

            $('input[type=radio][name=starburstradio]').on('change', function() {
                const isChecked = $(this).val() === 'all';
                if (isChecked) {
                    d3.select('.donut-chart').select('svg').remove();
                    donut = App.initBubbleChart(
                        '.donut-chart',
                        null,
                        policyEventData,
                        roleData,
                        stakeholderData,
                        timelineData,
						// 2.45,
						2.75,
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
