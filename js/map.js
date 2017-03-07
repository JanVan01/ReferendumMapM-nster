// initialize the map centered on Münster, restricting the zoom levels to a sensible range
var map = L.map('map', {
    center: [51.959312, 7.617267],
    zoom: 12,
    minZoom: 11,
    zoomControl: true
});

// set bounds of the map so the user can only see the area around Münster
map.setMaxBounds([
    [51.7475880511, 7.3663330078],
    [52.2254460954, 7.8524780273]
]);

// add openstreetmap baselayer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add sidebar for the content to the map
L.control.sidebar('sidebar').addTo(map);

// add a welcoming screen that is shown when the user first loads the map explaining the content
L.control.window(map, {
        title: 'Welcome to the Referendum Map Münster',
        maxWidth: 400,
        modal: true
    })
    .content('</br><p>Here you will be provided with infomation regarding the recent referendum that took place in Münster on November 6th in 2016. The question of the referendum was if shops should NOT be opened on two additional sundays. For more information go to the Help-Section. For the results just click on the district that you want to know the Yes, No and Invalid votes.</p>')
    .prompt({
        callback: function() {}
    })
    .show();

// create a legend
var legend = L.control({
    position: 'bottomright'
});

// define the legends items
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<strong><center>Legend</center></strong>';
    div.innerHTML += '<div class="legend_entry"><i style="background:green"></i> yes </div>'
    div.innerHTML += '<div class="legend_entry"><i style="background:red"></i> no </div>'
    div.innerHTML += '<div class="legend_entry"><i class="gradient"></i> participation </div>'
    return div;
};

// add the legend to the map
legend.addTo(map);

// move the zoom controls to the bottom right on top of the legend
map.zoomControl.setPosition('bottomright');

// add a layer control that allows switching between the different granularities
var layerControl = L.control.layers().addTo(map);

// is called when the user switches to a different layer
map.on('baselayerchange', function() {
    // brings the affected area to the front
    overlay.bringToFront();
    // shows warning if the chosen layer is the Stimmbezirke layer
    if (layer.name == 'Stimmbezirke') {
        alert('The dataset for this level of detail of the visualization does not contain any information about letter votes. As a result the shown participation numbers are only based on the number of people who voted in person. Thus the participation numbers apear to be lower compared to the other two layers where the letter votes are included.');
    }
});

// return the style a feature is displayed in based on its attributes.
//color and opacity are changes dependent on what the majority voted and the participation
function getStyle(feature) {
    return {
        fillColor: getFillColor(feature),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: getOpacity(feature)
    };
}

// return fill color based on the majorities votes
function getFillColor(feature) {
    if (feature.properties.no > feature.properties.yes) {
        return 'red'
    } else {
        return 'green'
    }
}

// return opacity based on the percentage of partizipation in that voting district
function getOpacity(feature) {
    return (feature.properties.no + feature.properties.yes +
        feature.properties.invalid) * 3 / feature.properties.totalVoters;
}

// adds a popup with the general information and a chart showing the voting results to each feature
function onEachFeature(feature, layer) {
    var popupContent = [];
    popupContent.push("<b>District: </b>" + feature.properties.name)
    popupContent.push('<div class="chart_area"><svg class="participation_chart"></svg></div>')
    popupContent.push("<b><br/>Number of voters: </b>" + feature.properties.totalVoters)
    popupContent.push("<b><br/>Yes votes: </b>" + feature.properties.yes)
    popupContent.push("<b><br/>No votes: </b>" + feature.properties.no)
    popupContent.push("<b><br/>Invalid votes: </b>" + feature.properties.invalid)
    popupContent.push("<b><br/>Participation: </b>" + ((feature.properties.no + feature.properties.yes + feature.properties.invalid) * 100 / feature.properties.totalVoters).toFixed(2) + "%")
    if (feature.properties.unemployed) {
        popupContent.push("<b><br/><br/>Percentage of inhabitants in the age from 15 - 64 that are unemployed:</b></br>" +
            feature.properties.unemployed + '%')
    }
    if (feature.properties.description) {
        popupContent.push("<br/><br/><b>Description</b><br/>")
        popupContent.push('<div style="text-align: justify">' + feature.properties.description + '</div>')
    }
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
                .x(function(d) {
                    return d.key;
                })
                .y(function(d) {
                    return d.value;
                })
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

// creates a styled layer from a geoJson input
function geoJsonToLayer(geoJson) {
    var layer = L.geoJson(geoJson, {
        style: getStyle,
        onEachFeature: onEachFeature
    });

    return layer;
}

// loads the layers once the page is loaded completely
$(document).ready(function() {
    loadLayer('Stadtteile', function(geoJson) {
        layerControl.addBaseLayer(geoJsonToLayer(geoJson), 'Stadtteile');
    });
    loadLayer('Kommunalwahlbezirke', function(geoJson) {
        var layer = geoJsonToLayer(geoJson);
        layer.addTo(map);
        layerControl.addBaseLayer(layer, 'Kommunalwahlbezirke');
    });
    loadLayer('Stimmbezirke', function(geoJson) {
        layerControl.addBaseLayer(geoJsonToLayer(geoJson), 'Stimmbezirke');
    });
    loadAffectedArea(function(affectedArea) {
        overlay = L.geoJson(affectedArea, {
            style: {
                weight: 2,
                fillOpacity: 0.5,
                fillColor: 'transparent',
                color: 'yellow',
                weight: 5
            }
        });
        layerControl.addOverlay(overlay, 'Affected Area');
    })
});
