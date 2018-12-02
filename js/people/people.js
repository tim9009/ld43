// Constructor
function Person(initArgs) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this, false);
	this.name = initArgs.name || 'No name';
	
	this.stats = initArgs.stats || {};
	if(!this.stats) {
		this.health = 100;
		this.science = 0;
		this.engineering = 0;
		this.military = 0;
	}

	this.layer = 3;

	this.dim = {
		width: 0,
		height: 0,
	};

	this.pos = {
		x: 0,
		y: 0,
	};

	this.init();
}

// Set correct prototype and costructor
Person.prototype = Object.create(VroomEntity.prototype);
Person.prototype.constructor = Person;

// Init function
Person.prototype.init = function() {
	this.updateBounds();
};

// Update function. Handles all logic for objects related to this class.
Person.prototype.update = function(step) {
	
};

// Render function. Draws all elements related to this module to screen.
Person.prototype.render = function(camera) {
	
};