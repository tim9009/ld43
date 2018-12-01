var generalInterface = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
generalInterface.init = function() {
	this.layer = 3;

	this.dim = {
		width: Vroom.dim.width,
		height: 14,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};

	// Register entity
	Vroom.registerEntity(generalInterface);
};

// Collision event function. Is called every tick the entity is colliding.

// Update function. Handles all logic for objects related to this module.
generalInterface.update = function(step) {

};

// Render function. Draws all elements related to this module to screen.
generalInterface.render = function(camera) {
	// Top bar
	Vroom.ctx.fillStyle = '#627F89';
	Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);

	// Text settings
	Vroom.ctx.fillStyle = '#fff';
	Vroom.ctx.font = '8px lcd_solid';

	// Time counter
	Vroom.ctx.textAlign = 'end';

	var days = String(Math.floor(gameState.time / 24));
	if(days.length < 2) {
		days = '0' + days;
	}

	var hours = String(gameState.time % 24);
	if(hours.length < 2) {
		hours = '0' + hours;
	}

	var timeString = 'D:' + days + ' H:' + hours;
	Vroom.ctx.fillText(timeString, this.pos.x + this.dim.width - 4, this.pos.y + 10);

	// Resources
	Vroom.ctx.textAlign = 'start';
	var resourceString = 'O2:' + Math.floor((gameState.levels.oxygen.current * 100) / gameState.levels.oxygen.max) + '% H20:' + Math.floor((gameState.levels.water.current * 100) / gameState.levels.water.max) + '% POWER:' + Math.floor((gameState.levels.power.current * 100) / gameState.levels.power.max) + '%';
	Vroom.ctx.fillText(resourceString, this.pos.x + 4, this.pos.y + 10);

};

// Init call
generalInterface.init();