var prevTime = null
var currEvents = []
var eventsToDisplay = []

function event() {
	var name = '';
	var interval = 0;
	var count = 0;
	var currEventTime = 0;
}

function addEvent() {
	var newEvent = new event();
	newEvent.name = document.getElementById('name').value;
	newEvent.interval = document.getElementById('interval').value;
	newEvent.count = document.getElementById('count').value;
	newEvent.currEventTime = 0;
	currEvents[currEvents.length] = newEvent;
}

function gameLoop(currTime) {
	if (!this.prevTime) {
		this.prevTime = currTime;
	}
	var timeDifference = currTime - this.prevTime;
	this.prevTime = currTime;

	update(timeDifference);
	render();

	window.requestAnimationFrame(gameLoop);
}

function update(timeDifference) {
	for (var i=0; i<this.currEvents.length; i+=1) {
		this.currEvents[i].currEventTime += timeDifference;
		if (this.currEvents[i].currEventTime >= this.currEvents[i].interval) {
			eventsToDisplay[eventsToDisplay.length] = this.currEvents[i];
			this.currEvents[i].currEventTime -= this.currEvents[i].interval;
			this.currEvents[i].count -= 1;
			if (this.currEvents[i].count <= 0) {
				this.currEvents.splice(i, 1);
			}
		}
	}
}

function render() {
	for (var i=0; i<this.eventsToDisplay.length; i+=1) {
		var textArea = document.getElementById('textArea');
		textArea.innerHTML += 'Event: ' + this.eventsToDisplay[i].name + ' (' + this.eventsToDisplay[i].count + ' remaining)\n';
		textArea.scrollTop = textArea.scrollHeight;
	}
	this.eventsToDisplay.length = 0
}

window.requestAnimationFrame(gameLoop);
