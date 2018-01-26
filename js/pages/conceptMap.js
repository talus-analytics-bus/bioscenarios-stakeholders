(() => {
	App.initGraphs = (selector1, selector2) => {
		// TIMELINE	

		const events = ['Index case', 'Case in other species', 'Suggestion of a DBE', 'Request help from countries', 'Bug crosses border', 'EPI peak', 'Recovery', 'Economic recovery'];
		const margin = { top: 25, right: 25, bottom: 25, left: 25 };
		const width = 1060;
		const height = 100;
		var event;

			// add chart to DOM
			const chart = d3.select(selector1).append('svg')
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
			        });

			  })
			const yAxis = d3.axisLeft();
			const yAxisG = chart.append('g');


		buildConceptMap("Index case");
		//chart.on("click", resetMap(event));

		/*function resetMap(event) {
			d3.select("svg").remove()
			buildConceptMap(event);
		}*/

		//CONCEPT MAP
		function buildConceptMap(event) {
			var fulldata = {'Index case' : [["UN", ["UN Organizations", "UNSG", "UNSGM", "OCHA", "JEU", "UNDPI", "UNIDIR", "UNODA", "BWC ISU", "1540 COMMITTEE", "WCO", "UNDAC", "FAO", "WFP", "UNHCR", "WIPO", "UNISDR", "UNICRI", "UNDSS", "WHO"]], ["Non-governmental Organizations", ["Non-governmental Organizations", "INTERPOL", "OIE", "ICRC", "IFRC", "MSF", "LOCAL NGOs", "Gavi", "CEPI", "Sabin", "IOM", "Open Philanthropy", "Welcome Trust", "Bill & Melinda Gates", "Skoll Global Threats Fund Rockefeller", "Vulcan"]], ["Private Sector", ["Private Sector", "Pharmaceuticals", "Biotech", "Telecom Companies", "GHSA PSR", "WEF"]], ["National Governments", ["National Governments", "Affected Countries", "Partener Countries"]], 
			["Event notificataion", ["WHO", "OIE"]], ["Early warning", ["WHO", "OIE", "FAO"]], ["Initial sample collection", ["WHO", "OIE", "FAO"]], ["Advice on containment measures", ["WHO", "OIE"]], ["Event verification", ["WHO", "OIE", "INTERPOL", "FAO"]]]};
			var data = fulldata[event];
			var titles = ["UN Organizations", "Non-governmental Organizations", "Private Sector", "National Governments"];

			var total = 45;

			var outer = d3.map();
			var inner = [];
			var links = [];

			var outerId = [0];

			data.forEach(function(d){
				if (d == null)
					return; 
				
				i = { id: 'i' + inner.length, name: d[0], related_links: [] };
				i.related_nodes = [i.id];
				inner.push(i);
				
				if (!Array.isArray(d[1]))
					d[1] = [d[1]];
				
				d[1].forEach(function(d1){
					
					o = outer.get(d1);
					
					if (o == null)
					{
						o = { name: d1,	id: 'o' + outerId[0], related_links: [] };
						o.related_nodes = [o.id];
						outerId[0] = outerId[0] + 1;	
						
						outer.set(d1, o);
					}
					
					// create the links
					l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o }
					links.push(l);
					
					// and the relationships
					i.related_nodes.push(o.id);
					i.related_links.push(l.id);
					o.related_nodes.push(i.id);
					o.related_links.push(l.id);
				});
			});

			inner.splice(0, 4);
			links.splice(0, total);

			data = {
				inner: inner,
				outer: outer.values(),
				links: links
			}
			// sort the data -- TODO: have multiple sort options
			outer = data.outer;
			data.outer = Array(outer.length);

			var i1 = 0;
			var i2 = outer.length - 1;

			for (var i = 0; i < data.outer.length; ++i)
			{
				if (i <= 19) {
					data.outer[i2--] = outer[i];
				} else {
					data.outer[i1++] = outer[i];
				}
				/*if (i % 2 == 1)
					data.outer[i2--] = outer[i];
				else
					data.outer[i1++] = outer[i];*/
			}

			var diameter = 1060;
			var rect_width = 250;
			var rect_height = 100; 

			var il = data.inner.length;
			var ol = data.outer.length;

			var inner_y = d3.scaleLinear()
			    .domain([0, il])
			    .range([-(il * rect_height)/2, (il * rect_height)/2]);

			mid = (data.outer.length/2.0)
			var outer_x = d3.scaleLinear()
			    .domain([0, mid, mid, data.outer.length])
			    .range([50, 135, 225 ,320]);

			var outer_x_UN = d3.scaleLinear()
			    .domain([0, 20])
			    .range([50, 135]);

			var outer_x_non = d3.scaleLinear()
			    .domain([20, data.outer.length])
			    .range([225 ,320]);

			var outer_y = d3.scaleLinear()
			    .domain([0, data.outer.length])
			    .range([0, diameter / 2 - 120]);


			//console.log(data.outer);
			// setup positioning
			data.outer = data.outer.map(function(d, i) { 
				if (i<= total-21) {
					d.x = outer_x_UN(i);
				}else {
					d.x = outer_x_non(i);
				};
			    //d.x = outer_x(i);
			    d.y = diameter/3;
			    return d;
			});

			data.inner = data.inner.map(function(d, i) { 
			    d.x = -(rect_width / 2);
			    d.y = inner_y(i);
			    return d;
			});

			function projectX(x) {
			    return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
			}

			function diagonal(d) {
				return "M" + String(-d.outer.y * Math.sin(projectX(d.outer.x))) + "," + String(d.outer.y * Math.cos(projectX(d.outer.x))) 
				+ " " + "C"
				+ " " + String((-d.outer.y * Math.sin(projectX(d.outer.x))+(d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width))/2)+","+String(d.outer.y * Math.cos(projectX(d.outer.x))) 
				+ " " + String((-d.outer.y * Math.sin(projectX(d.outer.x))+(d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width))/2)+","+String(d.inner.y + rect_height/2)
				+ " " + String(d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width) + "," + String(d.inner.y + rect_height/2);
			}

			var svg = d3.select(selector2).append("svg")
			    .attr("width", diameter+150)
			    .attr("height", diameter)
			  .append("g")
			    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

			svg.append("text")
		        .attr("x", 0)  
		        //Adjust placement of title based on number of sub-events for event?           
		        .attr("y", -diameter/2+250)
		        .attr("text-anchor", "middle")
		        .style("font-size", "25px") 
		        .style("font-weight", "600") 
		        .style('fill', '#076eb5')
		        .text(event.toUpperCase());
					    

			// links
			var link = svg.append('g').attr('class', 'links').selectAll(".link")
			        .data(data.links)
			    .enter().append('path')
			        .attr('class', 'link')
			        .attr("d", diagonal)
			        .attr('id', function(d) { return d.id })
			        .attr('fill', "none")
			        .style('stroke-width', '1px')
			        .style('stroke', '#ffffff');
			        

			function placement(d) {
				return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
			}

			// outer nodes

			var onode = svg.append('g').selectAll(".outer_node")
			    .data(data.outer)
			  .enter().append("g")
			    .attr("class", "outer_node")
			    .attr("transform", placement)
			    .on("mouseover", mouseover)
			    .on("mouseout", mouseout);

			function circle_color(d) {
				if (titles.includes(d.name)) {
					return "white"
				} else {
					return '#e8e8e8'
				}
			};
			  
			onode.append("circle")
			    .attr('id', function(d) { return d.id })
			    .style('fill', circle_color)
			    .attr("r", 5.2);

			function outer_color(d) {
				if (titles.includes(d.name)) {
					return "black"
				} else {
					return '#c1c1c1'
				}
			};
			function outer_dec(d) {
				if (titles.includes(d.name)) {
					return "underline"
				} else {
					return "none"
				}
			};
			function outer_style(d) {
				if (titles.includes(d.name)) {
					return "italic"
				} else {
					return "none"
				}
			};
			  
			onode.append("text")
				.attr('id', function(d) { return d.id + '-txt'; })
			    .attr("dy", ".31em")
			    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
			    .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
			    .attr('fill', outer_color)
			    .attr('font-size', 16)
			    .attr("text-decoration", outer_dec)
			    .attr("font-style", outer_style)
			    .text(function(d) { return d.name; });
			  
			// inner nodes
			  
			var inode = svg.append('g').selectAll(".inner_node")
			    .data(data.inner)
			  .enter().append("g")
			    .attr("class", "inner_node")
			    .attr("transform", function(d, i) { return "translate(" + d.x + "," + d.y + ")"})
			    .on("mouseover", mouseover)
			    .on("mouseout", mouseout);
			  
			inode.append('rect')
			    .attr('width', rect_width)
			    .attr('height', rect_height)
			    .attr('id', function(d) { return d.id; })
			    .attr('fill', '#e8e8e8');

			inode.append('rect')
			    .attr('width', rect_width)
			    .attr('height', 20)
			    .style('fill', '#ffffff');
			  
			inode.append("text")
				.attr('id', function(d) { return d.id + '-txt'; })
			    .attr('text-anchor', 'middle')
			    .attr("transform", "translate(" + rect_width/2 + ", " + rect_height * .75 + ")")
			    .attr('fill', '#4f4f4f')
			    .attr('font-size', 16)
			    //.attr('font-weight', 'bold')
			    .attr("dy", -0.8)
			    .text(function(d) { return d.name })
			    	.call(wrap, 180);;

			function wrap(text, width) {
			  text.each(function() {
			    var text = d3.select(this),
			        words = text.text().split(/\s+/).reverse(),
			        word,
			        line = [],
			        lineNumber = 0,
			        lineHeight = 1.7, // ems
			        y = text.attr("y"),
			        dy = parseFloat(text.attr("dy")),
			        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			    while (word = words.pop()) {
			      line.push(word);
			      tspan.text(line.join(" "));
			      if (tspan.node().getComputedTextLength() > width) {
			        line.pop();
			        tspan.text(line.join(" "));
			        line = [word];
			        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			      }
			    }
			  });
			}

			// need to specify x/y/etc

			d3.select(self.frameElement).style("height", diameter - 150 + "px");

			function mouseover(d)
			{
				// bring to front
				d3.selectAll('.links .link').sort(function(a, b){ return d.related_links.indexOf(a.id); });	
				
			    for (var i = 0; i < d.related_nodes.length; i++)
			    {	if (!titles.includes(d.name)){
			        d3.select('#' + d.related_nodes[i]).classed('highlight', true).style('fill', '#076eb5');
			        if (d.related_nodes[i][0] == "i") {d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#f2f3f4');}
			        else {d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#076eb5').attr('font-size', 18).style("font-weight", "600") ;};
			    }
			}
			    
			    for (var i = 0; i < d.related_links.length; i++)
			        d3.select('#' + d.related_links[i]).style('stroke', '#076eb5').style('stroke-width', '1.5px');
			}

			function mouseout(d)
			{   	
			    for (var i = 0; i < d.related_nodes.length; i++)
			    {	
			    	if (!titles.includes(d.name)){
			        d3.select('#' + d.related_nodes[i]).classed('highlight', false).style('fill', '#e8e8e8');
			        if (d.related_nodes[i][0] == "i") {d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#4f4f4f');}
			        else {d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#c1c1c1').attr('font-size', 16).style("font-weight", "normal") ;};
			    }
			}
			    
			    for (var i = 0; i < d.related_links.length; i++)
			        d3.select('#' + d.related_links[i]).style('stroke-width', '1px').style('stroke', '#ffffff');
			}
		}
	};
})();
