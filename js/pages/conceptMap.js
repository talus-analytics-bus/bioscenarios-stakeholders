(() => {
	App.initGraphs = (selector1, selector2, data) => {
		// TIMELINE	

		const events = ['First case in animals', 'First case in animals identified', 'First case in humans identified', 'Agent identified', 'WHO Public Health Emergency delcared', 'Suspicion of deliberate use', 'Confirmation of deliberate use'];
		const event_labels = []
		events.forEach(function(d) {event_labels.push(d.toUpperCase())});
		const margin = { top: 25, right: 25, bottom: 100, left: 25 };
		const width = 1200;
		const height = 140;
		const cases = [0,5,10,20,40,77,0];
		var timelineData = event_labels.map(function(e, i) {
		  return [e, cases[i]];
		});
		var event;

			// add chart to DOM
			const chart = d3.select(selector1).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', `translate(${margin.left}, ${margin.top})`);

			chart.append("rect")
			    .attr("width", width)
			    .attr("height", height)
			    .attr("fill", "#e8e8e8");

			chart.append("rect")
			    .attr("width", 30)
			    .attr("height", height)
			    .attr("fill", "#c9c9c9");

			chart.append("text")
				.attr("transform", "translate(20,"+String(height-10)+")rotate(-90)")
				.attr("fill", "white")
				.attr("font-style", "italic")
				.style("font-weight", "600")
				.text("Number of cases");

			// define scales
			const x = d3.scaleBand()
				.domain(event_labels)
				.range([0, width])
				.padding(1);
			const y = d3.scaleLinear()
				.domain([0, 100])
				.range([height, 0]);

			var line = d3.line()
				.curve(d3.curveBasis)
				.x(function(d) {return x(d[0])})
				.y(function(d) {return y(d[1])});

			chart.append("path")
				.attr("fill", "none")
				.style("stroke", "white")
		        .datum(timelineData)
		        .attr("d", line);

			// add axes to DOM
			const xAxis = d3.axisBottom()
				.tickSize(-height)
				.scale(x);

			var xaxis = chart.append("g")
				.attr('transform', `translate(0, ${height})`)
			    .call(xAxis);

			xaxis.selectAll("path").attr("stroke", "white");
			xaxis.selectAll("line").attr("stroke", "white");

			xaxis.selectAll("text")
				.attr("class", "timeline-label")
				.attr('transform', `translate(0, 20)`)
				.attr("font-size", 12)
				.call(wrap, 135);

			var box = {bottom:303.846923828125,height:194.0469207763672,left:263.09381103515625,right:386.84387969970703,top:109.80000305175781,width:123.75006866455078,x:263.09381103515625,y:109.80000305175781};
			chart.append("path").attr("class", "highlight-path").attr("d", "M "+String(box.x-33+box.width*0.6)+" "+String(box.y+35)+" L "+String(box.x-33+box.width*0.6)+" 0").attr("stroke", "#076eb5").attr("stroke-width", 3.5);
			chart.append("rect").attr("rx", 5).attr("ry", 5).attr("x", box.x-33).attr("y", box.y+35).attr("width", box.width*1.2).attr("height", box.height-130).attr("fill", "#076eb5").attr("opacity", 0.2).attr("class", "highlight-box");

			xaxis.selectAll(".tick")['_groups'][0].forEach(function(d1) {
				var data = d3.select(d1).data();
				d3.select(d1).on("click", function(d) {
						//d3.select(this).select('text').style('fill', 'white');
						event = events[event_labels.indexOf(d)];
						var box = d3.select(d1).node().getBoundingClientRect();
						chart.selectAll("rect.highlight-box").remove();
						chart.selectAll("text.highlight-text").remove();
						chart.selectAll("path.highlight-path").remove();
						chart.append("path").attr("class", "highlight-path").attr("d", "M "+String(box.x-33+box.width*0.6)+" "+String(box.y+35)+" L "+String(box.x-33+box.width*0.6)+" 0").attr("stroke", "#076eb5").attr("stroke-width", 3.5);
						chart.append("rect").attr("rx", 5).attr("ry", 5).attr("x", box.x-33).attr("y", box.y+35).attr("width", box.width*1.2).attr("height", box.height-130).attr("fill", "#076eb5").attr("opacity", 0.2).attr("class", "highlight-box");
			    		//chart.append("text").attr("class", "highlight-text").attr('transform', `translate(0, 20)`).attr("font-size", 14).attr("text-anchor", "middle").attr("fill", "red").text(d).call(wrap, 128);
			    		resetMap(event);
			    	});

			  })

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
			


		buildConceptMap("First case in animals identified", data);
		

		function resetMap(event) {
			$(selector2).empty();
			buildConceptMap(event, data);
		};

		//CONCEPT MAP
		function buildConceptMap(event, data) {
			data = data.filter(function(d) {return d.Event == event});
			var allOrgs = [{"Stakeholders": '["UN Organizations", "UNSG", "UNSGM", "UNGA", "OCHA", "JEU", "UNDPI", "UNIDIR", "UNODA", "BWC ISU", "UNSC", "WCO", "ICAO", "UNDAC", "FAO", "WFP", "UNHCR", "WIPO", "UNISDR", "WBG", "IMO", "UNICRI", "UNDSS", "WHO", "OPCW", "UNICEF"]'},
			{"Stakeholders": '["Non-governmental Organizations", "INTERPOL", "OIE", "ICRC", "IFRC", "MSF", "LOCAL NGOs", "Gavi", "National Academies", "CEPI", "Sabin", "IOM", "WTO", "Ministry of Health", "Veterinary care providers", "Health care workers", "Public Health Emergency Operation Center", "Local law enforcement", "National Governemnets (non-affected)", "Open Philanthropy", "Welcome Trust", "Bill & Melinda Gates Foundation", "Skoll Global Threats Fund", "Rockefeller Foundation", "Vulcan Foundation"]'},
			{"Stakeholders": '["Private Sector", "Pharmaceutical and biotechnology companies", "Telecommunications Companies", "GHSA PSRT", "WEF"]'}];
			data = allOrgs.concat(data);

			var titles = ["UN Organizations", "Non-governmental Organizations", "Private Sector"];

			var total = 56;

			var outer = d3.map();
			var inner = [];
			var links = [];

			var outerId = [0];

			data.forEach(function(d){
				if (d == null)
					return; 
				
				i = { id: 'i' + inner.length, name: d.Task, related_links: [] };
				i.related_nodes = [i.id];
				inner.push(i);
				if (typeof d.Stakeholders == "string") {d.Stakeholders = JSON.parse(d.Stakeholders);};

				
				d.Stakeholders.forEach(function(d1){
					
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

			inner.splice(0, 3);
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
				if (i <= 25) {
					data.outer[i2--] = outer[i];
				} else {
					data.outer[i1++] = outer[i];
				}
			}

			var diameter = 1160;
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
			    .range([50, 135, 215 ,320]);

			var outer_x_UN = d3.scaleLinear()
			    .domain([0, 26])
			    .range([50, 135]);

			var outer_x_non = d3.scaleLinear()
			    .domain([26, data.outer.length])
			    .range([215 ,320]);

			var outer_y = d3.scaleLinear()
			    .domain([0, data.outer.length])
			    .range([0, diameter / 2 - 120]);

			// setup positioning
			data.outer = data.outer.map(function(d, i) { 
				if (i<= total-27) {
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
		        .attr("y", -diameter/2+200)
		        .attr("dy", 0.35)
		        .attr("text-anchor", "middle")
		        .style("font-size", "25px") 
		        .style("font-weight", "600") 
		        .style('fill', '#076eb5')
		        .text(event.toUpperCase())
		        .call(wrap, 340);
					    

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
			function outer_size(d) {
				if (titles.includes(d.name)) {
					return 19
				} else {
					return 16
				}
			};
			  
			onode.append("text")
				.attr('id', function(d) { return d.id + '-txt'; })
			    .attr("dy", ".31em")
			    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
			    .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
			    .attr('fill', outer_color)
			    .attr('font-size', outer_size)
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
			    .attr('width', rect_width+2)
			    .attr('height', 21)
			    .attr("transform", "translate(-1, -1)")
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
			    	.call(wrap, 180);

			//onode.selectAll("text")['_groups'].forEach(function(d){console.log(d);});

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
			        else {d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#076eb5').attr('font-size', 19).style("font-weight", "600") ;};
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
