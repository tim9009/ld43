// Constructor
function Task(initArgs) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this, false);
	this.parent = initArgs.parent || null;
	this.targetProblem = initArgs.targetProblem;
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
		},
		openHook: function() {
			// Init values
			this.state.startIndex = 0;
			this.parent.assignedPeople = [];

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
		preConfirmHook: function() {
			if(this.parent.assignedPeople.length > 0) {
				return true;
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

				if(map.people[i].alive && Vroom.isAreaClicked(pos, this.state.personDim, false)) {
					
					var match = false;
					var matchIndex = null;
					for(var ii = 0; ii < this.parent.assignedPeople.length; ii++) {
						if(this.parent.assignedPeople[ii] == map.people[i]._id) {
							match = true;
							matchIndex = ii;
							break;
						}
					}

					if(match) {
						this.parent.assignedPeople.splice(matchIndex, 1);
					} else {
						this.parent.assignedPeople.push(map.people[i]._id);
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
				// Check if person is alive
				if(!map.people[i].alive) {
					Vroom.ctx.fillStyle = '#000';
				} else {
					// Check if person is assigned to another task
					if(map.people[i].assigned) {
						Vroom.ctx.fillStyle = '#B9B9B9';
					} else {
						// Check if person is assigned to this task
						if(this.parent.assignedPeople.includes(map.people[i]._id)) {
							Vroom.ctx.fillStyle = '#2B8D27';
						} else {
							Vroom.ctx.fillStyle = '#333';
						}
					}
				}
				Vroom.ctx.fillRect(pos.x, pos.y, this.state.personDim.width, this.state.personDim.height);

				// Title
				Vroom.ctx.textAlign = 'left';
				Vroom.ctx.font = '8px lcd_solid';
				Vroom.ctx.fillStyle = '#fff';
				Vroom.ctx.fillText(map.people[i].name, pos.x + 5, pos.y + 15);

				// If dead
				if(!map.people[i].alive) {
					Vroom.ctx.textAlign = 'left';
					Vroom.ctx.font = '15px lcd_solid';
					Vroom.ctx.fillStyle = '#fff';

					Vroom.ctx.fillText('DEAD', pos.x + 5, pos.y + 65);

					// Skip the rest of the rendering for this person
					personNumber++;
					continue;
				}

				// Stats
				var target = 100;
				var barOffsetSide = 5;
				var healthOffsetTop = 28;
				var statsOffsetTop = 48;

				// Bars
				var healthPercentage = Math.floor(map.people[i].stats.health * 100 / target);
				var healthBarWidth = Math.floor((this.state.personDim.width - (barOffsetSide * 2)) * healthPercentage / 100);

				var biologyPercentage = Math.floor(map.people[i].stats.biology * 100 / map.people[i].statMaxValue);
				var biologyBarWidth = Math.floor((this.state.personDim.width - (barOffsetSide * 2)) * biologyPercentage / 100);

				var electronicsPercentage = Math.floor(map.people[i].stats.electronics * 100 / map.people[i].statMaxValue);
				var electronicsBarWidth = Math.floor((this.state.personDim.width - (barOffsetSide * 2)) * electronicsPercentage / 100);

				var engineeringPercentage = Math.floor(map.people[i].stats.engineering * 100 / map.people[i].statMaxValue);
				var engineeringBarWidth = Math.floor((this.state.personDim.width - (barOffsetSide * 2)) * engineeringPercentage / 100);

				// Text settings
				Vroom.ctx.textAlign = 'left';
				Vroom.ctx.font = '5px lcd_solid';

				// Render
				Vroom.ctx.fillStyle = '#fff';
				Vroom.ctx.fillText('Health', pos.x + barOffsetSide, pos.y + 28 + healthOffsetTop);

				Vroom.ctx.fillStyle = '#B8202C';
				Vroom.ctx.fillRect(pos.x + barOffsetSide, pos.y + 30 + healthOffsetTop, this.state.personDim.width - (barOffsetSide * 2), 4);

				Vroom.ctx.fillStyle = '#2B8D27';
				Vroom.ctx.fillRect(pos.x + barOffsetSide, pos.y + 30 + healthOffsetTop, healthBarWidth, 4);

				var barNumber = 0;

				Vroom.ctx.fillStyle = '#fff';
				Vroom.ctx.fillText('Biology (' + map.people[i].stats.biology + ')', pos.x + barOffsetSide, pos.y + 28 + (12 * barNumber) + statsOffsetTop);

				Vroom.ctx.fillStyle = '#2B8D27';
				Vroom.ctx.fillRect(pos.x + barOffsetSide, pos.y + 30 + (12 * barNumber) + statsOffsetTop, biologyBarWidth, 2);

				barNumber++;

				Vroom.ctx.fillStyle = '#fff';
				Vroom.ctx.fillText('Electronics (' + map.people[i].stats.electronics + ')', pos.x + barOffsetSide, pos.y + 28 + (12 * barNumber) + statsOffsetTop);

				Vroom.ctx.fillStyle = '#2B8D27';
				Vroom.ctx.fillRect(pos.x + barOffsetSide, pos.y + 30 + (12 * barNumber) + statsOffsetTop, electronicsBarWidth, 2);

				barNumber++;

				Vroom.ctx.fillStyle = '#fff';
				Vroom.ctx.fillText('Engineering (' + map.people[i].stats.engineering + ')', pos.x + barOffsetSide, pos.y + 28 + (12 * barNumber) + statsOffsetTop);

				Vroom.ctx.fillStyle = '#2B8D27';
				Vroom.ctx.fillRect(pos.x + barOffsetSide, pos.y + 30 + (12 * barNumber) + statsOffsetTop, engineeringBarWidth, 2);

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

			this.onWorkDone();

			console.log('The work is done. Heading back to base.');
		}

		// When arriving back to base
		if(this.workDone && this.traveling && this.progress > this.travelTime) {
			this.onDone();
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

	// Remove assigned status from all people assigned to this task
	for(var i = 0; i < this.assignedPeople.length; i++) {
		for(var ii = 0; ii < map.people.length; ii++) {
			if(map.people[ii]._id === this.assignedPeople[i]) {
				map.people[ii].assigned = false;
				break;
			}
		}
	}
};

Task.prototype.start = function() {
	this.taskStarted = true;
	this.traveling = true;
	this.lastTimeUpdate = gameState.time;

	// St assigned status for all people assigned to this task
	for(var i = 0; i < this.assignedPeople.length; i++) {
		for(var ii = 0; ii < map.people.length; ii++) {
			if(map.people[ii]._id === this.assignedPeople[i]) {
				map.people[ii].assigned = true;
				break;
			}
		}
	}

	console.log('You\'ve got it! Heading out right away.');
};

Task.prototype.open = function() {
	this.windows.choosePeople.show();
};

Task.prototype.calculateRisk = function() {
	var problemType = this.parent.problems[this.targetProblem].type;
	var baseRisk = this.parent.problems[this.targetProblem].risk;
	var riskModifier = 0;

	for(var i = 0; i < this.assignedPeople.length; i++) {
		for(var ii = 0; ii < map.people.length; ii++) {
			if(map.people[ii]._id === this.assignedPeople[i]) {
				riskModifier += map.people[ii].stats[problemType];
				break;
			}
		}
	}

	return baseRisk - riskModifier;
};

Task.prototype.onWorkDone = function() {
	// Update people stats
	var problemType = this.parent.problems[this.targetProblem].type;
	var risk = this.calculateRisk();
	var report = {
		damage: [],
	};

	for(var i = 0; i < this.assignedPeople.length; i++) {
		for(var ii = 0; ii < map.people.length; ii++) {
			if(map.people[ii]._id === this.assignedPeople[i]) {
				// Check if person takes damage
				if(Math.floor(Math.random() * 100) + 1 <= risk) {
					map.people[ii].stats.health -= risk;

					report.damage.push({
						name: map.people[ii].name,
						damage: risk,
					});
				}

				// Level up
				map.people[ii].stats[problemType]++;
				if(map.people[ii].stats[problemType] > map.people[ii].statMaxValue) {
					map.people[ii].stats[problemType] = map.people[ii].statMaxValue;
				}

				break;
			}
		}
	}

	console.log(report);
};

Task.prototype.onDone = function() {
	this.traveling = false;
	this.taskDone = true;
	this.parent.structure.current += 10;
	console.log('Checking in.');
	this.parent.removeTask(this._id);
};