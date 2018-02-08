(() => {
	App.initDonut = (selector, data) => {
		var innerData = [
			{"name":"public health and medical", "val":1},
			{"name":"humanitarian aid", "val":1},
			{"name":"safety and security", "val":1}
		];
		var width = 960,
			height = 500,
			radius = Math.min(width, height)/2;

		var color = d3.scaleOrdinal()
			.range(["#424242", "#424242", "#424242"]);

		var arc = d3.arc()
			.outerRadius(radius - 90)
			.innerRadius(radius - 150);

		var pie = d3.pie()
			.sort(null)
			.value(function(d) {return d.val;})

		var donut = d3.select(selector).append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var g = donut.selectAll(".arc")
				.data(pie(innerData))
			.enter().append("g")
				.attr("class", "arc")

		g.append("path")
			.attr("d", arc)
			.style("fill", function(d) {return color(d.data.name);});

		g.append("text")
			.attr("transform", function(d) {return "translate("+arc.centroid(d)+")";})
			.attr("fill", "#dbdbdb")
			.attr("dy", 0.35)
			.text(function(d) {return d.data.name});
	}
})();
