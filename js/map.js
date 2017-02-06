var map = L.map('map', {
    center: [51.959312, 7.617267],
    zoom: 12,
    minZoom: 11,
    zoomControl: true
});

map.setMaxBounds([
    [51.7675880511, 7.3663330078],
    [52.1554460954, 7.8524780273]
]);



L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.sidebar('sidebar').addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<i style="background:green"></i> yes <br>'
    div.innerHTML += '<i style="background:red"></i> no <br>'
    div.innerHTML += '<i class="gradient"></i> participation <br>'
    return div;
};

legend.addTo(map);

map.zoomControl.setPosition('bottomright');
