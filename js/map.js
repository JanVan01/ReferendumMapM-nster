 

var map = L.map('map',{
 center: [51.959312,7.617267],
 zoom: 12,
 minZoom: 11
 });
 
 

 map.setMaxBounds([[51.8675880511,7.3663330078], [52.0554460954,7.8524780273]]);
var osmLayer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { noWrap: true}).addTo(map);



 var sidebar = L.control.sidebar('sidebar').addTo(map);
