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
            L.geoJson(sparql2GeoJSON(data), {style : reservesStyle, onEachFeature: onEachFeature, highlightFeature: highlightFeature, zoomToFeature: zoomToFeature, resetHighlight: resetHighlight}).addTo(map);
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
        new_entry.properties.totalVoters = entry.total.value;
        new_entry.properties.yes = entry.yes.value;
        new_entry.properties.no = entry.no.value;
        output.push(new_entry);
    }
    return output;
}


function reservesStyle(feature) {
   return {
       fillColor: feature.properties.no > feature.properties.yes ? 'red' : 'green',
       weight: 2,
       opacity: 1,
       color: 'white',
       fillOpacity: 0.7
   };
}

function highlightFeature(feature){
    var layer = feature.target;
    layer.setStyle({
        weight : 2,
        color : 'black',
        fillOpacity : 0.6
    }
    );
    layer.bringToFront();
}

function zoomToFeature(feature){
				map.fitBounds(feature.target.getBounds());
			}

function resetHighlight(feature){
    var resetLayer = feature.target;
    resetLayer.setStyle({
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    }
    );
}

function onEachFeature(feature, layer){
    if (feature.properties) {
        var popupContent = [];
        popupContent.push("<b>District: </b>" + feature.properties.name)
        popupContent.push("<b><br/>Number of voters: </b>" + feature.properties.totalVoters)
        popupContent.push("<b><br/>Yes votes: </b>" + feature.properties.yes)
        popupContent.push("<b><br/>No votes: </b>" + feature.properties.no)
        layer.bindPopup("<p>" + popupContent.join("") + "</p>");
    }

    layer.on(
        {
            mouseover : highlightFeature,
            mouseout : resetHighlight,
            click : zoomToFeature
        }
    );
}
