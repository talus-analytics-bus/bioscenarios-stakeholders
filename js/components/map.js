const Map = {};

(() => {
	Map.createMap = (elementId, param = {}) => {
		const map = L.map(elementId)
			.setView(param.bounds || [37.5, -122.3], 4)
			.setZoom(param.zoom || 11);
		const mapboxTileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/jpecht/citxe4nqe005l2ilff0lknw0u/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianBlY2h0IiwiYSI6ImNpdHhlMTc5NzAwczEydHFtbnZnankzNmEifQ.79pr8-kMwzRaEzUhvvgzsw', {
			attribution: 'Map data &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 14,
		});
		mapboxTileLayer.addTo(map);
		return map;		
	};
})();
