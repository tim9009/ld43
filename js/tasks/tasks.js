// Constructor
function Task(initArgs) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this, false);
	this.parent = initArgs.parent || null;
	this.title = initArgs.title || 'No name';
	this.description = initArgs.description || 'No description';
	this.taskStarted = false;
	this.taskDone = false;

	this.workDone = false;
	this.workFailed = false;
	this.workStarted = false;
	this.timeToCompleteWork = initArgs.timeToCompleteWork || 0;

	this.traveling = false;
	this.travelTime = initArgs.travelTime || 0;

	this.lastTimeUpdate = 0;
	this.progress = 0;

	this.assignedPeople = initArgs.assignedPeople || [];

	// Windows
	this.windows = {};
	this.windows.choosePeople = new Window({
		parent: this,
		layer: 4,
		title: 'Who should perform the task?',
		cancelButton: true,
		confirmButton: true,
		confirmText: 'Issue order',
		dim: {
			width: Vroom.dim.width - 30,
			height: Vroom.dim.height - 30,
		},
		pos: {
			x: 15,
			y: 20,
		},
		style: {
			padding: {
				top: 10,
				right: 10,
			},
		},
		cancelHook: function() {
			if(this.parent && this.parent.parent) {
				this.parent.parent.windows.main.activateInput();
			}
		},
		confirmHook: function() {
			if(this.parent && this.parent.parent) {
				this.parent.parent.windows.main.activateInput();
			}
		},
	});

	this.init();
}

// Set correct prototype and costructor
Task.prototype = Object.create(VroomEntity.prototype);
Task.prototype.constructor = Task;

// Init function
Task.prototype.init = function() {
	this.layer = 3;

	this.dim = {
		width: 0,
		height: 0,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};
};

// Update function. Handles all logic for objects related to this class.
Task.prototype.update = function(step) {
	if(this.taskStarted && !this.taskDone) {
		if(this.lastTimeUpdate !== gameState.time) {
			this.progress += gameState.time - this.lastTimeUpdate;
			this.lastTimeUpdate = gameState.time;
			console.log(this.progress);
		}

		// When arriving on location
		if(this.traveling && !this.workStarted && this.progress >= this.travelTime) {
			this.traveling = false;
			this.workStarted = true;
			this.progress = 0;
			console.log('Arrived on location. Starting work.');
		}

		// When work is done
		if(this.workStarted && !this.traveling && this.progress >= this.timeToCompleteWork) {
			this.traveling = true;
			this.workDone = true;
			this.progress = 0;
			console.log('The work is done. Heading back to base.');
		}

		// When arriving back to base
		if(this.workDone && this.traveling && this.progress >= this.travelTime) {
			this.traveling = false;
			this.taskDone = true;
			console.log('Checking in.');
		}
	}
};

// Render function. Draws all elements related to this module to screen.
Task.prototype.render = function(camera) {
	
};

Task.prototype.onRegister = function() {
	for (var entity in this.windows) {
		Vroom.registerEntity(this.windows[entity]);
	}
};

Task.prototype.onDeregister = function() {
	for (var entity in this.windows) {
		this.windows[entity].hide();
		Vroom.deregisterEntity(this.windows[entity]._id);
	}
};

Task.prototype.start = function() {
	this.taskStarted = true;
	this.traveling = true;
	this.lastTimeUpdate = gameState.time;
	console.log('You\'ve got it! Heading out right away.');
};

Task.prototype.open = function() {
	this.windows.choosePeople.show();
};