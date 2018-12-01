// Constructor
function Location(initArgs) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this, false);
	
	// General
	this.name = initArgs.name || 'No name';
	this.layer = 2;
	this.tasks = [];
	this.active = false;

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
	for (var entity in this.windows) {
		Vroom.registerEntity(this.windows[entity]);
	}
};

Location.prototype.onDeregister = function() {
	for (var entity in this.windows) {
		this.windows[entity].hide();
		Vroom.registerEntity(this.windows[entity]);
	}
};