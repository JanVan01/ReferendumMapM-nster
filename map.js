 var map = L.map('map',{
 center: [51.959312, 7.617267],
 zoom: 12,
 minZoom: 11
 });

 L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);

