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

## Milestone 2 (26th April, 5pm)

**10% of the final grade**


## Milestone 3 (31st May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

