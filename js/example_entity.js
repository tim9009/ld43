var entityName = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
entityName.init = function(physicsEnabled, physicsEntityType, physicsCollisionType) {
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

	this.attributeOne = "Hello World";

	// Register entity
	Vroom.registerEntity(entityName);
};

// Collision event function. Is called every tick the entity is colliding.
entityName.onCollision = function(target) {
	
};

// Update function. Handles all logic for objects related to this module.
entityName.update = function(step) {

};

// Render function. Draws all elements related to this module to screen.
entityName.render = function(camera) {
	Vroom.ctx.fillStyle = 'red';
	Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);
};

// Init call
entityName.init();