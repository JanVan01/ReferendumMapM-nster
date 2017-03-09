# GI in Society
This project was part of an university course called "GI in Society" at the Institute for Geoinformatics at the university of Münster. The courses aim was to create a interactive visualization of an issue relevant to society to provide a better understanding. The data used for the visualization was to be made transformed to Linked Open Data be fore being displayed.

## ReferendumMapMünster
Our Projects aim was to design a web interface to displays the results of the referendum that took place in Münster on the 6th of November 2016. The referendum was held to decide on the question whether the shops in the city center of Münster should be opened on two additional Sundays. In Germany shops are generally closed on Sundays and only on special occasions exceptions are made.  
The web interface shows the number of 'yes' votes and the number of 'no' votes. The way the question was worded the 'yes' votes mean shops should remain closed during those events while the 'no' votes mean shops should open on these two special Sundays.  
The areas displayed in green color denote that majority of the people in that area voted in favor of shops remaining closed and vice versa in case of areas being displayed in red color.  
There are three different layers which represent different district levels of Münster.
Furthermore, when one of the districts is clicked, a popup showing more detailed information about the district is opened. Additionally, the results are visualized in a pie chart.

### Installation
The code here can be downloaded using the following command
```
git clone https://github.com/JanVan01/ReferendumMapMuenster.git
```

If you want to have a look at the results locally you have to change into the newly created directory and use your browser to open the files `index.html` and `ReferendumVocabulary.html` for the map and the vocabulary documentation respectively.

To host the project on the web move the directory's content to a location the root folder of your web server.

### Known issues and limitations
* For the fines level of detail of the visualization the dataset does not contain any information about letter votes.
  As a result the shown participation numbers are only based on the number of people who voted in person.
  Thus, the participation numbers appear to be lower compared to the other two layers where the letter votes are included.

### License
MIT License
