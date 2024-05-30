class StarPlot {
	constructor(svg_element_id) {
		this.data = [];
		this.features = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		this.months_indexed = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5:"May", 6:"Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"};
		this.avgs_processed = {};
		this.radius = 150;
		this.width = 350;
		this.height = 350;
		this.radialScale = d3.scaleLinear()
			.domain([0, 20000000])
			.range([0, this.radius]);
		this.svg = this.star_graph_set_up();
		this.countryMap = new Map([
            ["AUT", "Austria"],
            ["BEL", "Belgium"],
            ["BGR", "Bulgaria"],
            ["CHE", "Switzerland"],
            ["CYP", "Cyprus"],
            ["CZE", "Czech Republic"],
            ["DEU", "Germany"],
            ["DNK", "Denmark"],
            ["ESP", "Spain"],
            ["EST", "Estonia"],
            ["FIN", "Finland"],
            ["FRA", "France"],
            ["GBR", "United Kingdom"],
            ["GRC", "Greece"],
            ["HRV", "Croatia"],
            ["HUN", "Hungary"],
            ["IRL", "Ireland"],
            ["ISL", "Iceland"],
            ["ITA", "Italy"],
            ["LTU", "Lithuania"],
            ["LUX", "Luxembourg"],
            ["LVA", "Latvia"],
            ["MKD", "North Macedonia"],
            ["MLT", "Malta"],
            ["MNE", "Montenegro"],
            ["NLD", "Netherlands"],
            ["NOR", "Norway"],
            ["POL", "Poland"],
            ["PRT", "Portugal"],
            ["ROU", "Romania"],
            ["SRB", "Serbia"],
            ["SVK", "Slovakia"],
            ["SVN", "Slovenia"],
            ["SWE", "Sweden"],
            ["TUR", "Turkey"]
        ]);

		d3.json("./Data/europe_passengers/avg_by_year.json")
			.then(load_data => this.process_avgs_by_country(load_data));
	}

	angleToCoordinate(angle, value){
		let x = Math.cos(angle) * this.radialScale(value);
		let y = Math.sin(angle) * this.radialScale(value);
		return {"x": this.width / 2 + x, "y": this.height / 2 - y};
	}

	star_graph_set_up() {
		// set up general radial circle
		let svg = d3.select("#parent-star-plot").append("svg")
			.attr("width", this.width)
			.attr("height", this.height);

		let ticks = [4000000, 8000000, 12000000, 16000000, 20000000];
		svg.selectAll("circle")
			.data(ticks)
			.join(
				enter => enter.append("circle")
					.attr("cx", this.width / 2)
					.attr("cy", this.height / 2)
					.attr("fill", "none")
					.attr("stroke", "gray")
					.attr("r", d => this.radialScale(d))
			);
		svg.selectAll(".ticklabel")
			.data(ticks)
			.join(
				enter => enter.append("text")
					.attr("class", "ticklabel")
					.attr("x", this.width / 2 + 5)
					.attr("y", d => this.height / 2 - this.radialScale(d))
					.text(d => d.toString())
			);
		let featureData = this.features.map((f, i) => {
			let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
			return {
				"name": f,
				"angle": angle,
				"line_coord": this.angleToCoordinate(angle, 20000000),
				"label_coord": this.angleToCoordinate(angle, 21500000)
			};
		});

		// draw axis line
		svg.selectAll("line")
			.data(featureData)
			.join(
				enter => enter.append("line")
					.attr("x1", this.width / 2)
					.attr("y1", this.height / 2)
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

	process_avgs_by_country(d) {
		// map country code and each month of the year to its corresponding avg # of passengers
		// structure -> map<country_code, map<month, avg_passengers>>
		// example -> map<"ESP", map<"Jan", 123456789>>
		d.forEach(measure => {
			const { country, month, passengers } = measure;

			if (!this.avgs_processed[country]) {
				this.avgs_processed[country] = {};
			}
			this.avgs_processed[country][this.months_indexed[parseInt(month)]] = parseInt(passengers);
		});

		// Update display for the default country (e.g., GBR)
		// this.update_country_displayed("GBR");
	}

	update_country_displayed(ctry_code) {
		let colors = ["green", "gray", "navy"];
		let line = d3.line()
			.x(d => d.x)
			.y(d => d.y);
		const getPathCoordinates = (data_point) => {
			let coordinates = [];
			for (let i = 0; i < this.features.length; i++){
				let ft_name = this.features[i];
				let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
				coordinates.push(this.angleToCoordinate(angle, data_point[ft_name]));
			}
			return coordinates;
		};

		// updates the data to be displayed on the star plot
		this.data = [this.avgs_processed[ctry_code]];

		// clears the old star plot from the screen
		// creates a new star plot with updated country data
		this.svg.remove();
		this.svg = this.star_graph_set_up();
		this.svg.selectAll("path")
			.data(this.data)
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
	// Method to get the country name by its code
	getCountryName(countryCode) {
		return this.countryMap.get(countryCode);
	}
}

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		action();
	}
}

let starPlot;

whenDocumentLoaded(() => {
	starPlot = new StarPlot('star-plot');

	const countries = document.querySelectorAll('.js-country');
	countries.forEach(country => {
		country.addEventListener('click', (element)=> {
			// Log the clicked country's id

			console.log("The country "+country.id+" was clicked");
			console.log(typeof(country.id))
			test=""+country.id
			console.log(typeof(test))
			console.log(document.getElementById(country.id).classList)

			// Call the foo method of starPlot
			starPlot.update_country_displayed(country.id);

			// Update the display of the Selected Country
			document.getElementById("current-selected-country").textContent=starPlot.getCountryName(country.id);


			// Remove the 'selected-country' class from the previously selected country
			console.log("currentcountry:")
			console.log()
			//console.log(currentCountry)
			if(!(typeof currentCountry === 'undefined')){
			//if(currentCountry){
				document.getElementById(currentCountry).classList.remove('js-selected-country');
			}


			// Update the currentCountry variable
			currentCountry = country.id;
			console.log("currentcountry:"+currentCountry)

			console.log(document.getElementById(currentCountry))
			// Add the 'selected-country' class to the clicked country
			var selectedCountry = document.getElementById(currentCountry);
			console.log(selectedCountry.classList)
			selectedCountry.classList.add('js-selected-country');
			console.log(selectedCountry.classList)
		});
	});
});