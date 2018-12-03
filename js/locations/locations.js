// Constructor
function Location(initArgs) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this, false);
	
	// General
	this.name = initArgs.name || 'No name';
	this.layer = 2;
	this.tasks = [];
	this.active = false;
	this.structure = {
		max: 100,
		current: 50,
		deteriorationRate: 0.2,
	};
	this.timeTickCounter = 0;
	this.eventInterval = 6;
	this.travelTime = initArgs.travelTime || 0;

	// Resources
	this.usage = initArgs.usage || null;
	if(this.usage) {
		this.usage.oxygen = initArgs.usage.oxygen || 0;
		this.usage.water = initArgs.usage.water || 0;
		this.usage.power = initArgs.usage.power || 0;
	} else {
		this.usage = {};
		this.usage.oxygen = 0;
		this.usage.water = 0;
		this.usage.power = 0;
	}

	this.production = initArgs.production || null;
	if(this.production) {
		this.production.oxygen = initArgs.production.oxygen || 0;
		this.production.water = initArgs.production.water || 0;
		this.production.power = initArgs.production.power || 0;
	} else {
		this.production = {};
		this.production.oxygen = 0;
		this.production.water = 0;
		this.production.power = 0;
	}

	// Problems
	var availableProblems = [];
	for(var problem in initArgs.availableProblems) {
		var usage = {};
		if(initArgs.availableProblems[problem].usage) {
			usage.oxygen = initArgs.availableProblems[problem].usage.oxygen || 0;
			usage.water = initArgs.availableProblems[problem].usage.water || 0;
			usage.power = initArgs.availableProblems[problem].usage.power || 0;
		} else {
			usage.oxygen = 0;
			usage.water = 0;
			usage.power = 0;
		}

		var production = {};
		if(initArgs.availableProblems[problem].production) {
			production.oxygen = initArgs.availableProblems[problem].production.oxygen || 0;
			production.water = initArgs.availableProblems[problem].production.water || 0;
			production.power = initArgs.availableProblems[problem].production.power || 0;
		} else {
			production.oxygen = 0;
			production.water = 0;
			production.power = 0;
		}

		availableProblems.push({
			title: initArgs.availableProblems[problem].title || 'No title',
			description: initArgs.availableProblems[problem].description || 'No description',
			usage: usage,
			production: production,
			risk: initArgs.availableProblems[problem].risk || 0,
			type: initArgs.availableProblems[problem].type || 'engineering',
			timeToCompleteWork: initArgs.availableProblems[problem].timeToCompleteWork || 0,
		});
	}
	this.availableProblems = availableProblems;
	this.lastAddedProblem = null;
	this.problems = [];


	// Dim
	this.dim = initArgs.dim || {};
	if(initArgs.dim) {
		this.dim.width = initArgs.dim.width || 0;
		this.dim.height = initArgs.dim.height || 0;
	} else {
		this.dim.width = 0;
		this.dim.height = 0;
	}

	// Pos
	this.pos = initArgs.pos || {};
	if(initArgs.pos) {
		this.pos.x = initArgs.pos.x || 0;
		this.pos.y = initArgs.pos.y || 0;
	} else {
		this.pos.x = 0;
		this.pos.y = 0;
	}

	// Windows
	this.windows = {};
	this.windows.main = new Window({
		parent: this,
		title: this.name,
		closeButton: true,
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
		updateHook: function() {
			// Tasks
			var margin = 2;
			var taskOffsetTop = 15;

			var dim = {
				width: (this.contentDim.width / 2) - (margin / 2),
				height: 40,
			};

			var rows = 0;
			for(var i = 0; i < this.parent.tasks.length; i++) {
					var pos = {
						x: this.contentPos.x,
						y: this.contentPos.y + ((dim.height + margin) * rows) + taskOffsetTop,
					};

					// Check if even
					if(Math.abs(i % 2) === 1) {
						rows += 1;
						pos.x += dim.width + margin;
					}

					if(!this.parent.tasks[i].taskStarted) {
						if(Vroom.isAreaClicked(pos, dim, false)) {
							this.parent.tasks[i].open();
							this.deactivateInput();
						}
					}
			}
		},
		renderHook: function() {
			// Production
			var totalProduction = this.parent.getTotalProduction();
			var totalUsage = this.parent.getTotalUsage();
			Vroom.ctx.textAlign = 'left';
			Vroom.ctx.font = '5px lcd_solid';

			Vroom.ctx.fillStyle = '#fff';
			Vroom.ctx.fillRect(this.pos.x + 125, this.pos.y, 120, 19);

			var productionString = 'Producing: ' + totalProduction.oxygen + ' Air, ' + totalProduction.water + ' Water, ' + totalProduction.power + ' Power';
			var usageString = 'Consuming: ' + totalUsage.oxygen + ' Air, ' + totalUsage.water + ' Water, ' + totalUsage.power + ' Power';

			Vroom.ctx.fillStyle = '#627F89';
			Vroom.ctx.fillText(productionString, this.pos.x + 130 + 4, this.pos.y + 8);
			Vroom.ctx.fillText(usageString, this.pos.x + 130 + 4, this.pos.y + 15);
			
			// Data
			var dataString = 'Maintenance: ' + Math.floor((this.parent.structure.current * 100) / this.parent.structure.max) + '%';

			var dataStringOffsetTop = 2;

			Vroom.ctx.textAlign = 'left';
			Vroom.ctx.font = '6px lcd_solid';
			Vroom.ctx.fillStyle = '#fff';
			Vroom.ctx.fillText(dataString, this.contentPos.x, this.contentPos.y + dataStringOffsetTop);

			// Title
			if(this.parent.tasks.length === 0) {
				Vroom.ctx.fillText('No problems here!', this.contentPos.x, this.contentPos.y + dataStringOffsetTop + 10);
			} else {
				Vroom.ctx.fillText('Service tasks', this.contentPos.x, this.contentPos.y + dataStringOffsetTop + 10);
			}

			// Tasks
			var taskOffsetTop = 15;
			var margin = 2;

			var dim = {
				width: (this.contentDim.width / 2) - (margin / 2),
				height: 50,
			};

			var rows = 0;

			for(var i = 0; i < this.parent.tasks.length; i++) {
				var pos = {
					x: this.contentPos.x,
					y: this.contentPos.y + ((dim.height + margin) * rows) + taskOffsetTop,
				};

				// Check if even
				if(Math.abs(i % 2) === 1) {
					rows += 1;
					pos.x += dim.width + margin;
				}

				// Box
				if(this.parent.tasks[i].taskStarted && !this.parent.tasks[i].taskDone) {
					Vroom.ctx.fillStyle = '#808080';
				} else {
					Vroom.ctx.fillStyle = '#333';
				}
				Vroom.ctx.fillRect(pos.x, pos.y, dim.width, dim.height);

				// Progress bar
				if(this.parent.tasks[i].taskStarted) {
					// Get current progress target
					var progressTarget = 0;
					if(this.parent.tasks[i].traveling) {
						progressTarget = this.parent.tasks[i].travelTime;
					} else
					if(this.parent.tasks[i].workStarted) {
						progressTarget = this.parent.tasks[i].timeToCompleteWork;
					}

					var progressPercentage = Math.floor(this.parent.tasks[i].progress * 100 / progressTarget);
					var barWidth = Math.floor(dim.width * progressPercentage / 100);

					Vroom.ctx.fillStyle = '#fff';
					Vroom.ctx.fillRect(pos.x, pos.y + dim.height - 2, barWidth, 2);
				}

				// Title
				Vroom.ctx.textAlign = 'left';
				Vroom.ctx.font = '7px lcd_solid';
				Vroom.ctx.fillStyle = '#fff';
				Vroom.ctx.fillText(this.parent.tasks[i].title, pos.x + 4, pos.y + 10);

				if(this.parent.tasks[i].taskStarted) {
					var statusString = '';

					if(this.parent.tasks[i].traveling && !this.parent.tasks[i].workStarted) {
						statusString = 'In transit to location.';
					} else
					if(!this.parent.tasks[i].traveling && this.parent.tasks[i].workStarted) {
						statusString = 'Working on task.';
					} else
					if(this.parent.tasks[i].traveling && this.parent.tasks[i].workStarted) {
						statusString = 'Heading back to base.';
					}

					Vroom.ctx.font = '5px lcd_solid';
					Vroom.ctx.fillText(statusString, pos.x + 4, pos.y + 30);

					// Skip the rest of the rendering for this task
					continue;
				}

				Vroom.ctx.font = '5px lcd_solid';

				// Type
				var type = '';
				var typeColor = '';
				switch(this.parent.problems[this.parent.tasks[i].targetProblem].type) {
					case 'biology':
						type = 'Biology';
						typeColor = '#7AFF69';
						break;

					case 'electronics':
						type = 'Electronics';
						typeColor = '#6BFCF6';
						break;

					case 'engineering':
						type = 'Engineering';
						typeColor = '#F8877C';
						break;
				}
				Vroom.ctx.fillStyle = typeColor;
				Vroom.ctx.fillText(type, pos.x + 4, pos.y + 17);

				// Risk
				Vroom.ctx.fillStyle = '#fff';
				Vroom.ctx.fillRect(pos.x + dim.width - 19, pos.y, 19, 19);

				Vroom.ctx.fillStyle = '#333';
				Vroom.ctx.textAlign = 'center';
				Vroom.ctx.fillText('RISK', pos.x - 9 + dim.width, pos.y + 9);
				Vroom.ctx.fillText(this.parent.tasks[i].calculateRisk() + '%', pos.x + dim.width - 9, pos.y + 14);

				// Effect
				var usageString = '';

				if(this.parent.problems[this.parent.tasks[i].targetProblem].usage.oxygen) {
					usageString += 'Air(' + this.parent.problems[this.parent.tasks[i].targetProblem].usage.oxygen + ') ';
				}

				if(this.parent.problems[this.parent.tasks[i].targetProblem].usage.water) {
					usageString += 'Water(' + this.parent.problems[this.parent.tasks[i].targetProblem].usage.water + ') ';
				}

				if(this.parent.problems[this.parent.tasks[i].targetProblem].usage.power) {
					usageString += 'Power(' + this.parent.problems[this.parent.tasks[i].targetProblem].usage.power + ') ';
				}

				Vroom.ctx.textAlign = 'left';
				Vroom.ctx.fillStyle = '#fff';

				if(usageString !== '') {
					Vroom.ctx.fillText('Draining pr. hour:', pos.x + 4, pos.y + 24);
					Vroom.ctx.fillText(usageString, pos.x + 4, pos.y + 30);
				}

				var productionString = '';

				if(this.parent.problems[this.parent.tasks[i].targetProblem].production.oxygen) {
					productionString += 'Air(' + this.parent.problems[this.parent.tasks[i].targetProblem].production.oxygen + ') ';
				}

				if(this.parent.problems[this.parent.tasks[i].targetProblem].production.water) {
					productionString += 'Water(' + this.parent.problems[this.parent.tasks[i].targetProblem].production.water + ') ';
				}

				if(this.parent.problems[this.parent.tasks[i].targetProblem].production.power) {
					productionString += 'Power(' + this.parent.problems[this.parent.tasks[i].targetProblem].production.power + ') ';
				}

				Vroom.ctx.textAlign = 'left';
				Vroom.ctx.fillStyle = '#fff';

				if(productionString !== '') {
					Vroom.ctx.fillText('Produciton pr. hour:', pos.x + 4, pos.y + 24);
					Vroom.ctx.fillText(productionString, pos.x + 4, pos.y + 30);
				}

				// Description
				Vroom.ctx.fillStyle = '#CCCCCC';
				Vroom.multilineText(this.parent.tasks[i].description, {x: pos.x + 4, y: pos.y + 38}, 6);
			}
		}
	});

	this.sprite = initArgs.sprite || null;

	this.init();
}

// Set correct prototype and costructor
Location.prototype = Object.create(VroomEntity.prototype);
Location.prototype.constructor = Location;

// Init function
Location.prototype.init = function() {
	this.updateBounds();
};

// Update function. Handles all logic for objects related to this class.
Location.prototype.update = function(step) {
	// Activate
	if(map.inputActive && Vroom.isAreaClicked(this.pos, this.dim)) {
		this.active = true;
		this.windows.main.show();
		map.deactivateInput();
	}

	// Deactivate
	if(this.active && !this.windows.main.visible) {
		this.active = false;
		map.activateInput();
	}

	// Hover
	this.hover = false;
	if(!this.active && Vroom.isMouseOverArea(this.pos, this.dim)) {
		this.hover = true;
	}

	// Deteriorate
	if(gameState.timeTick) {
		this.structure.current -= this.structure.deteriorationRate;

		// Limit to 0
		if(this.structure.current < 0) {
			this.structure.current = 0;
		}

		this.timeTickCounter++;
	}

	// Events
	if(this.timeTickCounter >= this.eventInterval) {
		this.timeTickCounter = 0;

		var random = Math.floor(Math.random() * this.structure.max) - (this.tasks.length * 25);
		if(random > this.structure.current) {
			this.addTask();
		}
	}
};

// Render function. Draws all elements related to this module to screen.
Location.prototype.render = function(camera) {
	var relPos = Vroom.getCameraRelativePos(this.pos);

	if(this.sprite) {
		this.sprite.render(relPos, this.dim);
	}

	if(this.tasks.length > 0) {
		Vroom.ctx.fillStyle = '#B8000A';
		Vroom.ctx.fillRect(relPos.x + this.halfDim.width + 10, relPos.y - 9, 12, 12);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = 'center';
		Vroom.ctx.font = '8px lcd_solid';
		Vroom.ctx.fillText(this.tasks.length, relPos.x + this.halfDim.width + 16, relPos.y);
	}

	if(this.hover) {
		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = 'center';
		Vroom.ctx.font = '8px lcd_solid';
		Vroom.ctx.fillText(this.name, relPos.x + this.halfDim.width, relPos.y + this.halfDim.height);
	}
};

Location.prototype.onRegister = function() {
	// Register windows
	for (var windowEntity in this.windows) {
		Vroom.registerEntity(this.windows[windowEntity]);
	}

	// register tasks
	for (var taskEntity in this.tasks) {
		Vroom.registerEntity(this.tasks[taskEntity]);
		this.tasks[taskEntity].onRegister();
	}
};

Location.prototype.onDeregister = function() {
	// Register windows
	for (var windowEntity in this.windows) {
		this.windows[windowEntity].hide();
		Vroom.deregisterEntity(this.windows[windowEntity]._id);
	}

	// Register tasks
	for (var taskEntity in this.tasks) {
		Vroom.deregisterEntity(this.tasks[taskEntity]._id);
		this.tasks[taskEntity].onDeregister();
	}
};

Location.prototype.addTask = function() {
	if(this.tasks.length < 4) {
		// Select available problem
		var selectedAvailableProblem = null;
		var timeout = 100;
		for(var i = 0; i < timeout; i++) {
			selectedAvailableProblem = Math.floor(Math.random() * this.availableProblems.length);

			if(selectedAvailableProblem !== this.lastAddedProblem) {
				break;
			}
		}
		
		this.lastAddedProblem = selectedAvailableProblem;

		// Add problem to list of problems
		this.problems.push(this.availableProblems[selectedAvailableProblem]);
		var targetProblem = this.problems.length - 1;

		// Create and add task for problem
		this.tasks.push(
			new Task({
				parent: this,
				targetProblem: targetProblem,
				travelTime: this.travelTime,
				timeToCompleteWork: this.problems[targetProblem].timeToCompleteWork,
				title: this.problems[targetProblem].title,
				description: this.problems[targetProblem].description,
			})
		);

		// Register task
		Vroom.registerEntity(this.tasks[this.tasks.length - 1]);
		this.tasks[this.tasks.length - 1].onRegister();
	}
};

Location.prototype.removeTask = function(id) {
	for(var i = 0; i < this.tasks.length; i++) {
		if(this.tasks[i]._id === id) {
			// Deregister
			Vroom.deregisterEntity(id);
			this.tasks[i].onDeregister();

			// Delete
			this.tasks.splice(i, 1);

			// Make shure input is activated
			this.windows.main.activateInput();
			break;
		}
	}
};

Location.prototype.getTotalUsage = function() {
	var totalUsage = {
		oxygen: this.usage.oxygen,
		water: this.usage.water,
		power: this.usage.power,
	};

	for(var problem in this.problems) {
		if(this.problems[problem].usage) {
			totalUsage.oxygen += this.problems[problem].usage.oxygen;
			totalUsage.water += this.problems[problem].usage.water;
			totalUsage.power += this.problems[problem].usage.power;
		}
	}

	return totalUsage;
};

Location.prototype.getTotalProduction = function() {
	var totalProduction = {
		oxygen: this.production.oxygen,
		water: this.production.water,
		power: this.production.power,
	};

	for(var problem in this.problems) {
		if(this.problems[problem].production) {
			totalProduction.oxygen += this.problems[problem].production.oxygen;
			totalProduction.water += this.problems[problem].production.water;
			totalProduction.power += this.problems[problem].production.power;
		}
	}

	return totalProduction;
};