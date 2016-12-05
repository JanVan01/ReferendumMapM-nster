var query = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#>\
PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
PREFIX gn: <http://www.geonames.org/ontology#>\
SELECT DISTINCT\
?name ?pop ?wkt \
WHERE {\
GRAPH <http://course.geoinfo2016.org/G1>{\
?district foaf:name ?name;\
gn:population ?pop;\
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
            L.geoJson(sparql2GeoJSON(data)).addTo(map);
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
        new_entry.properties.population = entry.pop.value;
        output.push(new_entry);
    }
    return output;
}
