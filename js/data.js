var query = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#>\
PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
PREFIX ref: <http://course.geoinfo2016.org/G1/vocabulary/ref#>\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
SELECT DISTINCT\
?name ?total ?yes ?no ?wkt \
WHERE {\
GRAPH <http://course.geoinfo2016.org/G1>{\
?district rdf:type ref:District;\
foaf:name ?name;\
ref:hasTotalVoters ?total;\
ref:hasYesVotes ?yes;\
ref:hasNoVotes ?no;\
geo:hasGeometry ?geo.\
?geo geo:hasSerialization ?wkt.\
}}';

var url = 'http://giv-lodumdata.uni-muenster.de:8282/parliament/sparql'

$(document).ready(function() {
    $.ajax({
        url: url,
        data: {
            'query': query,
            'format': 'json'
        },
        dataType: 'json',
        success: function(data) {
            L.geoJson(sparql2GeoJSON(data), {style : reservesStyle, onEachFeature: onEachFeature}).addTo(map);
        }
    })
});

function sparql2GeoJSON(input) {
    var output = [];
    for (i in input.results.bindings) {
        var entry = input.results.bindings[i];
        var new_entry = {
            type: "Feature",
            geometry: {},
            properties: {}
        };
        new_entry.geometry = $.geo.WKT.parse(entry.wkt.value);
        new_entry.properties.name = entry.name.value;
        new_entry.properties.totalVoters = entry.name.totalVoters;
        new_entry.properties.yes = entry.name.yes;
        new_entry.properties.no = entry.name.no;
        output.push(new_entry);
    }
    return output;
}


function reservesStyle(feature) {
   return {
       fillColor: 'green',
       weight: 0,
       opacity: 1,
       color: 'white',
       fillOpacity: 0.7
   };  
}

function onEachFeature(feature, layer){
    if (feature.properties && feature.properties.name) {
        var popupContent = "This is: " + feature.properties.name;
        layer.bindPopup(popupContent);
    }		
}
