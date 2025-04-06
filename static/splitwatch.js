function createSplitwatch(elementId) {
	let startTime = 0;
	let elapsedTime = 0;
	let interval;
	let display = document.getElementById(elementId);

	//console.log(display)
  
	function formatTime(milliseconds) {
		let minutes = Math.floor(milliseconds / 60000);
		let seconds = Math.floor((milliseconds % 60000) / 1000);
	
		minutes = minutes.toString().padStart(2, '0');
		seconds = seconds.toString().padStart(2, '0');
	
		return `${minutes}:${seconds}`;
	}
  
	function updateDisplay() {
		display.textContent = formatTime(elapsedTime);
	}

	function start() {
		if (!interval) {
			startTime = Date.now() - elapsedTime;
			interval = setInterval(() => {
				elapsedTime = Date.now() - startTime;
				updateDisplay();
			}, 10); // Update every 10 milliseconds for smoother display
		}
	}
  
	function stop() {
		clearInterval(interval);
		interval = null;
	}
  
	function reset(elementId) {
		stop();
		elapsedTime = 0;
		display = document.getElementById(elementId);
		updateDisplay();
	}
  
	return {
		start: start,
		stop: stop,
		reset: reset,
		getElapsedTime: () => elapsedTime, // add a getter for elapsed time if needed.
	};
}

let splitStopwatch = createSplitwatch('first-split');

let currentSplitIndex = 1;
const intervalId = setInterval(checkCurrentSplit, 250)

function getNextListItem(currentListItem) {
	if (!currentListItem) {
		return null; // Return null if the current list item is not provided
	}

	return currentListItem.nextElementSibling;
}

function checkCurrentSplit() {
	const currentSplit = document.getElementById('first-split');
	const currentNode = markerData[currentSplit.parentElement.parentElement.getAttribute('node-id')];

	//console.log(currentSplit);

	updateSplitColor(currentSplit, currentNode);

	let lat = currentNode['lat'];
	let lng = currentNode['lng'];
	let comb = {latitude: lat, longitude: lng};

	console.log(
		haversine(userPos['latitude'], userPos['longitude'], comb['latitude'], comb['longitude']) * 1000
	)

	// if geolocation is within 4 metres of node
	if (mainStopwatch.getElapsedTime() > 2000) {

		//console.log("user passed node!");
		currentSplitIndex += 1;
		//console.log(currentSplit);

		if (currentSplitIndex == markerData.length) {
			window.location.href = '/';
		}

		currentSplit.removeAttribute('id');
		//console.log("removed id from current split");
		//console.log(currentSplit);

		currentSplit.style.color = 'green';
		currentSplit.nextElementSibling.style.color = 'green';

		const parent = currentSplit.parentElement.parentElement;
		const nextLi = getNextListItem(parent);
		const nextSplit = nextLi.querySelector('.split-right').querySelector('span');
		//console.log("found next split");
		//console.log(parent);
		//console.log(nextSplit);

		nextSplit.setAttribute('id','first-split');
		//console.log("added first-split id to next split");
		//console.log(nextSplit);

		splitStopwatch.stop();
		splitStopwatch = createSplitwatch('first-split');
		splitStopwatch.start();
	}
}

function updateSplitColor(currentSplit, node) {
	let limit = node['time'];
	let current = splitStopwatch.getElapsedTime();

	//console.log(limit);
	//console.log(current);

	if (current/1000 > limit) {
		currentSplit.style.color = 'red';
		currentSplit.nextElementSibling.style.color = 'red';
	}
}

function haversine(lat1, lon1, lat2, lon2)
    {
        // distance between latitudes
        // and longitudes
        let dLat = (lat2 - lat1) * Math.PI / 180.0;
        let dLon = (lon2 - lon1) * Math.PI / 180.0;
           
        // convert to radiansa
        lat1 = (lat1) * Math.PI / 180.0;
        lat2 = (lat2) * Math.PI / 180.0;
         
        // apply formulae
        let a = Math.pow(Math.sin(dLat / 2), 2) + 
                   Math.pow(Math.sin(dLon / 2), 2) * 
                   Math.cos(lat1) * 
                   Math.cos(lat2);
        let rad = 6371;
        let c = 2 * Math.asin(Math.sqrt(a));
        return rad * c;
         
    }