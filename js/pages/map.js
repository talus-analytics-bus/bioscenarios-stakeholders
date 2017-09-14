(() => {
	App.initMap = () => {
		/* ---------------- Leaflet Map -------------- */
		// create a leaflet map; note that the element's id is passed
		Map.createLeafletMap('leaflet-map');


		/* ---------------- d3 Map -------------- */
		// load topographic data, and county data
		d3.queue()
			.defer(d3.json, 'data/us.json')
			.defer(d3.tsv, 'data/location_data.tsv')
			.await((error, us, data) => {
				if (error) {
					noty({ type: 'error', text: 'Error loading map data!' });
					return;
				}

				// create a d3 map; note that a selector is passed
				Map.createD3Map('#d3-map', us);

				// create lookup for county data
				const countyData = d3.map();
				data.forEach((d) => {
					if (d.type === 'county') {
						countyData.set(d.fips, +d.vulnerability);
					}
				});

				// set color scale
				const blues = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1',
					'#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'];
				const colorScale = d3.scaleQuantile()
					.domain(countyData.values())
					.range(blues);

				// color counties
				d3.selectAll('.county').transition()
					.style('fill', (d) => {
						if (countyData.has(d.id)) {
							return colorScale(countyData.get(d.id));
						}
						return '#ccc';
					});
			});
	};
})();
