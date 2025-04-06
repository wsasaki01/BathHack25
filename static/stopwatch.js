function createStopwatch(elementId) {
	let startTime = 0;
	let elapsedTime = 0;
	let interval;
	const display = document.getElementById(elementId);

	console.log(display)
  
	function formatTime(milliseconds) {
		let minutes = Math.floor(milliseconds / 60000);
		let seconds = Math.floor((milliseconds % 60000) / 1000);
		let ms = milliseconds % 1000;
	
		minutes = minutes.toString().padStart(2, '0');
		seconds = seconds.toString().padStart(2, '0');
		ms = ms.toString().padStart(3, '0');
	
		return `${minutes}:${seconds}:${ms}`;
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
  
	function reset() {
		stop();
		elapsedTime = 0;
		updateDisplay();
	}
  
	return {
		start: start,
		stop: stop,
		reset: reset,
		getElapsedTime: () => elapsedTime, // add a getter for elapsed time if needed.
	};
  }
  
  // Example usage:
  const mainStopwatch = createStopwatch('speedrun-timer'); // Replace 'stopwatch-display' with your element's ID.
  
  mainStopwatch.start();