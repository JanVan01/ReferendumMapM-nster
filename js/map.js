var map = L.map('map', {
    center: [51.959312, 7.617267],
    zoom: 12,
    minZoom: 11,
    zoomControl: true
});

map.setMaxBounds([
    [51.8675880511, 7.3663330078],
    [52.0554460954, 7.8524780273]
]);

console.log(map.zoomControl.setPosition('bottomright'));

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.sidebar('sidebar').addTo(map);
