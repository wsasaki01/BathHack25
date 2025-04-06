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
splitStopwatch.start();

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

	// if geolocation is within 4 metres of node
	if (mainStopwatch.getElapsedTime() > 2000 && currentSplitIndex==1) {

		//console.log("user passed node!");
		currentSplitIndex += 1;
		//console.log(currentSplit);

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