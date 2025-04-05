markerData.forEach(function(data) {
	console.log(data);
})

let mapOpts = {
    "center": [51.378931, -2.325218],
    "zoom": 17
}
var map = L.map("map", mapOpts); // default view + zoom

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*
var pl = new L.polyline(latlong, {
    color: "red",
    weight: 3,
    opacity: 0.5,
    smoothfactor: 1
});
*/

var locations = [
	{lat: 51.38172289, lng: -2.323211378, popup: "Marker 1"}
]

locations.forEach(function(location) {
	L.marker([location.lat, location.lng]).addTo(map).bindPopup(location.popup)
})