(() => {
	App.initMain = () => {
		let conceptMap;
		let timeline;

		function init () {
			initGraphs();
		}

		function initGraphs() {
			graphs = App.initGraphs('.timeline', '.concept-map');
		}

		/*function initConcept() {
			conceptMap = App.initConcept('.concept-map');
		}*/

		/*d3.queue()
			.defer(d3.tsv, 'data/events.tsv')
			.await((error, rawEventData) => {
				eventData = rawEventData;
				init();
		});*/
		init();
	};
})();
