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

markerData.forEach(function(location) {
	L.marker([location.lat, location.lng], {icon: dotIcon}).addTo(map).bindPopup(location.popup)
})

for (let i=1; i<markerData.length; i++) {
	var line = new L.polyline(
		[
			[markerData[i-1].lat, markerData[i-1].lng],
			[markerData[i].lat, markerData[i].lng]
		],
		{
			color: 'red',
			weight: 3,
			opacity: 1,
		}
	);
	
	line.addTo(map);
}