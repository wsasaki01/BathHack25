var time = 0;
var interval;
var display = document.getElementById("speedrun-timer");

if(interval){
	clearInterval(interval);
}
interval = setInterval(() => { 
	time += 1
	display.innerHTML = 
		Math.floor(time / 3600).toString().padStart(2, "0") + ":" + Math.floor((time % 3600) / 60).toString().padStart(2, "0") + ":" + Math.floor((time % 60)).toString().padStart(2, "0")
	}, 1000
);