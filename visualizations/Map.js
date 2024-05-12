class MapPlot {

	// Make the color scale
	 makeColorbar(svg, color_scale, top_left, colorbar_size, format) {
		const value_to_svg = d3.scaleLinear()
			.domain(color_scale.domain())
			.range([colorbar_size[1], 0]);
	
		const colorbar_axis = d3.axisLeft(value_to_svg)
			.tickFormat(d3.format(format));
	
		const colorbar_g = svg.append("g")
			.attr("id", "colorbar")
			.attr("transform", "translate(" + top_left[0] + ',' + top_left[1] + ")")
			.call(colorbar_axis);
	
		const svg_defs = svg.append("defs");
	
		const gradient = svg_defs.append('linearGradient')
			.attr('id', 'colorbar-gradient')
			.attr('x1', '0%') // bottom
			.attr('y1', '100%')
			.attr('x2', '0%') // to top
			.attr('y2', '0%')
			.attr('spreadMethod', 'pad');
	
		const domain = color_scale.domain();
		const range = color_scale.range();
	
		const num_stops = range.length;
		const stop_offsets = domain.map((d, i) => (d - domain[0]) / (domain[num_stops - 1] - domain[0]));
	
		for (let i = 0; i < num_stops; i++) {
			gradient.append('stop')
				.attr('offset', (100 * stop_offsets[i]) + '%')
				.attr('stop-color', range[i])
				.attr('stop-opacity', 1);
		}
	
		colorbar_g.append('rect')
			.attr('id', 'colorbar-area')
			.attr('width', colorbar_size[0])
			.attr('height', colorbar_size[1])
			.style('fill', 'url(#colorbar-gradient)')
			.style('stroke', 'black')
			.style('stroke-width', '1px');
	}
	


	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);

		//Get svg dims
		const svg_viewbox = this.svg.node().viewBox.animVal;
		this.svg_width = svg_viewbox.width;
		this.svg_height = svg_viewbox.height;

		// Projection for map
		const projection = d3.geoNaturalEarth1()
			.rotate([0, 0])
			.center([8.3, 46.8]) //Latitude and longitude of center of switzerland
			.scale(13000)
			.translate([this.svg_width / 2, this.svg_height / 2])
			.precision(.1);

		// Generates paths for countries
		const path_generator = d3.geoPath()
			.projection(projection);

		// Domain and colors for the color scale
		const color_scale_tourists = d3.scaleLinear()
			.range(["rgb(255,255,255)", "red"]) // Adjusted range to go from white to hot red
			.domain([0, 15000000])
			.interpolate(d3.interpolateRgb);

		const color_scale_tourists_d = d3.scaleLinear()
			.range(["rgb(255,255,255)", "red"]) // Adjusted range to go from white to hot red
			.domain([0, 0.2])
			.interpolate(d3.interpolateRgb);


		// Get the data set for the countries
		const passengers_promise = d3.json("./Data/europe_passengers/europe_passengers_per_month.json").then((data) => {
			return data
		});

		// Get the map topoJson info
		const map_promise = d3.json("./Data/Map/europe_map.json").then((topojson_raw) => {
			const country_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries);
			return country_paths.features;
		});


		Promise.all([map_promise, passengers_promise]).then((results) => {
			let map_data = results[0];
			let countries_data = results[1];

			// Change countries data to map<id, map<year, array[months]>>
			const countries_processed = {};
			const totalPassengersInEurope = {};

			countries_data.measures.forEach(measure => {
			const { id, year, month, passengers } = measure;
			
			if (!countries_processed[id]) {
				countries_processed[id] = {};
			}

			if (!countries_processed[id][year]) {
				countries_processed[id][year] = new Array(12).fill(0);
			}

			countries_processed[id][year][parseInt(month) - 1] = parseInt(passengers);

			if (!totalPassengersInEurope[year]) {
				totalPassengersInEurope[year] = new Array(12).fill(0);
			}
			totalPassengersInEurope[year][parseInt(month) - 1] += parseInt(passengers);
			});



			// Add country data to the map data
			const months_total = new Array(12).fill(0);
			map_data.forEach(country => {
				const total = new Array(12).fill(0);
				const processedData = countries_processed[country.id];
				Object.values(processedData).forEach(yearData => {
					// Iterate over months
					yearData.forEach((passengers, monthIndex) => {
						// Add passengers for each month to the corresponding index in total array
						total[monthIndex] += passengers;
					});
				});
				for (let i = 0; i < total.length; i++) {
					total[i] = Math.floor(total[i] / 17);
					months_total[i] += total[i];
				}

				const proportion = {}; // Object to store proportions
				

				// Iterate over years
				Object.keys(processedData).forEach(year => {
					proportion[year] = {}; // Initialize proportion for the year

					// Iterate over months
					processedData[year].forEach((passengers, monthIndex) => {
						// Calculate proportion for the month
						const passengersInCountryThisMonth = passengers;
						const totalPassengersEuropeThisMonth = totalPassengersInEurope[year][monthIndex];
						const proportionThisMonth = totalPassengersEuropeThisMonth !== 0 ? passengersInCountryThisMonth / totalPassengersEuropeThisMonth : 0;
						proportion[year][monthIndex] = proportionThisMonth.toFixed(4);
					});
				});

				country.properties.tourists = countries_processed[country.id];
				country.properties.tourist_proportion = proportion;
				country.properties.total = total;
			});

			map_data.forEach(country => {
				const total_proportion = new Array(12).fill(0);
				for (let i = 0; i < country.properties.total.length; i++) {
					total_proportion[i] = (country.properties.total[i]/months_total[i]).toFixed(4);
				}
				country.properties.total_proportion = total_proportion
			});

			// Binary vars for the
			var rel_b = false; //if relative data

			/**
			* Update the focus
			*
			* Function used when we need to update the focus when changing the data-set or slider.
			*
			* @param {Number}	pos	position of the slider
			* @param {Object}	data data-set
			* @param {String} 	month  date on which the focus should be
			* @param {Number}	limit limit used to know when to change the position of the text (above or below the line)
			* @param {Boolean}	transition if there should be a transtion or not
			* @param {String}	currentYear if there should be a transtion or not
			*
			*/
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
			var formatDateIntoYear = d3.timeFormat("%m"); // day mon.
			var formatFromSlider = d3.timeFormat("%m") //Year-mon.-day

			var slider_margin = {top:0, right:50, bottom:0, left:50};

			var slider_svg = d3.select('#slider');

			const svg_slider_viewbox = slider_svg.node().viewBox.animVal;
			const svg_slider_width = svg_slider_viewbox.width - slider_margin.left - slider_margin.right;
			const svg_slider_height = svg_slider_viewbox.height  - slider_margin.top - slider_margin.bottom;

			var currentValue = 0; //slider value
			var currentYear = "0";
			var startmonth = new Date(2024, 0); // January
			var endmonth = new Date(2024, 11); // December

			var x = d3.scaleTime()
				.domain([startmonth, endmonth])
				.range([0, svg_slider_width])
				.clamp(true);

			var slider = slider_svg.append("g")
					.attr("class", "slider")
					.attr("transform", "translate(" + slider_margin.left + "," + svg_slider_height/2 + ")");

			// Line of the slider
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
				
			// Slider text
			var label = slider.append("text")
				.attr("class", "label")
				.attr("text-anchor", "middle")
				.text('January')
				.attr("fill", "CurrentColor")
				.attr("transform", "translate(0," + (-25) + ")")

			// Slider circle marker
			var handle = slider.insert("circle", ".track-overlay")
				.attr("class", "handle")
				.attr("r", 9);


			// When the slider moves, update the map accordingly.
			function update(pos) {
				// Move circle for slider
				handle.attr("cx", x(pos));
				
				// Update text on slider
				label.attr("x", x(pos))
					 .text(monthNumberToLabelMap[formatDateIntoYear(pos)]);
				
				var month = formatFromSlider(pos); // Get date from slider position

				if (!rel_b) {
					// Data is absolute
					console.log(currentYear)
					countries.style("fill", (d) => currentYear == "0" ?
					color_scale_tourists(d.properties.total[parseInt(month) - 1]) :
					color_scale_tourists(d.properties.tourists[currentYear][parseInt(month) - 1]));
				} else {
					// Data is relative
					countries.style("fill", (d) => currentYear == "0" ?
					color_scale_tourists_d(d.properties.total_proportion[parseInt(month) - 1]) :
					color_scale_tourists_d(d.properties.tourist_proportion[currentYear][parseInt(month) - 1]));
				}
			}

			//---------- TOOLTIP ----------//
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

			// Function called when hover over a country
			var mouseover = function(d) {
				var num = currentYear == "0" ? d.properties.total[parseInt(formatFromSlider(x.invert(currentValue))) - 1] : d.properties.tourists[currentYear][parseInt(formatFromSlider(x.invert(currentValue))) - 1]
				if (rel_b) {
					num = currentYear == "0" ? d.properties.total_proportion[parseInt(formatFromSlider(x.invert(currentValue))) - 1] : d.properties.tourist_proportion[currentYear][parseInt(formatFromSlider(x.invert(currentValue))) - 1]
				}
				tooltip2
					.style("opacity", 1)
					.style("visibility", "visible")
					.style("display", "block")
					.html(`Tourists in ${d.properties.name}: ` + num)
					.style("left", (d3.mouse(this)[0]) + (d3.select("#map_div").node().getBoundingClientRect()["width"] - d3.select("#map-plot").node().getBoundingClientRect()["width"])/2 + "px")
					.style("top", (d3.mouse(this)[1]) + d3.select("#map_header").node().getBoundingClientRect()["height"]+ "px")
			}
			
			var mousemove = function(d) {
				var num = currentYear == "0" ? d.properties.total[parseInt(formatFromSlider(x.invert(currentValue))) - 1] : d.properties.tourists[currentYear][parseInt(formatFromSlider(x.invert(currentValue))) - 1]
				if (rel_b) {
					num = currentYear == "0" ? d.properties.total_proportion[parseInt(formatFromSlider(x.invert(currentValue))) - 1] : d.properties.tourist_proportion[currentYear][parseInt(formatFromSlider(x.invert(currentValue))) - 1]
				}
				tooltip2
					.style("opacity", 1)
					.html(`Tourists in ${d.properties.name}: ` + num)
					.style("left", (d3.mouse(this)[0]) + (d3.select("#map_div").node().getBoundingClientRect()["width"] - d3.select("#map-plot").node().getBoundingClientRect()["width"])/2 + "px")
					.style("top", (d3.mouse(this)[1]) + d3.select("#map_header").node().getBoundingClientRect()["height"]+ "px")
			}
			
			var mouseout = function(d) {
				tooltip2
					.style("opacity", 0)
					.style("visibility", "hidden");
			}

			d3.select("#map_div").on("mouseleave",mouseout)

			//---------- MAP ----------//
			this.map_container = this.svg.append('g');
			this.label_container = this.svg.append('g');


			// Draw the countries
			var countries = this.map_container.selectAll(".country")
			.data(map_data)
			.enter()
			.append("path")
			.classed("country", true)
			.attr("d", path_generator)
			.style("fill", (d) => {
				// Set initial color based on color_scale_tourists_d
				const month = formatFromSlider(new Date(2024, 0)); // January
				return color_scale_tourists(d.properties.total[parseInt(month) - 1]);
			})
			.on("mouseover", mouseover)
			.on("mousemove", mousemove);
		  

			// Set the country names
			this.label_container.selectAll(".country-label")
				.data(map_data)
				.enter().append("text")
				.classed("country-label", true)
				.attr("transform", (d) => "translate(" + path_generator.centroid(d) + ")")
				.attr("dy", ".35em")
				.text((d) => d.id);

			plot_object.makeColorbar(this.svg, color_scale_tourists, [60,30], [20, this.svg_height - 2*30],".0f");

			//---------- BUTTONS ----------//
			var total_button = d3.select("#total-btn");
			var prop_button = d3.select("#prop-btn")
			var year_selector = d3.select("#year-select")

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

			total_button
			.on("click", function() {
				rel_b = false;
				this.rel_b = false;

				// Update buttons to show total is clicked
				change_color(total_button, !rel_b);
				change_color(prop_button, rel_b);

				d3.select("#map-plot").select("#colorbar").remove();
				d3.select("defs").remove();
				plot_object.makeColorbar(d3.select('#' + svg_element_id), color_scale_tourists, [60, 30], [20, d3.select('#' + svg_element_id).node().viewBox.animVal.height - 2*30],".0f");
				update(x.invert(currentValue))
				});

			prop_button
			.on("click", function() {
				rel_b = true;
				this.rel_b = true;

				// Update buttons to show prop is clicked
				change_color(total_button, !rel_b);
				change_color(prop_button, rel_b);
				d3.select("#map-plot").select("#colorbar").remove();
				d3.select("defs").remove();
				plot_object.makeColorbar(d3.select('#' + svg_element_id), color_scale_tourists_d, [60, 30], [20, d3.select('#' + svg_element_id).node().viewBox.animVal.height - 2*30],".3f");
				update(x.invert(currentValue))
			});

			year_selector
			.on("change", function() {
				var selectedOption = d3.select(this).node().selectedOptions[0].value;
				currentYear = selectedOption
				this.currentYear = selectedOption
				update(x.invert(currentValue))
			});
		});
	}
}

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		action();
	}
}

whenDocumentLoaded(() => {
	plot_object = new MapPlot('map-plot');
});