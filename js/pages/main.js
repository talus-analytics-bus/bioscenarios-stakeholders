(() => {
	App.initMain = () => {
		let eventData;
		let timelineData;

		d3.queue()
			.defer(d3.tsv, 'data/events.tsv')
			.defer(d3.json, 'data/timeline.json')
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
			timeline   = App.initTimeline('.timeline', timelineData.events);
			conceptMap = App.initConceptMap('.concept-map', eventData);
			donut      = App.initDonut('.donut-chart', eventData);
		}

		init();
	};
})();
