// Constructor
function className(initArgs) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this, physicsEnabled, physicsEntityType, physicsCollisionType);
	
	this.attributeOne = "Hello World";

	this.init();
}

// Set correct prototype and costructor
className.prototype = Object.create(VroomEntity.prototype);
className.prototype.constructor = className;

// Init function
className.prototype.init = function() {
	this.layer = 1;

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
className.prototype.update = function(step) {

};

// Render function. Draws all elements related to this module to screen.
className.prototype.render = function(camera) {
	Vroom.ctx.fillStyle = 'red';
	Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);
};