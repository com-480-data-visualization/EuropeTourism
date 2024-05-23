class StarPlot {
	constructor(svg_element_id) {


		let data = [];
		let features = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let months_indexed = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5:"May", 6:"Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"};

		const avgs_processed = {};

		let width = 600;
		let height = 600;

		let radialScale = d3.scaleLinear()
			.domain([0, 20000000])
			.range([0, 250]);

		function angleToCoordinate(angle, value){
			let x = Math.cos(angle) * radialScale(value);
			let y = Math.sin(angle) * radialScale(value);
			return {"x": width / 2 + x, "y": height / 2 - y};
		}

		function star_graph_set_up() {
			// set up general radial circle
			let svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height);

			let ticks = [4000000, 8000000, 12000000, 16000000, 20000000];
			svg.selectAll("circle")
				.data(ticks)
				.join(
					enter => enter.append("circle")
						.attr("cx", width / 2)
						.attr("cy", height / 2)
						.attr("fill", "none")
						.attr("stroke", "gray")
						.attr("r", d => radialScale(d))
				);
			svg.selectAll(".ticklabel")
			.data(ticks)
			.join(
				enter => enter.append("text")
					.attr("class", "ticklabel")
					.attr("x", width / 2 + 5)
					.attr("y", d => height / 2 - radialScale(d))
					.text(d => d.toString())
			);
			let featureData = features.map((f, i) => {
				let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
				return {
					"name": f,
					"angle": angle,
					"line_coord": angleToCoordinate(angle, 20000000),
					"label_coord": angleToCoordinate(angle, 21500000)
				};
			});
			
			// draw axis line
			svg.selectAll("line")
				.data(featureData)
				.join(
					enter => enter.append("line")
						.attr("x1", width / 2)
						.attr("y1", height / 2)
						.attr("x2", d => d.line_coord.x)
						.attr("y2", d => d.line_coord.y)
						.attr("stroke","black")
				);
			
			// draw axis label
			svg.selectAll(".axislabel")
				.data(featureData)
				.join(
					enter => enter.append("text")
						.attr("x", d => d.label_coord.x)
						.attr("y", d => d.label_coord.y)
						.text(d => d.name)
				);
			return svg;
		}


		function process_avgs_by_country(d) {
			// map country code and each month of the year to its corresponding avg # of passengers
			// structure -> map<country_code, map<month, avg_passengers>>
			// example -> map<"ESP", map<"Jan", 123456789>>
			d.forEach(measure => {
				const { country, month, passengers } = measure;
				
				if (!avgs_processed[country]) {
					avgs_processed[country] = {};
				}
				avgs_processed[country][months_indexed[parseInt(month)]] = parseInt(passengers);
				}
			);
			let svg = star_graph_set_up()
			
			update_country_displayed(svg, "GBR");
		}

		function update_country_displayed(svg, ctry_code) {
			let colors = ["darkorange", "gray", "navy"];
			let line = d3.line()
			.x(d => d.x)
			.y(d => d.y);
			function getPathCoordinates(data_point){
				let coordinates = [];
				for (var i = 0; i < features.length; i++){
					let ft_name = features[i];
					let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
					coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
				}
				return coordinates;
			}
			data.push(avgs_processed[ctry_code]);
			svg.selectAll("path")
			.data(data)
			.join(
				enter => enter.append("path")
					.datum(d => getPathCoordinates(d))
					.attr("d", line)
					.attr("stroke-width", 3)
					.attr("stroke", (_, i) => colors[i])
					.attr("fill", (_, i) => colors[i])
					.attr("stroke-opacity", 1)
					.attr("opacity", 0.5)
			);
		}

		d3.json("./Data/europe_passengers/avg_by_year.json")
		.then(function(load_data) {
			process_avgs_by_country(load_data)
		});
    }
}

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
        console.log("test")
		action();
	}
}

whenDocumentLoaded(() => {
	plot_object = new StarPlot('star-plot');
});