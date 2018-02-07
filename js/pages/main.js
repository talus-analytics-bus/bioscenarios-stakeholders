(() => {
	App.initMain = () => {
		let eventData;
		let timelineData;

		d3.queue()
			.defer(d3.tsv, 'data/events.tsv')
			.defer(d3.tsv, 'data/timeline.tsv')
			.await((error, rawEventData, rawTimelineData) => {
				eventData = rawEventData;
				timelineData = rawTimelineData;
				init();
			});

		let conceptMap;
		let timeline;
		let donut;

		function init () {
			initGraphs();
		}

		function initGraphs() {
			timeline   = App.initTimeline('.timeline', timelineData);
			conceptMap = App.initConceptMap('.concept-map', timelineData[0].eventName, eventData);
			donut      = App.initDonut('.donut-chart', eventData);
		}


	};
})();
