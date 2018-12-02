var map = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
map.init = function() {
	this.layer = 1;
	this.visible = false;
	this.scrollSpeed = 0.25;
	this.inputActive = true;

	this.dim = {
		width: 640,
		height: 360,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};

	this.background = new VroomSprite('sprites/map.png', false);

	this.scrollTriggerSize = 10;

	this.scrollTriggers = {
		top: {
			dim: {
				width: Vroom.dim.width,
				height: this.scrollTriggerSize,
			},
			pos: {
				x: 0,
				y: 0,
			},
		},
		right: {
			dim: {
				width: this.scrollTriggerSize,
				height: Vroom.dim.height,
			},
			pos: {
				x: Vroom.dim.width - this.scrollTriggerSize,
				y: 0,
			},
		},
		bottom: {
			dim: {
				width: Vroom.dim.width,
				height: this.scrollTriggerSize,
			},
			pos: {
				x: 0,
				y: Vroom.dim.height - this.scrollTriggerSize,
			},
		},
		left: {
			dim: {
				width: this.scrollTriggerSize,
				height: Vroom.dim.height,
			},
			pos: {
				x: 0,
				y: 0,
			},
		},
	};

	// Locations
	this.locations = {};

	this.locations.base = new Location({
		name: 'Base',
		travelTime: 0,
		pos: {
			x: Vroom.dim.width - 35,
			y: Vroom.dim.height - 26,
		},
		dim: {
			width: 70,
			height: 52,
		},
		usage: {
			oxygen: 1,
			water: 1,
			power: 2,
		},
		availableProblems: [
			{
				title: 'problem 1',
				description: 'Problem overe here yo',
				usage: {
					oxygen: 2,
				},
				severity: 10,
			},
			{
				title: 'problem 2',
				description: 'Another problem overe here yo',
				usage: {
					oxygen: 3,
					power: 2,
				},
				severity: 30,
			},
		],
		sprite: new VroomSprite('sprites/base.png', false),
	});

	this.locations.thermal = new Location({
		name: 'Thermal',
		travelTime: 3,
		pos: {
			x: 42,
			y: 84,
		},
		dim: {
			width: 44,
			height: 42,
		},
		usage: {
			oxygen: 1,
			water: 1,
			power: 2,
		},
		availableProblems: [
			{
				title: 'problem 1',
				description: 'Problem overe here yo',
				usage: {
					oxygen: 2,
				},
				severity: 10,
			},
			{
				title: 'problem 2',
				description: 'Another problem overe here yo',
				usage: {
					oxygen: 3,
					power: 2,
				},
				severity: 30,
			},
		],
		sprite: new VroomSprite('sprites/thermal.png', false),
	});

	// Register entity
	Vroom.registerEntity(map);

	this.show();
};

// Update function. Handles all logic for objects related to this module.
map.update = function(step) {
	if(this.visible) {
		if(this.inputActive) {
			// Trigger top
			if(Vroom.isKeyPressed(38) || Vroom.isKeyPressed(87) || Vroom.isMouseOverArea(this.scrollTriggers.top.pos, this.scrollTriggers.top.dim, false)) {
				Vroom.activeCamera.pos.y -= this.scrollSpeed;
			}

			// Trigger right
			if(Vroom.isKeyPressed(39) || Vroom.isKeyPressed(68) || Vroom.isMouseOverArea(this.scrollTriggers.right.pos, this.scrollTriggers.right.dim, false)) {
				Vroom.activeCamera.pos.x += this.scrollSpeed;
			}

			// Trigger bottom
			if(Vroom.isKeyPressed(40) || Vroom.isKeyPressed(83) || Vroom.isMouseOverArea(this.scrollTriggers.bottom.pos, this.scrollTriggers.bottom.dim, false)) {
				Vroom.activeCamera.pos.y += this.scrollSpeed;
			}

			// Trigger left
			if(Vroom.isKeyPressed(37) || Vroom.isKeyPressed(65) || Vroom.isMouseOverArea(this.scrollTriggers.left.pos, this.scrollTriggers.left.dim, false)) {
				Vroom.activeCamera.pos.x -= this.scrollSpeed;
			}
		}

		// Lock camera to map edges
		if(Vroom.activeCamera.pos.x < 0) {
			Vroom.activeCamera.pos.x = 0;
		}

		if(Vroom.activeCamera.pos.x + Vroom.dim.width > this.dim.width) {
			Vroom.activeCamera.pos.x = this.dim.width - Vroom.dim.width;
		}

		if(Vroom.activeCamera.pos.y < 0 - generalInterface.dim.height) {
			Vroom.activeCamera.pos.y = 0 - generalInterface.dim.height;
		}

		if(Vroom.activeCamera.pos.y + Vroom.dim.height > this.dim.height) {
			Vroom.activeCamera.pos.y = this.dim.height - Vroom.dim.height;
		}
	}

};

// Render function. Draws all elements related to this module to screen.
map.render = function(camera) {
	if(this.visible) {
		this.background.render(Vroom.getCameraRelativePos(this.pos), this.dim);
	}
};

map.show = function() {
	// Register locations
	for (var location in this.locations) {
		this.locations[location].onRegister();
		Vroom.registerEntity(this.locations[location]);
	}

	this.visible = true;
};

map.hide = function() {
	// Register locations
	for (var location in this.locations) {
		this.locations[location].onDeregister();
		Vroom.deregisterEntity(this.locations[location]._id);
	}

	this.visible = false;
};

map.activateInput = function() {
	this.inputActive = true;
};

map.deactivateInput = function() {
	this.inputActive = false;
};

// Init call
map.init();