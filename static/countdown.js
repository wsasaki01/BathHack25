function createCountdown() {
	let interval;
	let content = 3;
	let display = document.getElementById("speedrun-timer");
	updateDisplay();
  
	function updateDisplay() {
		display.textContent = content;
	}

	function start() {
		if (!interval) {
			interval = setInterval(() => {
				console.log(content);
				content -= 1;
				if (content == 0) {
					mainStopwatch.start();
					splitStopwatch.start();
					stop();
				} else {
					updateDisplay();
				}
			}, 1000);
		}
	}
  
	function stop() {
		clearInterval(interval);
		interval = null;
	}
  
	return {
		start: start,
		stop: stop,
	};
}

let countdown = createCountdown();
countdown.start();