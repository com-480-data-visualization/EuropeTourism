# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Iniya Murugasamy | 385087 |
| Noah Nefsky | 384932 |
| Daniel Puhringer| 384890 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (29th March, 5pm)

**10% of the final grade**

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
> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

**Previous usage of the data**
Given the fact the related dataset was initially put together by a reliable source and contains many thousand datapoints across many different European countries, there are many possibilities for organizations to use this dataset.

Some examples of a previous usage of this dataset includes **policy-making, scientific research or business relevant insights**.

**Useage by governments for policy-making**: European airports are often an important cornerstone for infrastructure. In order to be able to pass suitable laws and plan infrastructure, this dataset might have been used by policy makers.
Since the European Union is heavily involved in the planning of infrastructure due to the EU's Green New Deal, a change in annual passengers can be used to make decisions about changes in infrastrucutre. An exmple for this would be the Airport of Vienna, where the debate about a third runway involved lawmakers on different levels, [Link](https://www.viennaairport.com/en/company/flughafen_wien_ag/3rd_runway).
But also cities or other communities can use such a dataset to forecast expected passengers which is important for 
planning construction works during times with fewer passangers.

**Usage for research**
This dataset can also be used in a scientific context to provide reasons for certain observations mainly related to the movement/mobility of people on a larger scale.
As an example studies focused on national CO2 emissions heavily rely on flight data since this is a very large CO2 
emitting sector but also might provide reasons why e.g. the pollution of rivers or CO2 emissions from cars changed drastically in certain regions which heavily rely on tourism.
In additon, this dataset could have also been used to provide insights during the Corona pandemic since it could have been used as a good proxy how certain variants of the coronavirus might spread globally.

**Business relevant insights**
Last but not least, the toursim industry is always keen on insights about which destinations might be relevant in the future or changes in the travelling behavior of potential guests.
Hence this dataset could also be used to optimize cruise routes, finding suitable hotel locations, provide tourist-planning agencies with suitable offers or generally help companies in the tourist industry to identify promising locations.

**Existing projects on similar data**
There are several examples which are also focused on visualizing similar data.
1. NATS traffic data visualization, [Link](https://nats.aero/blog/2014/03/europe-24-air-traffic-data-visualisation/): This source provides a video which mainly focusses on the connections inbetween airports within Europe.
2. HEAVY.AI, [Link](https://www.heavy.ai/demos/flights):
This project demonstrates a dashboard for flight data within the USA.
3. Eurocontrol, [Link](https://www.eurocontrol.int/our-data):
Eurocontrol provides flight data within Europe, but does this only with the help of bar charts.
4. Flightradar24, [Link](https://www.flightradar24.com/51.50,-0.12/6)
Flightradar24 provides real time data for the location of planes all around the world.

**Originality of our approach**
Our approach provides a certain amount of novelty since we focus on an interactive data presentation. The examples listed above either focus on professional users (such as HEAVY.AI), don't provide a suitable data representation (such as Flightradar24) for tourists or simply don't provide any interaction at all.

Therefore we see our approach as original since we do not only focus on interactive flight data, but also design for travellers.

**Sources of inspiration**
Since our group consists of passionate travellers, we have already experienced situations where a visualization like ours would have come handy. After researching some time on possible solutions (such as Flightradar24) we realized that among all existing solutions there is still a niche for travellers looking for insights for potential travel destinations.

## Milestone 2 (26th April, 5pm)

**10% of the final grade**


## Milestone 3 (31st May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

