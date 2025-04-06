function createGeolocator() {
	let watchId;
	let userMarker;

	function start() {
        if (!watchId) {
            const options = {
                enableHighAccuracy: true,
                timeout: 5000, // 5 seconds
                maximumAge: 10000, // 10 seconds
            };

            watchId = navigator.geolocation.watchPosition(logPosition, handleError, options);
        }
	}

	function logPosition(position) {
		//console.log(position.coords.latitude)
		//console.log(position.coords.longitude)
		if (userMarker) {
			map.removeLayer(userMarker);
		}
		userPos = {latitude: position.coords.latitude, longitude: position.coords.longitude}
		userMarker = L.marker([position.coords.latitude, position.coords.longitude], {icon: userIcon}).addTo(map).bindPopup(location.popup)
	}

    function handleError(error) {
        console.error('Geolocation error:', error);
        alert('Geolocation error: ' + error.message);
        stop(); // Stop watching on error
    }
  
	function stop() {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            if(userMarker){
                map.removeLayer(userMarker);
                userMarker = null;
            }
        }
	}
  
	return {
		start: start,
		stop: stop,
	};
}

let geo = createGeolocator();
geo.start();

console.log(geo)