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
			}
		},
		state: {
			startIndex: 0,

			// Left arrow
			leftArrowDim: {
				width: 5,
				height: 20,
			},
			leftArrowPos: {
				x: 0,
				y: 0,
			},

			// Right arrow
			rightArrowDim: {
				width: 5,
				height: 20,
			},
			rightArrowPos: {
				x: 0,
				y: 0,
			},

			//People
			peopleOffsetTop: 5,
			peopleOffsetSides: 15,
			margin: 2,
			personDim: {
				width: 0,
				height: 0,
			},
			assignedPeople: [],
		},
		openHook: function() {
			// Init values
			this.state.startIndex = 0;
			this.state.assignedPeople = [];

			// Left arrow
			this.state.leftArrowPos.x = this.contentPos.x;
			this.state.leftArrowPos.y = this.contentPos.y + (this.contentDim.height / 2) - (this.state.leftArrowDim.height / 2);

			// Right arrow
			this.state.rightArrowPos.x = this.contentPos.x + this.contentDim.width - this.state.rightArrowDim.width;
			this.state.rightArrowPos.y = this.contentPos.y + (this.contentDim.height / 2) - (this.state.rightArrowDim.height / 2);

			// Person
			this.state.personDim.width = (this.contentDim.width / 3) - (this.state.margin / 2) - (this.state.peopleOffsetSides / 1.5);
			this.state.personDim.height = this.contentDim.height - this.state.peopleOffsetTop - 5;
		},
		cancelHook: function() {
			if(this.parent && this.parent.parent) {
				this.parent.parent.windows.main.activateInput();
			}
		},
		confirmHook: function() {
			if(this.parent && this.parent.parent) {
				this.parent.parent.windows.main.activateInput();
				this.parent.start();
			}
		},
		updateHook: function() {
			// Left arrow
			if(Vroom.isAreaClicked(this.state.leftArrowPos, this.state.leftArrowDim, false)) {
				this.state.startIndex--;
				if(this.state.startIndex < 0) {
					this.state.startIndex = 0;
				}
			}

			// Right arrow
			if(Vroom.isAreaClicked(this.state.rightArrowPos, this.state.rightArrowDim, false)) {
				this.state.startIndex++;
				if(this.state.startIndex > map.people.length - 3) {
					this.state.startIndex = map.people.length - 3;
				}
			}

			// People
			var personNumber = 0;
			for(var i = this.state.startIndex; i < map.people.length && i < this.state.startIndex + 3; i++) {
				var pos = {
					x: this.contentPos.x + ((this.state.personDim.width + this.state.margin) * personNumber) + this.state.peopleOffsetSides,
					y: this.contentPos.y + this.state.peopleOffsetTop,
				};

				if(Vroom.isAreaClicked(pos, this.state.personDim, false)) {
					
					var match = false;
					var matchIndex = null;
					for(var ii = 0; ii < this.state.assignedPeople.length; ii++) {
						if(this.state.assignedPeople[ii] == map.people[i]._id) {
							match = true;
							matchIndex = ii;
							break;
						}
					}

					if(match) {
						this.state.assignedPeople.splice(matchIndex, 1);
					} else {
						this.state.assignedPeople.push(map.people[i]._id);
					}
				}

				personNumber++;
			}
		},
		renderHook: function() {
			// Left arrow
			Vroom.ctx.fillStyle = '#fff';
			Vroom.ctx.beginPath();
			Vroom.ctx.moveTo(this.state.leftArrowPos.x + this.state.leftArrowDim.width, this.state.leftArrowPos.y);
			Vroom.ctx.lineTo(this.state.leftArrowPos.x + this.state.leftArrowDim.width, this.state.leftArrowPos.y + this.state.leftArrowDim.height);
			Vroom.ctx.lineTo(this.state.leftArrowPos.x, this.state.leftArrowPos.y + (this.state.leftArrowDim.height / 2));
			Vroom.ctx.fill();

			// Right arrow
			Vroom.ctx.fillStyle = '#fff';
			Vroom.ctx.beginPath();
			Vroom.ctx.moveTo(this.state.rightArrowPos.x, this.state.rightArrowPos.y);
			Vroom.ctx.lineTo(this.state.rightArrowPos.x, this.state.rightArrowPos.y + this.state.rightArrowDim.height);
			Vroom.ctx.lineTo(this.state.rightArrowPos.x + this.state.rightArrowDim.width, this.state.rightArrowPos.y + (this.state.rightArrowDim.height / 2));
			Vroom.ctx.fill();


			// People
			var personNumber = 0;
			for(var i = this.state.startIndex; i < map.people.length && i < this.state.startIndex + 3; i++) {
				var pos = {
					x: this.contentPos.x + ((this.state.personDim.width + this.state.margin) * personNumber) + this.state.peopleOffsetSides,
					y: this.contentPos.y + this.state.peopleOffsetTop,
				};

				// Box
				// Check if person is assigned
				if(this.state.assignedPeople.includes(map.people[i]._id)) {
					Vroom.ctx.fillStyle = '#2B8D27';
				} else {
					Vroom.ctx.fillStyle = '#333';
				}
				Vroom.ctx.fillRect(pos.x, pos.y, this.state.personDim.width, this.state.personDim.height);

				// Title
				Vroom.ctx.textAlign = 'left';
				Vroom.ctx.font = '8px lcd_solid';
				Vroom.ctx.fillStyle = '#fff';
				Vroom.ctx.fillText(map.people[i].name, pos.x + 4, pos.y + 10);

				personNumber++;
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
		if(this.traveling && !this.workStarted && this.progress > this.travelTime) {
			this.traveling = false;
			this.workStarted = true;
			this.progress = 0;
			console.log('Arrived on location. Starting work.');
		}

		// When work is done
		if(this.workStarted && !this.traveling && this.progress > this.timeToCompleteWork) {
			this.traveling = true;
			this.workDone = true;
			this.progress = 0;
			console.log('The work is done. Heading back to base.');
		}

		// When arriving back to base
		if(this.workDone && this.traveling && this.progress > this.travelTime) {
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