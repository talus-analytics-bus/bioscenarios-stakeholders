(() => {
	App.initSearchBar = (selector, data, searchedFn) => {
		// timeout for country search
		let liveSearchTimeout;
		const numResultsToDisplay = 3;
		let results = [];
		let activeResultNum = -1;
		const $resultsBox = $('.live-search-results-container');

		// set search bar behavior
		$(selector)
			.on('focus', function focus() {
				searchForCountry($(this).val(), searchedFn);
			})
			.on('blur', hideSearch)
			.on('keyup', function keyUp(ev) {
				clearTimeout(liveSearchTimeout);
				const searchVal = $(this).val();
				if (ev.which === 13) {
					// enter: perform search immediately
					if (activeResultNum >= 0) {
						$(selector).val('');
						hideSearch();
						searchedFn(results[activeResultNum]);
					} else {
						searchForCountry(searchVal, searchedFn);
					}
				} else if (ev.which === 27) {
					// escape key: blur
					hideSearch();
				} else if (ev.which === 40) {
					// down arrow: scroll for search results
					if (activeResultNum < numResultsToDisplay - 1) {
						activeResultNum++;
						highlightResultBox();
					}
				} else if (ev.which === 38) {
					// up arrow: scroll for search results
					if (activeResultNum > -1) {
						activeResultNum--;
						highlightResultBox();
					}
				} else {
					// perform search when user stops typing for 250ms
					liveSearchTimeout = setTimeout(() => {
						searchForCountry(searchVal, searchedFn);
					}, 250);
				}
			});

		// initialize search engine
		const fuse = new Fuse(data, {
			threshold: 0.3,
			distance: 1e5,
			keys: ['ISO2', 'ISO3', 'FIPS', 'NAME'],
		});


		// function for displaying country search results
		function searchForCountry(searchVal, searchedFn) {
			// hide if nothing in search bar
			if (searchVal.trim() === '') {
				$resultsBox.hide();
				return;
			}

			// reset highlighted search box
			activeResultNum = -1;
			highlightResultBox();

			// search for results
			results = fuse.search(searchVal);

			// show results in boxes under search input
			$resultsBox.show();
			if (results.length === 0) {
				$resultsBox.find('.live-search-no-results-text').show();
				$resultsBox.find('.live-search-results-contents').hide();
			} else {
				$resultsBox.find('.live-search-no-results-text').hide();
				$resultsBox.find('.live-search-results-contents').show();

				let boxes = d3.select($resultsBox[0])
					.select('.live-search-results-contents')
					.selectAll('.live-search-results-box')
						.data(results.slice(0, numResultsToDisplay));
				boxes.exit().remove();

				const newBoxes = boxes.enter().append('div')
					.attr('class', 'live-search-results-box');
				newBoxes.append('div')
					.attr('class', 'live-search-results-title');
				newBoxes.append('div')
					.attr('class', 'live-search-results-subtitle');

				boxes = boxes.merge(newBoxes).on('mousedown', (d) => {
					// clear input
					$(selector).val('');

					// call searched function
					searchedFn(d);
				});
				boxes.select('.live-search-results-title')
					.text(d => `${d.NAME} (${d.ISO3})`);
				boxes.select('.live-search-results-subtitle')
					.text(d => `Population: ${Util.comma(d.POP2005)}`);
			}
		}

		// colors the search result selected
		function highlightResultBox() {
			$resultsBox.find('.live-search-results-box').removeClass('active');
			if (activeResultNum > -1) {
				const childNum = activeResultNum + 1;
				$resultsBox
					.find(`.live-search-results-box:nth-child(${childNum})`)
					.addClass('active');
			}
		};

		function hideSearch() {
			clearTimeout(liveSearchTimeout);
			$resultsBox.hide();
		}
	}
})();
