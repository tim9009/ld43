// Constructor
function Task(initArgs) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this, false);
	
	this.name = initArgs.name || 'No name';
	this.started = false;
	this.timeToComplete = initArgs.timeToComplete || 0;
	this.progress = 0;
	this.assignedPeople = initArgs.assignedPeople || [];

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

	this.vel = {
		x: 0,
		y: 0,
	};
};

// Update function. Handles all logic for objects related to this class.
Task.prototype.update = function(step) {

};

// Render function. Draws all elements related to this module to screen.
Task.prototype.render = function(camera) {
	Vroom.ctx.fillStyle = 'red';
	Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);
};