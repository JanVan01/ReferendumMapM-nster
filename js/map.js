
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

map.zoomControl.setPosition('bottomright');



L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.sidebar('sidebar').addTo(map);


L.control.window(map,{title:'Welcome to the Referendum Map Münster',maxWidth:400,modal: true})
.content('</br><p>Here you will be provided with infomation regarding the recent referendum that took place in Münster on November 6th in 2016. Just click on the district that you want to know the Yes, No and Invalid votes.</p>')
.prompt({callback:function(){}})
.show();


