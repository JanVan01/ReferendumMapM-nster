var query = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#>\
PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
PREFIX ref: <http://course.geoinfo2016.org/G1/vocabulary/ref#>\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
SELECT DISTINCT\
?name ?total ?yes ?no ?invalid ?wkt \
WHERE {\
GRAPH <http://course.geoinfo2016.org/G1>{\
?parent rdf:type ref:District;\
ref:hasSubDistrict ?district.\
?district rdf:type ref:District;\
foaf:name ?name;\
ref:hasTotalVoters ?total;\
ref:hasYesVotes ?yes;\
ref:hasNoVotes ?no;\
ref:hasInvalidVotes ?invalid;\
ref:hasSubDistrict ?child;\
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
            L.geoJson(sparql2GeoJSON(data), {
                style: getStyle,
                onEachFeature: onEachFeature
            }).addTo(map);
        }
    })
});

function sparql2GeoJSON(input) {
    var output = [];
    for (i in input.results.bindings) {
        var entry = input.results.bindings[i];
        var feature = {
            type: "Feature",
            geometry: {},
            properties: {}
        };
        feature.geometry = $.geo.WKT.parse(entry.wkt.value);
        feature.properties.name = entry.name.value;
        feature.properties.totalVoters = parseInt(entry.total.value);
        feature.properties.yes = parseInt(entry.yes.value);
        feature.properties.no = parseInt(entry.no.value);
        feature.properties.invalid = parseInt(entry.invalid.value);
        output.push(feature);
    }
    return output;
}



function getStyle(feature) {
    return {
        fillColor: getFillColor(feature),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: getOpacity(feature)
    };
}

function getFillColor(feature) {
    return feature.properties.no > feature.properties.yes ? 'red' : 'green';
}

function getOpacity(feature) {
    return (feature.properties.no + feature.properties.yes + feature.properties.invalid) * 3 / feature.properties.totalVoters;
}

function zoomToFeature(feature) {
    map.fitBounds(feature.target.getBounds());
}

function onEachFeature(feature, layer) {
    var popupContent = [];
    popupContent.push("<b>District: </b>" + feature.properties.name)
    popupContent.push('<svg class="participation_chart" width=100 height =100></svg>')
    popupContent.push("<b><br/>Number of voters: </b>" + feature.properties.totalVoters)
    popupContent.push("<b><br/>Yes votes: </b>" + feature.properties.yes)
    popupContent.push("<b><br/>No votes: </b>" + feature.properties.no)
    popupContent.push("<b><br/>Invalid votes: </b>" + feature.properties.invalid)
    layer.bindPopup("<p>" + popupContent.join("") + "</p>");

    function chart() {
        var data = [{
                key: "Yes",
                value: feature.properties.yes,
                color: "green"
            },
            {
                key: "No",
                value: feature.properties.no,
                color: "red"
            },
            {
                key: "Invalid",
                value: feature.properties.invalid,
                color: "grey"
            }
        ];

        nv.addGraph(function() {
            var chart = nv.models.pieChart()
                .x(function(d) {return d.key;})
                .y(function(d) {return d.value;})
                .showLegend(true)
                .showTooltipPercent(true);

            d3.select(".participation_chart")
                .datum(data)
                .transition().duration(1200)
                .call(chart);

            return chart;
        });

    }
    layer.on({
        click: chart,
    });
}
