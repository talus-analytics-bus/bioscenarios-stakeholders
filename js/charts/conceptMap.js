(() => {
	App.initConceptMap = (selector, eventName, data) => {
		// get event data
		// TODO: Pick event based on timeline
		eventName = 'First case in humans identified';

		data = data.filter(function(d) {return d.Event == eventName});
		// add data to ensure all stakeholders will be shown
		var allOrgs = [{"Stakeholders": '["UN Organizations", "UNSG", "UNSGM", "UNGA", "OCHA", "JEU", "UNDPI", "UNIDIR", "UNODA", "BWC ISU", "UNSC", "WCO", "ICAO", "UNDAC", "FAO", "WFP", "UNHCR", "WIPO", "UNISDR", "WBG", "IMO", "UNICRI", "UNDSS", "WHO", "OPCW", "UNICEF"]'},
		{"Stakeholders": '["Non-governmental Organizations", "INTERPOL", "OIE", "ICRC", "IFRC", "MSF", "LOCAL NGOs", "Gavi", "National Academies", "CEPI", "Sabin", "IOM", "WTO", "Ministry of Health", "Veterinary care providers", "Health care workers", "Public Health Emergency Operation Center", "Local law enforcement", "National Governemnets (non-affected)", "Open Philanthropy", "Welcome Trust", "Bill & Melinda Gates Foundation", "Skoll Global Threats Fund", "Rockefeller Foundation", "Vulcan Foundation"]'},
		{"Stakeholders": '["Private Sector", "Pharmaceutical and biotechnology companies", "Telecommunications Companies", "GHSA PSRT", "WEF"]'}];
		data = allOrgs.concat(data);

		var titles = ["UN Organizations", "Non-governmental Organizations", "Private Sector"]; //these data points will be styled as titles

		var total = 56; //total stakeholders

		var outer = d3.map();
		var inner = [];
		var links = [];

		var outerId = [0];

		//format the data
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

		inner.splice(0, 3); //get rid of inner nodes genereated from added outer nodes
		links.splice(0, total); //get rid of nonexistant links to outer nodes

		data = {
			inner: inner,
			outer: outer.values(),
			links: links
		}

		outer = data.outer;
		data.outer = Array(outer.length);

		var i1 = 0;
		var i2 = outer.length - 1;

		// place outer nodes around the outer circle
		for (var i = 0; i < data.outer.length; ++i)
		{
			if (i <= 25) { //putting UN organizations on the left
				data.outer[i2--] = outer[i];
			} else {
				data.outer[i1++] = outer[i];
			}
		}

		var diameter = 1100;
		var rect_width = 250;
		var rect_height = 100; 

		var il = data.inner.length;
		var ol = data.outer.length;

		var inner_y = d3.scaleLinear()
			.domain([0, il])
			.range([-(il * rect_height)/2, (il * rect_height)/2]);

		var outer_x_UN = d3.scaleLinear()
			.domain([0, 26])
			.range([50, 135]); //sets how spread out outer nodes on the left will be

		var outer_x_non = d3.scaleLinear()
			.domain([26, data.outer.length])
			.range([215 ,320]); //sets how spread out outer nodes on the right will be

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
			d.y = diameter/3;
			return d;
		});

		//set coordinates for inner nodes
		data.inner = data.inner.map(function(d, i) { 
			d.x = -(rect_width / 2);
			d.y = inner_y(i);
			return d;
		});

		function projectX(x) {
			return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
		}

		//define bezier curve from inner to outer nodes
		function diagonal(d) {
			return "M" + String(-d.outer.y * Math.sin(projectX(d.outer.x))) + "," + String(d.outer.y * Math.cos(projectX(d.outer.x))) 
			+ " " + "C"
			+ " " + String((-d.outer.y * Math.sin(projectX(d.outer.x))+(d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width))/2)+","+String(d.outer.y * Math.cos(projectX(d.outer.x))) 
			+ " " + String((-d.outer.y * Math.sin(projectX(d.outer.x))+(d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width))/2)+","+String(d.inner.y + rect_height/2)
			+ " " + String(d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width) + "," + String(d.inner.y + rect_height/2);
		}

		//define graph
		var svg = d3.select(selector).append("svg")
			.attr("width", diameter+150)
			.attr("height", diameter)
			.append("g")
			.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
		//add event title
		svg.append("text")
			.attr("x", 0)	
			//Adjust placement of title based on number of sub-events for event?			 
			.attr("y", -diameter/2+200)
			.attr("dy", 0.35)
			.attr("text-anchor", "middle")
			.style("font-size", "25px") 
			.style("font-weight", "600") 
			.style('fill', '#076eb5')
			.text(eventName.toUpperCase())
			.call(wrap, 340);	 

		// add links
		var link = svg.append('g').attr('class', 'links').selectAll(".link")
				.data(data.links)
			.enter().append('path')
				.attr('class', 'link')
				.attr("d", diagonal)
				.attr('id', function(d) { return d.id })
				.attr('fill', "none")
				.style('stroke-width', '1px')
				.style('stroke', '#e5e5e5');
				

		// outer nodes
		var onode = svg.append('g').selectAll(".outer_node")
			.data(data.outer)
			.enter().append("g")
			.attr("class", "outer_node")
			.attr("transform", function(d) {return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";})
			.on("mouseover", mouseover)
			.on("mouseout", mouseout);

		function circle_color(d) {
			if (titles.includes(d.name)) {
				return "white" // no circle for nodes representing titles
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
				return "black" // style nodes representing titles
			} else {
				return '#c1c1c1'
			}
		};
		function outer_dec(d) {
			if (titles.includes(d.name)) {
				return "underline" // style nodes representing titles
			} else {
				return "none"
			}
		};
		function outer_style(d) {
			if (titles.includes(d.name)) {
				return "italic" // style nodes representing titles
			} else {
				return "none"
			}
		};
		function outer_size(d) {
			if (titles.includes(d.name)) {
				return 19 // style nodes representing titles
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
		// large inner node rectangles
		inode.append('rect')
			.attr('width', rect_width)
			.attr('height', rect_height)
			.attr('id', function(d) { return d.id; })
			.attr('fill', '#e8e8e8');
		// add white rectangles between inner node rectangles to put space between them
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
			.attr("dy", -0.8)
			.text(function(d) { return d.name })
				.call(wrap, 180);

		// need to specify x/y/etc
		d3.select(self.frameElement).style("height", diameter - 150 + "px");

		function mouseover(d)
		{
			// bring moused links to front
			d3.selectAll('.links .link').sort(function(a, b){ return d.related_links.indexOf(a.id); });	
			
			for (var i = 0; i < d.related_nodes.length; i++)
			{	if (!titles.includes(d.name)){ // interactivity only for non-title nodes
				d3.select('#' + d.related_nodes[i]).classed('highlight', true).style('fill', '#076eb5'); // color related nodes blue
				if (d.related_nodes[i][0] == "i") {d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#f2f3f4');} // color inner node text lighter
				else {d3.select('#' + d.related_nodes[i] + '-txt').style('fill', '#076eb5').attr('font-size', 19).style("font-weight", "600") ;}; // color outer text blue and bigger
			}
		}
			
			for (var i = 0; i < d.related_links.length; i++)
				d3.select('#' + d.related_links[i]).style('stroke', '#076eb5').style('stroke-width', '1.5px'); //make links blue and thicker
		}

		function mouseout(d) // set everything back to normal
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
				d3.select('#' + d.related_links[i]).style('stroke-width', '1px').style('stroke', '#e5e5e5');
		}
		}
})();
