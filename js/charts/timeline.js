(() => {
	App.initTimeline = (selector, rawData, policyEventData, param = {}) => {
		const margin = {top: 25, right: 25, bottom: 50, left: 0};
		const width = param.width || 1125;
		const height = width * 0.25;

		// How high should the y axis be?
		// these numbers don't actualy show up, just define relative size of y axis on plot (number of cases)
        const cases = [
        10, // case identified
        10, // agent identified
        13, // humanitarian response
        20, // suspicion of deliberate use
        39, // state request for assistance
        72, // investigative response
        68, // WHO PH emergency declared
        41, // response and recovery
        28,  // confirmation of deliberate use
        26 // ongoing response and recovery
        ];

        // You can control the phantom midpoint for the line curve by adjusting these data points.
        const epiMidpoint = 77; // y coord for midpoint
        const epiMidpointIndex = 6; // the position within the list of cases
        const epiMidpointX = 667; // x coord for midpoint

        let xTmpCorrd = 190;
        let yTmpCoord = 252;
        // This data set statically places the noTimeCase circles onto the line. To move the circles, you need to
		// manipulate the coordinates here. These are relative to the case events.
		const noTimeCases = [
			[xTmpCorrd, yTmpCoord], // notification of cases
			[xTmpCorrd += 25, yTmpCoord-= 1], // coordinated medical response initiated
			[xTmpCorrd += 25, yTmpCoord-= 2], // begin epidemiological investigation
            // humanitarian response
            [xTmpCorrd += 80, yTmpCoord = 240], // define and identify cases
            [xTmpCorrd += 30, yTmpCoord-= 4], // implement control and prevention measures
            // suspicion of deliberate use
            [xTmpCorrd += 95, yTmpCoord-= 32], // monitor and treat new cases
            // investigative response
            [xTmpCorrd = 560, yTmpCoord = 120], // provision of assistance
            // state request for assistance
            [xTmpCorrd = 745, yTmpCoord = 107], // continued medical response to cases
            // WHO PHE declared
            [xTmpCorrd = 755, yTmpCoord = 115], // continued epidemiological investigation
            [xTmpCorrd = 775, yTmpCoord = 130], // increased prevention and control measures
            // Response and recovery
            [xTmpCorrd = 875, yTmpCoord = 186], // monitor for new cases
            // Confirmation of deliberate use
            [xTmpCorrd = 975, yTmpCoord = 206], // Sanctions issued
            [xTmpCorrd =710, yTmpCoord=68],
            [xTmpCorrd += 12, yTmpCoord-= 1], 
            [xTmpCorrd = 820, yTmpCoord = 99],
			];
		const data = rawData
            .map((d, i) => {
			return {
				eventName: d['Timeline Event'],
				eventDescription: d['Timeline Event Description'],
				numCases: cases[i],
                alwaysOccurs: d['Always occurs'],
                hasAssociatedPolicies: d['Has associated policies'],
			};
		});

		// The noTimeline case details are here
		const noCaseEventCircles = rawData.filter( (x) => x['Has associated policies'] !== 'TRUE')
            .map((d, i) => {
                return {
                    eventName: d['Timeline Event'],
                    eventDescription: d['Timeline Event Description'],
					position: i,
                    alwaysOccurs: d['Always occurs'],
                    hasAssociatedPolicies: d['Has associated policies'],
                };
            });


		const filterData = rawData.filter( (x) => x['Has associated policies'] !== 'FALSE')
            .map((d, i) => {
                return {
                    eventName: d['Timeline Event'],
                    eventDescription: d['Timeline Event Description'],
                    numCases: cases[i],
                    alwaysOccurs: d['Always occurs'],
                    hasAssociatedPolicies: d['Has associated policies'],
                };
            });


		const eventLabels = data.filter( (x) => x.hasAssociatedPolicies !== 'FALSE')
            .map(d => d.eventName.toUpperCase());

		const eventLabelsLower = data.filter( (x) => x.hasAssociatedPolicies !== 'FALSE')
            .map(d => d.eventName);


		// Get the event label by index
		function getEventLabelByIndex(idx) {
			const index = idx;

			if (index < 0 || index > eventLabels.length) {
				return 0; // just return the beginning index. For some reason, the idx is out of bounds
			}
			return eventLabels[index];
		}

        //Fix the bug where in the policy document count. We need to lowercase all text comparisons.
        const policyData = eventLabelsLower.map((d, i) => {
            return {
                count: policyEventData.filter( (x) => d.toLowerCase() === x['Timeline Event'].toLowerCase()).length,
				eventName: d,
            };
		});


		// Colours
		const backgroundColors = ['#94A0C3', 'white'];
		const legendColor = '#f7f8fa';
		const textColor = '#333333';
		const textBoldColor = '#666666';
		const pointColor = '#989898';
        const alwaysOccursPointColor = '#000000';
		const selectedPointColor = '#C91414';
		const highlightColor = '#000000';
		const scatterlineColor = '#082B84';
		const selectedTimelineGroup = '#C91414';
		const noTimeEventColor = '#000000';


        // Clear the previous SVG (if any)
		// add timeline chart to the DOM
        var svg = d3.select(selector).select("svg").remove();


        // Start building the timeline graphic
		const chart = d3.select(selector).append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`); // don't position to the left. We are keeping the graphic tight on the left side

		const defs = chart.append('defs');

		const backgroundGradient = defs.append('linearGradient')
			.attr('id', 'timeline-gradient')
			.attr('x1', '0%')
			.attr('x2', '100%')
			.attr('y1', '0%')
			.attr('y2', '0%');
		backgroundGradient.append('stop')
			.attr('stop-color', backgroundColors[1])
			.attr('stop-opacity', 1)
			.attr('offset', '0%');
		backgroundGradient.append('stop')
			.attr('stop-color', backgroundColors[0])
			.attr('stop-opacity', 178 / 255)
			.attr('offset', '100%');

		// fill background
		chart.append('rect')
			.attr('width', width)
			.attr('height', height)
			.attr('fill', 'url(#timeline-gradient)');

		// small labelling rectangle on the left
		chart.append('rect')
			.attr('width', 30)
			.attr('height', height)
			.attr('fill', legendColor)
			.attr('fill-opacity', 0.5);

		// Labelling Rectangle contents
		chart.append('text')
			.attr('transform', 'translate(20,' + String(height - 10) + ')rotate(-90)')
			.attr('fill', textColor)
			.attr('font-style', 'italic')
			.style('font-weight', '600')
			.attr('font-size', '10px')
			.text('Number of cases');

		// Upper left label
		const title = chart.append('text')
			.attr('class', 'top-description-title')
			.attr('transform', 'translate(35, 40)')
			.attr('fill', textBoldColor)
			.style('font-size', '0.8em')
			.text('EPIDEMIOLOGICAL CURVE');

		// Event Label
		const whatEvent = chart.append('text')
			.attr('class', 'what-event-is-it')
			.attr('transform', 'translate(35, 53)')
			.attr('fill', textBoldColor)
			.attr('font-style', 'italic')
			.style('font-size', '0.8em')
			.attr('event', eventLabelsLower[0])
			.text(eventLabelsLower[0]);

		// day label
		const whatDay = chart.append('text')
			.attr('class', 'what-day-is-it')
			.attr('transform', 'translate(35, 66)')
			.attr('fill', textBoldColor)
			.attr('font-style', 'italic')
			.style('font-size', '0.8em')
			.text('Day 1');

		// upper right label
		// TODO @steph adjust text
		// @Steph adjust legends here
		const circleLabelGroup = chart.append('g')
			.attr('transform', `translate(${width - 30}, 45)`)
			.style('text-anchor', 'end');

		circleLabelGroup.append('text')
			.style('fill', textBoldColor)
			.style('font-size', '0.8em')
			.text('Policy Trigger Always Occurs');

		circleLabelGroup.append('text')
			.attr('transform', 'translate(0, 12)')
			.style('fill', textBoldColor)
			.style('font-size', '0.8em')
			.text('Policy Trigger Sometimes Occurs');

		circleLabelGroup.append('text')
			.attr('transform', 'translate(0, 24)')
			.style('fill', textBoldColor)
			.style('font-size', '0.8em')
			.text('Tasks');

		circleLabelGroup.append('circle')
			.attr('transform', 'translate(7, -3)')
			.attr('r', 4)
			.style('stroke', noTimeEventColor)
			.style('stroke-width', 0.75)
			.style('fill', alwaysOccursPointColor);

		circleLabelGroup.append('circle')
			.attr('transform', 'translate(7, 9)')
			.attr('r', 4)
			.style('stroke', noTimeEventColor)
			.style('stroke-width', 0.75)
			.style('fill', pointColor);

		circleLabelGroup.append('circle')
			.attr('transform', 'translate(7, 21)')
			.attr('r', 4)
			.style('stroke', noTimeEventColor)
			.style('stroke-width', 0.75)
			.style('fill', 'white');


		const lineXDomain = eventLabels;
		lineXDomain.push("lastelement");
		const lineXLength = lineXDomain.length;

		// This is how we are going to control the x coordinates for the anchor points
		// I've created a custom scaleband which will be used throughout the rest of the
		// graphic
		const xPadding = 110; // This is what controls the spacing between the circles
		const xOffset = 60;
		const xCoordinateList = [];
		eventLabels.forEach( (d, i) => {
            // The padding is the spacing between the nodes. The offset is what moves across the xAxis.
			let xCoord= (i === 0) ? xOffset : ((i * xPadding) + xOffset); // i zero is the first element. don't include padding. just the offset
            xCoordinateList[d] = xCoord; // store the xCoordinate
		});


		// define scales. This is overriding the default D3 scaleband. We want to control the x coordinates specifically
		const x = (d) => {
			return xCoordinateList[d];
		};

		const dayScale = d3.scaleOrdinal()
			.domain(eventLabels)
			.range([1, 2, 10, 30, 50, 55, 75, 80, 91, 100]);

		const y = d3.scaleLinear()
			.domain([0, 100])
			.range([height, 0]);

		const reverseX = d3.scaleOrdinal()
			.domain(xCoordinateList)
			.range(eventLabels);

		// graph epicurve line here
		var line = d3.line()
			.curve(d3.curveCardinal)
			.x(function (d, i) {

				if (i === (lineXLength - 1)) {
					return width;
				}
				else if (i === epiMidpointIndex) {
					return epiMidpointX; // return the epi points midpoint. This is NOT in the xDomain which is why we are manually supplying it
				}
				else {
                    return x(d[0]); // this is an actual case and is referencing the X domain for these data
				}

			})
			.y(function (d) {
				return y(d[1]) // using the y domain data as this is an actual point. This is OK for the epi
			});

		let lineDomain = filterData.map(d => [d.eventName.toUpperCase(), d.numCases]);

		let newItem =  ['new point', epiMidpoint];

		// This is an insert method to insert an element at a specific index within an array.
        const insert = (arr, index, ...newItems) => [
            // part of the array before the specified index
            ...arr.slice(0, index),

            // inserted items
            ...newItems,

            // part of the array after the specified index
            ...arr.slice(index),
        ];

        lineDomain = insert(lineDomain, epiMidpointIndex, newItem);
		lineDomain.push(['lastelement', 25]);

		chart.append('path')
			.attr('fill', 'none')
			.style('stroke', 'white')
			.datum(lineDomain)
			.attr('d', line);

		// draw the policy graph
		const scatterline = chart.append('g').attr('class', 'policy-tract-group')
			.attr('transform', `translate(0, ${height + 5})`);

		scatterline.append('rect')
			.attr('class', 'policy-tract-container')
			.attr('width', width)
			.attr('height', 45)
			.attr('fill', 'url(#timeline-gradient)');

		scatterline.append('text')
			.attr('transform', 'translate(20, 42)rotate(-90)')
			.attr('fill', textColor)
			.attr('font-style', 'italic')
			.attr('font-size', '10px')
			.style('font-weight', '600')
			.text('Policies');

		scatterline.append('g')
			.attr('class', 'policy-tract-markers')
			.selectAll('rect')
			.data(policyData)
			.enter()
			.append('rect')
			.attr('class', (d, i) => `policy-tract-${i}`)
			.attr('x', d => x(d.eventName.toUpperCase()) - d.count)
			.attr('width', d=> d.count*2)
			.attr('height', 45)
			.style('fill', scatterlineColor);


		const markerLine = chart.append('g').attr('class', 'marker-line')
            .attr('transform', 'translate(0, 0)');
		markerLine.append('rect')
            .attr('width', width)
            .attr('height', 25)
			.style('fill-opacity', 0.35)
            .attr('fill', '#b5bed5');

        markerLine.append('g')
            .selectAll('g')
            .data(filterData)
            .enter()
			.append('line').attr('class', 'event-line-mark')
            .attr('x1', d => x(d.eventName.toUpperCase()))
            .attr('x2', d => x(d.eventName.toUpperCase()))
            .attr('y1', 0)
            .attr('y2', 25)
            .attr('stroke-width', 1)
            .attr('stroke', '#999a9b');


		// Group for each event
		const eventGroup = chart.append('g')
			.selectAll('g')
			.data(filterData)
			.enter()
			.append('g')
			.attr('class', (d, i) => `event-group-${i}`);

		// graph points on the line
		eventGroup.append('circle')
			.attr('cx', (d, i) => x(d.eventName.toUpperCase()))
			.attr('cy', d => y(d.numCases))
			.attr('r', '4')
			.attr('class', (d, i) => (i === App.currentEventIndex) ? 'selected-circle' : '')
			.attr('value', (d, i) => `scatter-circle-${i}`)
			.attr('stroke', noTimeEventColor)
            .attr('stroke-width', 0.75)
			.attr('fill', (d, i) => {
                if (i === App.currentEventIndex) {
			      return selectedPointColor;
                } else {
                    if (d.alwaysOccurs.toUpperCase() === 'ALWAYS OCCURS') {
			            return alwaysOccursPointColor;
                    }
                    else {
			            return pointColor;
                    }
                }
			});

		// graph point lines
		eventGroup.append('line')
			.attr('x1', (d, i) => x(d.eventName.toUpperCase()))
			.attr('x2', (d, i) => x(d.eventName.toUpperCase()))
			.attr('y1', height)
			.attr('y2', d => y(d.numCases))
			.attr('stroke-width', 1)
            .attr('class', (d, i) => (i === App.currentEventIndex) ? 'selected-line' : '')
			.attr('value', (d, i) => `scatter-line-${i}`)
			.attr('stroke', (d, i) => {
                if (i === App.currentEventIndex) {
                    return selectedPointColor;
                } else {
                    if (d.alwaysOccurs.toUpperCase() === 'ALWAYS OCCURS') {
                        return alwaysOccursPointColor;
                    }
                    else {
                        return pointColor;
                    }
                }
            })
            .style('stroke-dasharray', ('3, 3'));

		// label each point
		eventGroup.append('text')
			.attr('class', 'event-label')
			.attr('fill', (d, i) => (i === App.currentEventIndex) ? 'black' : textColor)
			.attr('text-anchor', 'middle')
			.style('font-size', (d, i) => (i === App.currentEventIndex) ? '1em' : '1em')
			.style('font-weight', (d, i) => (i === App.currentEventIndex) ? 600 : '')
			.html(function (d) {
				return wordWrap(
					d.eventName,
					16,
					x(d.eventName.toUpperCase()),
					y(d.numCases) - 30);
			});

        // you need to remember the previous color so that you can reset it
        // once it is deselected
        let previousSelectedPointColor = pointColor;

        const rectWidth = 120;
        // const rectHeight = 300;
		const rectHeight = height + 10 + 45;
        const markerWidth = 60;
        const markerHeight = 25;

		eventGroup.append('rect')
			.attr('x', d => x(d.eventName.toUpperCase()) - (rectWidth / 2))
			.attr('width', rectWidth)
			.attr('height', rectHeight)
			.attr('class', 'event-highlight-rect')
			.attr('value', d => d.eventName.toUpperCase())
			.style('fill', highlightColor)
			.style('fill-opacity', 0.)
			.on('click', function(d, i) {

                // Update the currently selected event index
                App.currentEventIndex = i;
                App.currentEventName = d.eventName; // set the new event name

				// reset all changes
				d3.selectAll('.event-highlight-rect')
					.style('fill-opacity', 0);
				d3.selectAll('.event-label')
					.style('fill', textColor)
					.style('font-size', '1em')
                    .style('font-weight', '');

                // d3.selectAll('.event-marker-highlight-icon')
                //     .style('visibility', 'hidden');
				chart.select('.event-marker-highlight-icon')
					.attr('transform', `translate(${x(eventLabels[i]) - (markerWidth / 2)})`);

                d3.selectAll('.policy-tract-markers rect')
					.style('fill', scatterlineColor);

                d3.select('.selected-circle')
					.attr('class', '')
					.attr('fill', previousSelectedPointColor);
                d3.select('.selected-line')
                    .attr('class', '')
                    .attr('stroke', previousSelectedPointColor);

				// now set text
				const group = d3.select(`.event-group-${i}`);
				group.selectAll('text')
					.style('font-size', '1em')
					.style('fill', 'black')
					.style('font-weight', 600);
				// now set rect
				d3.select(this)
					.style('fill-opacity', 0.15);

				let circle = d3.select(this.parentElement)
					.select('circle');
				previousSelectedPointColor = circle.attr('fill');

				circle.attr('fill', selectedPointColor)
					.attr('class', 'selected-circle');

                d3.select(this.parentElement)
					.select('line')
					.attr('stroke', selectedPointColor)
                    .attr('class', 'selected-line');

				// Select the red marker. This is based upon the currently selected group. The marker is a sibling of the selected element
				// d3.select(this.nextElementSibling)
                 //   .style('visibility', 'visible');

                // Set the policy rectangle red as well
				d3.select(`.policy-tract-${i}`)
					.style('fill', selectedPointColor);

				// now update labels
				whatEvent.text(d.eventName)
					.attr('value', d.eventName);
				whatDay.text(`Day ${dayScale(d.eventName.toUpperCase())}`);


			});



		// create the marker groups (The little red slider maker at the top of the timeline graphic)
        const markerGroup = chart.append('g')
			.attr('transform', `translate(${x(eventLabels[App.currentEventIndex]) - (markerWidth / 2)})`)
			.attr('class', 'event-marker-highlight-icon');

		markerGroup.append('rect')
            .attr('width', markerWidth)
            .attr('height', markerHeight)
			.attr('fill', selectedTimelineGroup)
			.attr('rx', '3')
            .attr('ry', '3')
            .style('fill-opacity', 0.85);

		let lineHeight = markerHeight - 3;
        // Drawing the three vertical lines
        markerGroup.append('line')
            .attr('x1', (markerWidth / 2) - 10)
            .attr('x2', (markerWidth / 2) - 10)
            .attr('y1', 3)
            .attr('y2', lineHeight)
            .attr('stroke-width', 1)
            .attr('stroke', 'white');

        markerGroup.append('line')
            .attr('x1', markerWidth / 2)
            .attr('x2', markerWidth / 2)
            .attr('y1', 3)
            .attr('y2', lineHeight)
            .attr('stroke-width', 1)
            .attr('stroke', 'white');

        markerGroup.append('line')
            .attr('x1', (markerWidth / 2) + 10)
            .attr('x2', (markerWidth / 2) + 10)
            .attr('y1', 3)
            .attr('y2', lineHeight)
            .attr('stroke-width', 1)
            .attr('stroke', 'white');

        const markerIndicator = markerGroup.append('line')
			.attr('x1', markerWidth / 2)
			.attr('x2', markerWidth / 2)
			.attr('y1', lineHeight)
			.attr('y2', height)
			.attr('stroke-width', 1)
			.style('visibility', 'hidden')
			.attr('stroke', selectedPointColor);

		const drag = d3.drag()
			.on('drag', function(d) {
				// var newX = d3.event.sourceEvent.x + d3.event.dx - 80 - margin.left;
				var newX = d3.event.x - (markerWidth / 2);
				// don't let it go too far left
				newX = Math.max(x(eventLabels[0]) - (markerWidth / 2), newX);
				// don't let it go too far right
				newX = Math.min(x(eventLabels[eventLabels.length - 2]) - (markerWidth / 2), newX);

				// set new Index
				const newIndex = Math.round((newX - (xOffset / 2)) / xPadding);
				App.currentEventIndex = newIndex;

				markerGroup.attr('transform', `translate(${newX})`);
				markerIndicator.style('visibility', 'visible');
			})
			.on('end', function(d) {
				markerIndicator.style('visibility', 'hidden');
				markerGroup.attr(
					'transform',
					`translate(${x(eventLabels[App.currentEventIndex]) - (markerWidth / 2)})`
				);
				App.currentEventName = eventLabels[App.currentEventIndex];

				// reset all changes
				d3.selectAll('.event-highlight-rect')
					.style('fill-opacity', d => {
						if (d.eventName.toUpperCase() === App.currentEventName.toUpperCase()) {
							return 0.15;
						} else {
							return 0;
						}
					});
				d3.selectAll('.event-label')
					.style('fill', textColor)
					.style('font-size', '1em')
					.style('font-weight', '');

				d3.selectAll('.policy-tract-markers rect')
					.style('fill', scatterlineColor);

				d3.select('.selected-circle')
					.attr('class', '')
					.attr('fill', previousSelectedPointColor);
				d3.select('.selected-line')
					.attr('class', '')
					.attr('stroke', previousSelectedPointColor);

				// now set text
				const group = d3.select(`.event-group-${App.currentEventIndex}`);
				group.selectAll('text')
					.style('font-size', '1em')
					.style('fill', 'black')
					.style('font-weight', 600);
				// now set rect
				d3.select(this)
					.style('fill-opacity', 0.15);

				const circle = d3.select(`[value="scatter-circle-${App.currentEventIndex}"]`);
				previousSelectedPointColor = circle.attr('fill');

				circle.attr('fill', selectedPointColor)
					.attr('class', 'selected-circle');

				chart.select(`[value="scatter-line-${App.currentEventIndex}"]`)
					.attr('stroke', selectedPointColor)
					.attr('class', 'selected-line');

				// Set the policy rectangle red as well
				d3.select(`.policy-tract-${App.currentEventIndex}`)
					.style('fill', selectedPointColor);

				// now update labels
				whatEvent.text(App.currentEventName)
					.attr('value', App.currentEventName);
				whatDay.text(`Day ${dayScale(App.currentEventName.toUpperCase())}`);


			});

		markerGroup.call(drag);

        // Add the circles to the line. These are statically placed. These only show the event name within the tooltip
        const noTimelineEvent = chart.append('g').attr('class', 'no-timeline-event-details')
            .selectAll('g')
            .data(noCaseEventCircles)
            .enter()
            .append('g')
            .attr('class', (d, i) => `no-timeline-event-group-${i}`);
        noTimelineEvent.append('circle')
            .attr('cx', d => noTimeCases[d.position][0])
            .attr('cy', d => noTimeCases[d.position][1])
            .attr('r', '4')
            .attr('class', '')
            .attr('stroke', noTimeEventColor)
            .attr('stroke-width', 0.75)
			.attr('fill', '#e6e9f1')
            .each(function(d) {
                const content = `<b>${d.eventName}</b>`;
                return $(this).tooltipster({
                    content: content,
                    trigger: 'hover',
                    side: 'bottom',
                });
            });

        // d3.selectAll('.event-marker-highlight-icon')
        //     .style('visibility', 'hidden'); // start with all of the red marker widgets hidden

		// Select the current policy tract
		d3.select(`.policy-tract-${App.currentEventIndex}`)
			.style('fill', selectedPointColor);

		d3.selectAll('.event-marker-highlight-icon')
			.filter( (d, i) => { return i=== App.currentEventIndex})
            .style('visibility', 'visible');

		// select the current event
		d3.select(`[value="${eventLabels[App.currentEventIndex]}"]`)
			.style('fill-opacity', 0.15);

		return chart;
	};
})();
