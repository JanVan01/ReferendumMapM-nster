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
        weight : 4,
        color : 'black',
        fillOpacity : 0.7
    }
    );
    layer.bringToFront();
}

function zoomToFeature(feature){
				map.fitBounds(feature.target.getBounds(onEachFeature));
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
     layer.on(
        {
            mouseover : highlightFeature,
            mouseout : resetHighlight,
            click : zoomToFeature,
        }
    );
    
    function chart(){
      var testdata = [
        {key: "YES", y: feature.properties.yes, color: "green"},
        {key: "NO", y: feature.properties.no, color: "red"},
    ];
        
    nv.addGraph(function() {
        var chart = nv.models.pieChart()
                .x(function(d) { return d.key; })
                .y(function(d) { return d.y; })
                .width(300)
                .height(300)
                .showLegend(false)
                .showTooltipPercent(true);

        d3.select("#test1")
            .datum(testdata)
            .transition().duration(1200)
            .attr('width', 100)
            .attr('height', 100)
            .call(chart);

        return chart;
    });
        
}
        var popupContent = [];
        popupContent.push("<b> District: </b>" + "<b>" + feature.properties.name + "</b>")
        popupContent.push('<svg id="test1" width = 25 height = 25></svg>')
        popupContent.push("<b>Number of voters: </b>" + feature.properties.totalVoters)
        layer.bindPopup("<p>" + popupContent.join("") + "</p>");
    
    layer.on(
        {
            click : chart,
        }
    );

   
}
