# GI in Society
This course is based on using linked open data to make location based web/mobile applications. Another very important aspect of this course is that the applications should be 
regarding such topics that hold some benefits for the society.

## Our Project
**ReferendumMapMünster**: Designing a web interface that displays the results of the referendum of Münster using linked open data.

### Introduction
This project is based on a framework that displays the results of the referendum of Münster. This referendum took place in Münster on November 6th in 2016 in order to decide
on the question: if shops should NOT be opened on two additional sundays, before Christmas. As a result this web interface shows the number of 'yes' votes and the number of 'no'
votes. Just to make it clear, the 'yes' votes means shops should remain closed during those events while the 'no' votes mean shops should open on these two special Sundays.
The areas displayed in Green color denote that majority of the people in that area voted in favor of shops remaining closed and vice versa in case of areas being displayed in Red color.
There are three different layer which represent different district levels of Münster. 
Furthermore, when it is clicked on one of the districts, a window is diplayed showing  basic information about the distric. Additionally, the votes  results data, summarized in a pie chart by which the user is able to choose the information to be shown (yes, no and invalidate votes).

### Installation
The code here can be simply downloaded using the following command
```
git clone https://github.com/JanVan01/ReferendumMapMuenster.git
```

If you want to have a look at the results locally you just have to change into the newly created directory and use your browser to open the files `index.html` and `ReferendumVocabulary.html` for the map and the vocabulary documentation respectively.

To host the project on the web just move the directory's content to a location the root folder of your web server.

### Known issues and limitations
* The dataset for this level of detail of the visualization does not contain any information about letter votes. 
  As a result the shown participation numbers are only based on the number of people who voted in person. 
  Thus, the participation numbers appear to be lower compared to the other two layers where the letter votes are included.
  
### License
MIT License


