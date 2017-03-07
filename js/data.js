var baseUrl = 'http://giv-oct.uni-muenster.de:8080/api/dataset/ref_ms';
var layerEndpoints = {
    Stadtteile: '_level1_1',
    Kommunalwahlbezirke: '_level2_1',
    Stimmbezirke: '_level3_1'
}
var authentication = '?authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfbmFtZSI6IlJlZmVyZW5kdW0gTWFwIE3DvG5zdGVyIiwiaWF0IjoxNDg0NTc5NTUzfQ.AP0vY49C9NNtHEo6ZuDpqLgv6ATeWbIcPSJKc8-lljI'

// loads the affectedArea and calls the callback with a geojson representation of it
function loadAffectedArea(callback) {
    var url = baseUrl + '_general' + authentication;
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
            callback($.geo.WKT.parse(data[0].affectedArea.value))
        }
    })
}

// build the url to retrieve the given layer
function buildUrl(layerName) {
    return baseUrl + layerEndpoints[layerName] + authentication
}

// loads a layer and calls the callback with a geojson representation of it
function loadLayer(layerName, callback) {
    $.ajax({
        url: buildUrl(layerName),
        dataType: 'json',
        success: function(data) {
            callback(sparql2GeoJSON(data))
        }
    })
}

// converts the sparql json response to valid geojson that can be inseted into leaflet
// returns a list of geojson features
function sparql2GeoJSON(input) {
    var output = [];
    for (i in input) {
        var entry = input[i];
        var feature = {
            type: "Feature",
            geometry: {},
            properties: {}
        };
        // add the geometry, converted from WKT
        feature.geometry = $.geo.WKT.parse(entry.wkt.value);
        // the parser does not pars features that have holes in them correctly
        if (feature.geometry.coordinates.length == 0) {
            // convert these features using our own function
            feature.geometry = manuallyGetGeometry(entry.wkt.value)
        }
        // other properties of the features
        feature.properties.name = entry.name.value;
        feature.properties.totalVoters = parseInt(entry.total.value);
        feature.properties.yes = parseInt(entry.yes.value);
        feature.properties.no = parseInt(entry.no.value);
        feature.properties.invalid = parseInt(entry.invalid.value);
        if (entry.description) {
            feature.properties.description = entry.description.value;
        }
        if (entry.unemployed) {
            feature.properties.unemployed = entry.unemployed.value;
        }
        if (entry.households_one_person) {
            feature.properties.households_one_person = entry.households_one_person.value;
        }
        if (entry.households_children) {
            feature.properties.households_children = entry.households_children.value;
        }
        if (entry.households_migration) {
            feature.properties.households_migration = entry.households_migration.value;
        }
        output.push(feature);
    }
    return output;
}

// workaround to convert geometries containing holes to geojson
function manuallyGetGeometry(wkt) {
    var geometry = {
        "type": "Polygon",
        "coordinates": []
    }

    var slice = wkt.slice(16, -3);
    var splitlist = slice.split("),(");
    for (var i = 0; i < splitlist.length; i++) {
        var splitlist2 = splitlist[i].split(",");
        geometry.coordinates[i] = [];
        for (var j = 0; j < splitlist2.length; j++) {
            var coordinates = splitlist2[j].split(" ")
            geometry.coordinates[i][j] = coordinates
        }
    }
    return geometry;
}
