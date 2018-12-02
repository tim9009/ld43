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
	this.eventInterval = 10;
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

		availableProblems.push({
			title: initArgs.availableProblems[problem].title || 'No title',
			description: initArgs.availableProblems[problem].description || 'No description',
			usage: usage,
			severity: initArgs.availableProblems[problem].severity || 0,
		});
	}
	this.availableProblems = availableProblems;
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

				if(Vroom.isAreaClicked(pos, dim, false)) {
					this.parent.tasks[i].open();
					this.deactivateInput();
				}
			}
		},
		renderHook: function() {
			// Data
			var dataString = 'Maintenance: ' + Math.floor((this.parent.structure.current * 100) / this.parent.structure.max) + '%';

			var dataStringOffsetTop = 2;

			Vroom.ctx.textAlign = 'left';
			Vroom.ctx.font = '6px lcd_solid';
			Vroom.ctx.fillStyle = '#fff';
			Vroom.ctx.fillText(dataString, this.contentPos.x, this.contentPos.y + dataStringOffsetTop);

			// Tasks
			var taskOffsetTop = 15;
			var margin = 2;

			var dim = {
				width: (this.contentDim.width / 2) - (margin / 2),
				height: 32
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
				Vroom.ctx.fillStyle = '#333';
				Vroom.ctx.fillRect(pos.x, pos.y, dim.width, dim.height);

				// Title
				Vroom.ctx.textAlign = 'left';
				Vroom.ctx.font = '8px lcd_solid';
				Vroom.ctx.fillStyle = '#fff';
				Vroom.ctx.fillText(this.parent.tasks[i].title, pos.x + 4, pos.y + 10);

				Vroom.ctx.font = '6px lcd_solid';
				// Description
				Vroom.multilineText(this.parent.tasks[i].description, {x: pos.x + 4, y: pos.y + 20}, 7);
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
		this.timeTickCounter++;
	}

	// Events
	if(this.timeTickCounter >= this.eventInterval) {
		this.timeTickCounter = 0;

		var random = Math.floor(Math.random() * this.structure.max) - (this.tasks.length * 25);
		if(random > this.structure.current) {
			console.log('Hello, my name is: ', this.name);
			console.log('BEFORE: ', this.problems);
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
	if(this.tasks.length < 6) {
		// Select random available problem
		var selectedAvailableProblem = Math.floor(Math.random() * this.availableProblems.length);
		console.log('selectedAvailableProblem: ', selectedAvailableProblem);
		// Add problem to list of problems
		this.problems.push(this.availableProblems[selectedAvailableProblem]);
		console.log('problems: ', this.problems);
		var targetProblem = this.problems.length - 1;
		console.log('targetProblem: ', targetProblem);

		// Create and add task for problem
		this.tasks.push(
			new Task({
				parent: this,
				targetProblem: targetProblem,
				travelTime: this.travelTime,
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
	Vroom.deregisterEntity(this.tasks[taskEntity]._id);
	this.tasks[this.tasks.length - 1].onDeregister();
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
};