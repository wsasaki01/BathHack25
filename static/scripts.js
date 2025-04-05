let mapOpts = {
    "center": [51.378931, -2.325218],
    "zoom": 17
}
var map = L.map("map", mapOpts); // default view + zoom
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var pl = new L.polyline(latlong, {
    color: "red",
    weight: 3,
    opacity: 0.5,
    smoothfactor: 1
});
