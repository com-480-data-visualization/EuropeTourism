# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Iniya Murugasamy | 385087 |
| Noah Nefsky | 384932 |
| Daniel Puhringer| 384890 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3-31st-may-5pm)

## Milestone 1

**10% of the final grade - 29th March, 5pm**

### Dataset

Europe Commercial Air Flights and Passengers, [Link](https://www.kaggle.com/datasets/br33sa/europe-commercial-air-flights-and-passengers/data?select=Passengers_Month.csv)

The dataset we will explore is about Europe Commercial Air Flights and Passengers from 1993-2022. Specifically, we will be looking at the passengers per month that flew to each country. Each data point contains metadata for the country, if it was national, international or total, the month, the year and number of passengers in the month. We have acquired the data from Kaggle though it was initially created by Eurostat, the statistical office of the European Union.

Given the dataset was initially put together by Eurostat, it is a reliable source. The specific dataset on Kaggle modified the original one to only show the number of passengers per month, whereas the one from Eurostat has uncleaned data about the passengers and flights per year, month and quarter. The process the Kaggle author took to clean the dataset and form the one we are using is posted on Kaggle. It is very standard and matches the initial Eurostat data, so the dataset is dependable.

The dataset has some points where the passengers total is missing, though there are still over twenty-thousand usable points. The years that have the most usable points are 2005-2021, so we will remove the 1993-2004 and 2022 years from the dataset. Additionally, we will also filter for the points in which flights come from international origin, as we want to focus on tourist based travel and overall non-local population in a country per month. After filtering the data to the years 2005-2021 and international origin, our dataset will still consist of over 6000 points. This will allow us to make meaningful visualizations based on reliable data.

### Problematic

The tourism industry in Europe generates a lot of income for many different countries. Europe receives hundreds of millions of tourists each year which oftentimes leads to crowding, especially near tourist attractions. Some people do not mind the clutter, yet many tourists struggle to find the right time to visit a country in Europe when it is least touristy. Some people feel the experiences are diluted when countries are overrun with tourists and that it takes away the authentic feeling of visiting a new country.

We aim to find when each country’s tourism is in its peak season and has a high population of tourists and when it is in its low seasons where less tourists are present. Our visualizations will express this by showing the concentrations of passengers who fly international to each European country throughout each month of the year. We address the following three questions:
1. How busy is each country each month or the year with visitors from other countries?
2. When are the peak and low seasons for tourism in each European country?
3. How does the number of passengers entering each country change throughout the year?

Our target audience is travelers seeking more information about countries they wish to travel to. Hopefully, these visualizations and our discoveries will help them choose the best destinations and times based on their interests. Either they trust the crowd and want to follow the touristy trends or they wish to go at a time when a country is in its most authentic state. Overall, by visualizing the flow of passengers into a country each month, we will be able to better deduce peak season in contrast to low season and uncover useful information for tourists to help them make decisions based on their preferences.


### Exploratory Data Analysis

The raw data of the monthly air passengers per country contains: 35 unique countries, 3 different coverages (national, international, total), years (1993-2022), months (M01-M12), and total number of passengers on board. The dataset has some points where the passengers total is missing, though there are still over twenty-thousand usable points after we remove the NaN values. The years that have the most usable points are 2005-2021, so we will remove the 1993-2004 and 2022 years from the dataset. Additionally, we will filter for the points in which flights come from international origin, as we want to focus on tourist based travel and overall non-local population in a country per month. After filtering the data to the years 2005-2021 and international origin, our dataset will still consist of over 6000 points. This will allow us to make meaningful visualizations based on reliable data.

The following displays the unprocessed data, the processed data, and finally the average of the passengers per month of each country for all the years of data available. It orders the passengers per month so you can see which country and month combinations are the most popular and the least popular.

<img width="325" alt="unprocessed" src="https://github.com/iniyam/com-480-EuropeTourism/assets/62399852/b6cd6a02-df45-4a5d-b8d2-5460929fe1f4"><img width="325" alt="procesessed" src="https://github.com/iniyam/com-480-EuropeTourism/assets/62399852/fca9f763-b4b3-46bd-a92c-0f2941a6a4b9"><img width="175" alt="avg" src="https://github.com/iniyam/com-480-EuropeTourism/assets/62399852/42282c46-d975-4db9-b424-b65878d02d3a">


The following plots the averages across the years of the number of passengers in each country per month into a visualization. You can see from the graph that July & August (months 7 & 8) tend to have the most passengers flying in compared to other months regardless of country. And, you can see by country GBR, DEU, ESP have the highest amounts of passengers respectively and FRA, ITA, TUR are the next closest as well.

<img width="400" alt="1" src="https://github.com/iniyam/com-480-EuropeTourism/assets/62399852/810b06e1-c207-4ef8-ae2c-88cd108f6082">


<img width="400" alt="graph" src="https://github.com/iniyam/com-480-EuropeTourism/assets/62399852/7464b26c-e68c-4153-8259-be07d831b3fc">


### Related work

The following section should provide the reasoning behind our idea, what makes it special and what others have already done with (similar) data.

**Sources of inspiration**<br/>
Since our group consists of passionate travellers, we have already experienced situations where a visualization like ours would have been useful. After researching some time on possible solutions (such as Flightradar24, see below), we realized that among all existing visualizations there is still a niche for travellers looking for insights for potential travel destinations.

**Originality of our approach**<br/>
What makes our approach stand out from the crowd is our focus on an interactive data presentation for travellers. The examples listed underneath either focus on professional users (such as HEAVY.AI), don't provide a suitable data representation (such as Flightradar24) for tourists or simply don't provide any interaction at all.

In short, we see our approach as original since we do not only focus on interactive flight data, but also design for travellers.

**Previous usage of the data**<br/>
Given the fact that the related dataset was initially put together by a reliable source and contains many thousand datapoints across many different European countries, there are many possibilities for organizations to use this dataset.

Some examples of a previous usage of this dataset includes **policy-making, scientific research or business relevant insights**.

**Usage by governments for policy-making**: European airports are often an important cornerstone for infrastructure. In order to be able to pass suitable laws and plan infrastructure, this dataset might have been used by policy makers.
Since the European Union is heavily involved in the planning of infrastructure due to the EU's Green New Deal, a change in annual passengers can be used to make decisions about changes in infrastrucutre. An exmple for this would be the Airport of Vienna, where the debate about a third runway involved lawmakers on different levels, [Link](https://www.viennaairport.com/en/company/flughafen_wien_ag/3rd_runway).
But also cities or other communities can use such a dataset to forecast expected passengers which is important for 
planning construction works during times with fewer passangers.

**Usage for research**: This dataset could also be used in a scientific context to provide reasons for certain observations mainly related to the movement/mobility of people on a larger scale.
As an example studies focused on national CO2 emissions heavily rely on flight data (since this is a very large CO2 
emitting sector), but also might provide reasons why e.g. the pollution of rivers or CO2 emissions from cars changed drastically in certain touristic regions.
In additon, this dataset could have also been used to provide insights during the Corona pandemic since it could have been used as a good proxy how certain variants of the Corona Virus might spread globally.

**Business relevant insights**: The toursim industry is always keen on insights about which destinations might be relevant in the future or changes in the travelling behavior of potential guests.
Hence this dataset could also be used to optimize cruise routes, finding suitable hotel locations, provide tourist-planning agencies with suitable offers or generally help companies in the tourist industry to identify promising locations.

**Existing projects on similar data**<br/>
There are several examples which are also focused on visualizing similar data.
1. NATS traffic data visualization, [Link](https://nats.aero/blog/2014/03/europe-24-air-traffic-data-visualisation/): This source provides a video which mainly focusses on the connections inbetween airports within Europe.
2. HEAVY.AI, [Link](https://www.heavy.ai/demos/flights):
This project demonstrates a dashboard for flight data within the USA.
3. Eurocontrol, [Link](https://www.eurocontrol.int/our-data):
Eurocontrol provides flight data within Europe, but does this only with the help of bar charts.
4. Flightradar24, [Link](https://www.flightradar24.com/51.50,-0.12/6):
Flightradar24 provides real time data for the location of planes all around the world.

## Milestone 2

**10% of the final grade - 26th April, 5pm**

### Visualization 1:

This visualization allows the user to see how busy a country is with tourists in each given month and how it changes throughout the years. Users can explore the data through an interactive map and slider. 

**Key features include:**
1. _Map Representation_: A map of Europe displaying countries colored according to tourist "busyness," with darker red indicating /”hotter” tourist activity and lighter red indicating lower/”less hot” activity.
2. _Interactive Slider_: Users can select a specific month to observe changes in tourist activity throughout the year.
3. _Year Selection_: Users can choose between viewing the average tourist activity from 2005 to 2020 or select a specific year within that range.
4. _Hover Information_: Hovering over a country reveals the total number of international passengers arriving in that country for the selected month.

This visualization aids users in easily identifying the busiest tourist destinations in Europe for any given month, easily seen by the “hot” and “less hot” regions.

**Enhancement:**
1. _Scale Options_: Users can choose between viewing absolute numbers of international passengers or relative percentages
2. _Time Animation_: A pause/play button allows users to activate or deactivate a time-progressing animation

**Implementation:**
First, we will draw the map of Europe, then link the data for each country, then implement the slider and then the year selection. Finally, we will try to introduce the enhancements.

**Tools:**
D3.js maps with TopoJSON and lectures Maps and Practical maps, as well as exercise 8.

<img width="434" alt="image" src="https://github.com/com-480-data-visualization/EuropeTourism/assets/62399852/1182b9fb-c564-42c9-889b-5c20fdce4be1">



### Visualization 2

This visualization allows the user to select a country and look at the distribution of international passengers flying into that country over all 12 months of the year through a star graph. The design of the star graph allows for users to compare popular vs uncrowded months, as well as visualize the changes over each of the 4 seasons in a year.

**Key features include:**
1. _Interactive map_: Users are able to select the country they desire. As soon as a country is selected, it is highlighted in green to display the geographic region relevant to the respective star plot.
2. _Star Plot_: The appropriate data (i.e. average number of flights across the years 2005-2021 of the number of passengers in each country per month) is shown as a star graph with 12 partitions, one for each month of the year.
3. _Hover Information_: Hovering over a particular data point in the star graph reveals the total number of international passengers arriving in that month for the currently selected country.

**Enhancement:**
1. 
2. 

**Implementation:**


**Tools:**

<img width="415" alt="image" src="https://github.com/com-480-data-visualization/EuropeTourism/assets/62399852/3c9dfb8e-4553-4edf-a241-f11679931f73">


## Milestone 3 (31st May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

