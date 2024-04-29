class MapPlot {

	//To make the gradient scale
	makeColorbar(svg, color_scale, top_left, colorbar_size, format) {

		const scaleClass=d3.scaleLinear;

		const value_to_svg = scaleClass()
			.domain(color_scale.domain())
			.range([colorbar_size[1], 0]);

		const range01_to_color = d3.scaleLinear()
			.domain([0, 1])
			.range(color_scale.range())
			.interpolate(color_scale.interpolate());

		// Axis numbers
		const colorbar_axis = d3.axisLeft(value_to_svg)
			.tickFormat(d3.format(format))

		const colorbar_g = this.svg.append("g")
			.attr("id", "colorbar")
			.attr("transform", "translate(" + top_left[0] + ', ' + top_left[1] + ")")
			.call(colorbar_axis);

		// Create the gradient
		function range01(steps) {
			return Array.from(Array(steps), (elem, index) => index / (steps-1));
		}

		const svg_defs = this.svg.append("defs");

		const gradient = svg_defs.append('linearGradient')
			.attr('id', 'colorbar-gradient')
			.attr('x1', '0%') // bottom
			.attr('y1', '100%')
			.attr('x2', '0%') // to top
			.attr('y2', '0%')
			.attr('spreadMethod', 'pad');

		gradient.selectAll('stop')
			.data(range01(10))
			.enter()
			.append('stop')
				.attr('offset', d => Math.round(100*d) + '%')
				.attr('stop-color', d => range01_to_color(d))
				.attr('stop-opacity', 1);

		// create the colorful rect
		colorbar_g.append('rect')
			.attr('id', 'colorbar-area')
			.attr('width', colorbar_size[0])
			.attr('height', colorbar_size[1])
			.style('fill', 'url(#colorbar-gradient)')
			.style('stroke', 'black')
			.style('stroke-width', '1px')
	}


	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);

		//Get the svg dimensions
		const svg_viewbox = this.svg.node().viewBox.animVal;
		this.svg_width = svg_viewbox.width;
		this.svg_height = svg_viewbox.height;

		//projection for the map
		const projection = d3.geoNaturalEarth1()
			.rotate([0, 0])
			.center([8.3, 46.8]) //Latitude and longitude of center of switzerland
			.scale(13000)
			.translate([this.svg_width / 2, this.svg_height / 2])
			.precision(.1);

		// path generator for the cantons
		const path_generator = d3.geoPath()
			.projection(projection);

		//Six color map, one per data set
		//Domain where made manually
		const color_scale_cases = d3.scaleLinear()
    .range(["rgb(255,255,255)", "rgb(255,0,0)"]) // Adjusted range to go from white to hot red
    .domain([0, 5418]);

const color_scale_cases_d = d3.scaleLinear()
    .range(["rgb(255,255,255)", "rgb(255,0,0)"]) // Adjusted range to go from white to hot red
    .domain([0, 1.0246656522783695]);


		//Get the data-sets
		const passengers_promise = d3.json("data/switzerland/europe_passengers_per_month.json").then((data) => {
			return data
		});

		const cases_promise = d3.json("data/switzerland/covid19_cases_switzerland_openzh_clean.json").then((data) => {
				return data
			});

		const cases_densities_promise = d3.json("data/switzerland/covid19_cases_switzerland_openzh_clean_densities.json").then((data) => {
			return data
		});

		const map_promise = d3.json("data/map/europe_map.json").then((topojson_raw) => {
			const canton_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries);
			return canton_paths.features;
		});


		Promise.all([cases_promise, cases_densities_promise, map_promise, passengers_promise]).then((results) => {
			let cases_data = results[0];
			let cases_data_d = results[1];
			let map_data = results[2];
			let promises_data = results[3];

			//add the data as a property of the canton
			map_data.forEach(canton => {
				canton.properties.cases = 0;//cases_data[canton.id];
				canton.properties.casesD = 0;//cases_data_d[canton.id];
				canton.properties.recovsD = 0;//recov_data_d[canton.id];
			});

			// We need three binary variable for the buttons
			var case_b = true; //if data is cases
			var rel_b = false; //if relative data

			//to handle tooltip
			var current_canton = ""; //to know the canton in which the mouse is
			var update_tt = false; // if should update the tooltip (mouse is in a canton)

			/**
			* Update the focus
			*
			* Function used when we need to update the focus when changing the data-set or slider.
			*
			* @param {Number}	pos	position of the slider
			* @param {Object}	data data-set
			* @param {String} date  date on which the focus should be
			* @param {Number}	limit limit used to know when to change the position of the text (above or below the line)
			* @param {Boolean}	transition if there should be a transtion or not
			*
			*/
			function updatefocus(pos, data, date, limit, transition){

				focusText.html(data["CH"][date]) //update text

				if (transition){
					//we have clicked in a button
					focus.transition().duration(300).attr("cx", x_chart(pos)).attr("cy", y_chart(data["CH"][date]))
					if (x_chart(pos) < limit){
						//above curve
						focusText.transition().duration(300).attr("x", x_chart(pos) + 7).attr("y", y_chart(data["CH"][date]) - 7)
					}else{
						//below curve
						focusText.transition().duration(300).attr("x", x_chart(pos) + 7).attr("y", y_chart(data["CH"][date]) + 7)
					}
				} else {
					//slider has moved
					focus.attr("cx", x_chart(pos)).attr("cy", y_chart(data["CH"][date]))
					if (x_chart(pos) < limit){
						//above curve
						focusText.attr("x", x_chart(pos) + 7).attr("y", y_chart(data["CH"][date]) - 7)
					}else{
						//below curve
						focusText.attr("x", x_chart(pos) + 7).attr("y", y_chart(data["CH"][date]) + 7)
					}
				}
			}

			const monthNumberToLabelMap = {
				['01']: 'January',
				['02']: 'February',
				['03']: 'March',
				['04']: 'April',
				['05']: 'May',
				['06']: 'June',
				['07']: 'July',
				['08']: 'August',
				['09']: 'September',
				['10']: 'October',
				['11']: 'November',
				['12']: 'December',
			  }

			//---------- SLIDER ----------//
			var dates = Object.keys(cases_data['AG']); //get all dates

			var startDate = new Date(dates[0]);
			var endDate = new Date(dates[dates.length - 1]);

			var formatDateIntoYear = d3.timeFormat("%m"); // day mon.
			var formatDate = d3.timeFormat("%m"); //day Month
			var formatFromSlider = d3.timeFormat("%Y-%m-%d") //Year-mon.-day

			var slider_margin = {top:0, right:50, bottom:0, left:50};

			var slider_svg = d3.select('#slider');

			const svg_slider_viewbox = slider_svg.node().viewBox.animVal;
			const svg_slider_width = svg_slider_viewbox.width - slider_margin.left - slider_margin.right;
			const svg_slider_height = svg_slider_viewbox.height  - slider_margin.top - slider_margin.bottom;

			var moving_b = false; //if slider is moving
			var currentValue = 0; //slider value
			var targetValue = svg_slider_width;
			var timer = 0;

			var x = d3.scaleTime()
					.domain([startDate, endDate])
					.range([0, svg_slider_width])
					.clamp(true);

			var slider = slider_svg.append("g")
					.attr("class", "slider")
					.attr("transform", "translate(" + slider_margin.left + "," + svg_slider_height/2 + ")");

			// slider line
			slider.append("line")
				.attr("class", "track")
				.attr("x1", x.range()[0])
				.attr("x2", x.range()[1])
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
				.attr("class", "track-inset")
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
				.attr("class", "track-overlay")
				.call(d3.drag()
					.on("start.interrupt", function() { slider.interrupt(); })
					.on("start drag", function() {
						currentValue = d3.event.x;
						update(x.invert(currentValue))
					})
				);

			slider.insert("g", ".track-overlay")
				.attr("class", "ticks")
				.attr("transform", "translate(0," + 18 + ")")
				.selectAll("text")
				.data(x.ticks(10))
				.enter()
				.append("text")
				.attr("fill", "CurrentColor")
				.attr("x", x)
				.attr("y", 10)
				.attr("text-anchor", "middle")
				.text(function(d) { return monthNumberToLabelMap[formatDateIntoYear(d)] });

			//text slider
			var label = slider.append("text")
				.attr("class", "label")
				.attr("text-anchor", "middle")
				.text(monthNumberToLabelMap[formatDateIntoYear(startDate)])
				.attr("fill", "CurrentColor")
				.attr("transform", "translate(0," + (-25) + ")")

			//circle slider
			var handle = slider.insert("circle", ".track-overlay")
				.attr("class", "handle")
				.attr("r", 9);

			/**
			* Advance the slider circle by one step.
			*
			* Called with SetTimer().
			*
			*/
			function step() {
				update(x.invert(currentValue));
				currentValue = currentValue + (targetValue/151);
				if (currentValue > targetValue) {
					moving_b = false;
					currentValue = 0;
					update(x.invert(currentValue));
					clearInterval(timer);
				}
			}

			/**
			* Update the map with the right data.
			*
			* Called when the slider moves.
			*
			*/
			function update(pos) {
				//move circle
				handle.attr("cx", x(pos));

				//update the slider text
				label
					.attr("x", x(pos))
					.text(monthNumberToLabelMap[formatDateIntoYear(pos)]);

				var date = formatFromSlider(pos); //get date from slider pos

				if (!rel_b){
						//data is absolute
						cantons.style("fill",(d) => color_scale_cases(d.properties.cases[date]));
						updatefocus(pos, cases_data, date, 228, false)
						if (update_tt){
							//we have the tooltip over the map
							tooltip2
								.html("Cases: " + current_canton.properties.cases[date])
						}
				} else {
						//data is relative
						cantons.style("fill",(d) => color_scale_cases_d(d.properties.casesD[date]));
						updatefocus(pos, cases_data_d, date, 228, false)
						if (update_tt){
							//we have the tooltip over the map
							tooltip2
								.html("Cases: " + current_canton.properties.casesD[date])
						}
				}
			}

			//---------- TOOLTIP ----------//

			//tooltip
			var tooltip2 = d3.select("#map_div")
			.append("div")
	    .style("position", "absolute")
	    .style("visibility", "hidden")
			.style("display", "none")
	    .style("background-color", "white")
	    .style("border", "solid")
	    .style("border-width", "1px")
	    .style("border-radius", "5px")
	    .style("padding", "10px");

			// Three function that change the tooltip when user hover / move / leave a cell
			var mouseover = function(d) {
				current_canton = d;
				update_tt = true;
				tooltip2
					.style("opacity", 1)
					.style("visibility", "visible")
					.style("display", "block")
					.style("left", (d3.mouse(this)[0]) + (d3.select("#map_div").node().getBoundingClientRect()["width"] - d3.select("#map-plot").node().getBoundingClientRect()["width"])/2 + "px")
					.style("top", (d3.mouse(this)[1]) + d3.select("#map_intro").node().getBoundingClientRect()["height"]+ "px")
					console.log(d3.mouse(this)[1])
			}

			var mousemove = function(d) {
				var date = formatFromSlider(x.invert(currentValue));

				if (rel_b){
					tooltip2.html("Cases: " + d.properties.casesD[date]);
				} else {
					tooltip2.html("Cases: " + d.properties.cases[date]);
				}

				tooltip2
				.style("opacity", 1)
					.style("left", (d3.mouse(this)[0]) + (d3.select("#map_div").node().getBoundingClientRect()["width"] - d3.select("#map-plot").node().getBoundingClientRect()["width"])/2 + "px")
					.style("top", (d3.mouse(this)[1]) + d3.select("#map_intro").node().getBoundingClientRect()["height"] + "px")
			}

			var mouseout = function(d) {
				update_tt = false;
				tooltip2
				.style("opacity", 0)
				.style("visibility", "hidden")
			}

			d3.select("#map_div").on("mouseleave",mouseout)

			//---------- MAP ----------//
			this.map_container = this.svg.append('g');
			this.label_container = this.svg.append('g');

			//draw canton
			var cantons = this.map_container.selectAll(".canton")
				.data(map_data)
				.enter()
				.append("path")
				.classed("canton", true)
				.attr("d", path_generator)
				.style("fill", (d) => color_scale_cases(null)) //white initially
				.on("mouseover", mouseover)
      	.on("mousemove", mousemove)

			// put the names of canton
			this.label_container.selectAll(".canton-label")
				.data(map_data)
				.enter().append("text")
				.classed("canton-label", true)
				.attr("transform", (d) => "translate(" + path_generator.centroid(d) + ")")
				.attr("dy", ".35em")
				.text((d) => d.id);

			plot_object.makeColorbar(this.svg, color_scale_cases, [40, 30], [20, this.svg_height - 2*30],".0f");

			//---------- DATA BUTTONS ----------//
			var case_button = d3.select("#case-btn");
			var abs_button = d3.select("#abs-btn");
			var rel_button = d3.select("#rel-btn")

			/**
			* Change the button color.
			*
			* This function change the button color when cond is met.
			*
			* @param {button}	Object	button to change the color
			* @param {Boolean}	cond if cond is true then change the color
			* @param {String} color  the color to set
			*
			*/
			function change_color(button, cond, color = "#39A9DB"){
        if (cond) {
          button.style("background-color", color)
        } else {
          button.style("background-color", "#1C77C3")
        }
      }

		case_button
			.on("click", function() {
				case_b = true;

				//update the buttons color to have only the case button to the right color
				change_color(case_button,case_b);

				var date = formatFromSlider(x.invert(currentValue));

				if (!rel_b){
					//absolute data
					if (!moving_b) {
						//slider is not moving, we should change the dataset "manually" since it wont be update by slider movement
						cantons.style("fill", (d) => color_scale_cases(d.properties.cases[date]));
					}
					updatefocus(x.invert(currentValue), cases_data, date, 228, true);
					d3.select("#map-plot").select("#colorbar").remove();
					d3.select("defs").remove();
					plot_object.makeColorbar(d3.select('#' + svg_element_id), color_scale_cases, [40, 30], [20, d3.select('#' + svg_element_id).node().viewBox.animVal.height - 2*30],".0f");
				} else {
					if (!moving_b) {
						//slider is not moving, we should change the dataset "manually" since it wont be update by slider movement
						cantons.style("fill", (d) => color_scale_cases_d(d.properties.casesD[date]));
					}
					updatefocus(x.invert(currentValue), cases_data_d, date, 228, true);
					d3.select("#map-plot").select("#colorbar").remove();
					d3.select("defs").remove();
					plot_object.makeColorbar(d3.select('#' + svg_element_id), color_scale_cases_d, [40, 30], [20, d3.select('#' + svg_element_id).node().viewBox.animVal.height - 2*30],".3f");
				}
			});

			abs_button
			.on("click", function() {
				rel_b = false;

				//update the buttons color to have only the abs button to the right color
				change_color(abs_button, !rel_b);
				change_color(rel_button, rel_b);

				var date = formatFromSlider(x.invert(currentValue));

				if(case_b){
					//absolute data
					if (!moving_b) {
						//slider is not moving, we should change the dataset "manually" since it wont be update by slider movement
						cantons.style("fill", (d) => color_scale_cases(d.properties.cases[date]));
					}
					updatefocus(x.invert(currentValue), cases_data, date, 200, true);
					d3.select("#map-plot").select("#colorbar").remove();
					d3.select("defs").remove();
					plot_object.makeColorbar(d3.select('#' + svg_element_id), color_scale_cases, [40, 30], [20, d3.select('#' + svg_element_id).node().viewBox.animVal.height - 2*30],".0f");
				}
			});

			rel_button
			.on("click", function() {
				rel_b = true;

				//update the buttons color to have only the rel button to the right color

				change_color(abs_button, !rel_b);
				change_color(rel_button, rel_b);

				var date = formatFromSlider(x.invert(currentValue));

				if(case_b){
					//absolute data
					if (!moving_b) {
						//slider is not moving, we should change the dataset "manually" since it wont be update by slider movement
						cantons.style("fill", (d) => color_scale_cases_d(d.properties.casesD[date]));
					}
					updatefocus(x.invert(currentValue), cases_data_d, date, 200, true);
					d3.select("#map-plot").select("#colorbar").remove();
					d3.select("defs").remove();
					plot_object.makeColorbar(d3.select('#' + svg_element_id), color_scale_cases_d, [40, 30], [20, d3.select('#' + svg_element_id).node().viewBox.animVal.height - 2*30],".3f");
				}
			});
		});
	}
}

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
	plot_object = new MapPlot('map-plot');
	// plot object is global, you can inspect it in the dev-console
});