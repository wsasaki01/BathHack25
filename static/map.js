let mapOpts = {
    "center": [51.378931, -2.325218],
    "zoom": 17
}
var map = L.map("map", mapOpts); // default view + zoom

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var dotIcon = L.icon({
	iconUrl: 'static/img/black-circle.png',

	iconSize: [10,10],
	iconAnchor: [5,5],
	popupAnchor: [5,5]
})

var locations = [
	{lat: 51.38172289, lng: -2.323211378, popup: "Marker 1"},
	{lat: 51.38136374, lng: -2.324163516, popup: "Marker 2"}
]

locations.forEach(function(location) {
	L.marker([location.lat, location.lng], {icon: dotIcon}).addTo(map).bindPopup(location.popup)
})

for (let i=1; i<locations.length; i++) {
	var line = new L.polyline(
		[
			[locations[i-1].lat, locations[i-1].lng],
			[locations[i].lat, locations[i].lng]
		],
		{
			color: 'red',
			weight: 3,
			opacity: 1,
		}
	);
	
	line.addTo(map);
}