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
				const colors = ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda',
					'#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'];
				const colorScale = d3.scaleQuantile()
					.domain(countyData.values())
					.range(colors);

				// color counties
				d3.selectAll('.county').transition()
					.style('fill', (d) => {
						if (countyData.has(d.id)) {
							return colorScale(countyData.get(d.id));
						}
						return '#ccc';
					});

				// create map legend
				const barHeight = 16;
				const barWidth = 70;
				const legendPadding = 20;
				const quantiles = colorScale.quantiles();
				const legend = d3.select('.map-legend').append('svg')
					.attr('width', barWidth * colors.length + 2 * legendPadding)
					.attr('height', barHeight + 65)
					.append('g')
						.attr('transform', `translate(${legendPadding}, 0)`);
				const legendGroups = legend.selectAll('g')
					.data(colors)
					.enter().append('g')
						.attr('transform', (d, i) => `translate(${barWidth * i}, 0)`);
				legendGroups.append('rect')
					.attr('class', 'legend-bar')
					.attr('width', barWidth)
					.attr('height', barHeight)
					.style('fill', d => d);
				legendGroups.append('text')
					.attr('class', 'legend-text')
					.attr('x', barWidth)
					.attr('y', barHeight + 12)
					.attr('dy', '.35em')
					.text((d, i) => {
						if (i >= quantiles.length) return '';
						return d3.format('.1%')(quantiles[i] / 100)
					});

				legend.append('text')
					.attr('class', 'legend-title')
					.attr('x', barWidth * colors.length / 2)
					.attr('y', barHeight + 50)
					.text('Socioeconomic Vulnerability');
			});
	};
})();
