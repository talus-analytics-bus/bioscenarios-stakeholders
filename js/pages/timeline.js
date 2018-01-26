(() => {
	App.initTimeline = (selector) => {
		const events = ['Index case', 'Case in other species', 'Suggestion of a DBE', 'Request help from countries', 'Bug crosses border', 'EPI peak', 'Recovery', 'Economic recovery'];
		const margin = { top: 25, right: 30, bottom: 155, left: 130 };
		const width = 960;
		const height = 250;
		var event;

		// add chart to DOM
		const chart = d3.select(selector).append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`);

		// define scales
		const x = d3.scaleBand()
			.domain(events)
			.range([0, width]);
		const y = d3.scaleLinear()
			.range([height, 0]);

		// add axes to DOM
		const xAxis = d3.axisBottom()
			.scale(x);

		chart.append('g')
			.attr('transform', `translate(0, ${height})`);
			//.call(yAxis);

		var xaxis = chart.append("g")
		    .attr("class", "x axis")
		    .call(xAxis);

		xaxis.selectAll(".tick")['_groups'][0].forEach(function(d1) {
			var data = d3.select(d1).data();
			d3.select(d1).on("mouseover", function(d) { 
		    		event = data;
		            })                  
		        .on("mouseout", function(d) {   
		        	console.log("off"); 
		        });

		  })
		const yAxis = d3.axisLeft();
		const yAxisG = chart.append('g');



		function mouseover(d) {
		    for (var i = 0; i < d.related_nodes.length; i++)
		    {
		        d3.select('#' + d.related_nodes[i]).classed('highlight', true).style('fill', '#4286f4');
		        d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'bold');
		    }
		    
		    for (var i = 0; i < d.related_links.length; i++)
		        d3.select('#' + d.related_links[i]).style('stroke-width', '5px').style('stroke', '#4286f4');
		}

		function mouseout(d) {   	
		    for (var i = 0; i < d.related_nodes.length; i++)
		    {
		        d3.select('#' + d.related_nodes[i]).classed('highlight', false).style('fill', '#c6c6c6');
		        d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'normal');
		    }
		    
		    for (var i = 0; i < d.related_links.length; i++)
		        d3.select('#' + d.related_links[i]).style('stroke-width', "1px").style('stroke', 'black');
		}
		return event;
	};
})();
