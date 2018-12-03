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

	this.scrollSoundInterval = 0;
	this.lastScrollSoundPlayback = Date.now();
	this.scrollSound = new VroomSound('sounds/scroll.wav');
	this.scrollSound.loadBuffer();
	this.scrollSound.gain = 0.1;

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
		travelTime: 1,
		pos: {
			x: Vroom.dim.width - 35,
			y: Vroom.dim.height - 26,
		},
		dim: {
			width: 70,
			height: 52,
		},
		usage: {
			oxygen: 3,
			water: 3,
			power: 2,
		},
		production: {
			oxygen: 1,
			water: 1,
			power: 1,
		},
		availableProblems: [
			{
				title: 'Minor Oxygen Leak',
				description: 'Microscopic fractures in the dome\nhas been detected.',
				usage: {
					oxygen: 2,
				},
				risk: 20,
				type: 'engineering',
				timeToCompleteWork: 3,
			},
			{
				title: 'Moderate Oxygen Leak',
				description: 'One of the airlocks are not\nsealing properly.',
				usage: {
					oxygen: 2,
					power: 1,
				},
				risk: 30,
				type: 'engineering',
				timeToCompleteWork: 6,
			},
			{
				title: 'Severe Oxygen Leak',
				description: 'The dome is failing! This needs to\nbe fixed immediately!',
				usage: {
					oxygen: 4,
					power: 2,
				},
				risk: 65,
				type: 'engineering',
				timeToCompleteWork: 12,
			},
			{
				title: 'Cracked plumbing',
				description: 'Water pressure is down. We are\nprobably losing water somewhere.',
				production: {
					water: -1,
				},
				risk: 35,
				type: 'engineering',
				timeToCompleteWork: 8,
			},
			{
				title: 'Electrical glitches',
				description: 'We have been experiencing some\n minor electrical glitches lately.',
				production: {
					power: -1,
				},
				risk: 25,
				type: 'electronics',
				timeToCompleteWork: 8,
			},
			{
				title: 'Mold growth',
				description: 'There has been reported some\nmold growth in the air ducts.',
				production: {
					air: -1,
				},
				risk: 25,
				type: 'biology',
				timeToCompleteWork: 5,
			}
		],
		sprite: new VroomSprite('sprites/base.png', false),
	});

	this.locations.thermal = new Location({
		name: 'Thermal',
		travelTime: 5,
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
			power: 1,
		},
		production: {
			oxygen: 0,
			water: 0,
			power: 4,
		},
		availableProblems: [
			{
				title: 'Inconcistent generation',
				description: 'There may be something wrong.\nIt is worth checking out.',
				production: {
					power: -1,
				},
				risk: 20,
				type: 'electronics',
				timeToCompleteWork: 4,
			},
			{
				title: 'Faulty airlock',
				description: 'One of the airlocks are not\nsealing properly.',
				usage: {
					oxygen: 2,
					power: 1,
				},
				risk: 30,
				type: 'engineering',
				timeToCompleteWork: 6,
			},
			{
				title: 'Remote access failing',
				description: 'Hopefully you just have to\nrestart the computers.',
				usage: {
					power: 2,
				},
				risk: 15,
				type: 'engineering',
				timeToCompleteWork: 6,
			},
			{
				title: 'Broken conduit',
				description: 'One of the power conduits seem\nto be broken!',
				production: {
					power: -2,
				},
				risk: 55,
				type: 'engineering',
				timeToCompleteWork: 10,
			},
			{
				title: 'Clogged vents',
				description: 'Some biomass has massed on the\nvents causing overheating.',
				production: {
					power: -1,
				},
				risk: 45,
				type: 'biology',
				timeToCompleteWork: 8,
			},
		],
		sprite: new VroomSprite('sprites/thermal.png', false),
	});

	this.locations.solar = new Location({
		name: 'Solar Array',
		travelTime: 3,
		pos: {
			x: 470,
			y: 250,
		},
		dim: {
			width: 56,
			height: 50,
		},
		usage: {
			oxygen: 0,
			water: 0,
			power: 1,
		},
		production: {
			oxygen: 0,
			water: 0,
			power: 3,
		},
		availableProblems: [
			{
				title: 'Inconcistent generation',
				description: 'There may be something wrong.\nIt is worth checking out.',
				production: {
					power: -1,
				},
				risk: 20,
				type: 'electronics',
				timeToCompleteWork: 4,
			},
			{
				title: 'Remote access failing',
				description: 'Hopefully you just have to\nrestart the computers.',
				usage: {
					power: 1,
				},
				risk: 15,
				type: 'engineering',
				timeToCompleteWork: 6,
			},
			{
				title: 'Broken panel',
				description: 'One of the panels is draining power!',
				usage: {
					power: 2,
				},
				risk: 15,
				type: 'engineering',
				timeToCompleteWork: 6,
			},
			{
				title: 'Broken conduit',
				description: 'One of the power conduits seem\nto be broken!',
				production: {
					power: -2,
				},
				risk: 55,
				type: 'engineering',
				timeToCompleteWork: 10,
			},
			{
				title: 'Clogged vents',
				description: 'Some biomass has massed on the\nvents causing overheating.',
				production: {
					power: -1,
				},
				risk: 45,
				type: 'biology',
				timeToCompleteWork: 8,
			},
		],
		sprite: new VroomSprite('sprites/solar.png', false),
	});

	this.locations.waterTreatment = new Location({
		name: 'Water Treatment',
		travelTime: 6,
		pos: {
			x: 150,
			y: 250,
		},
		dim: {
			width: 50,
			height: 38,
		},
		usage: {
			oxygen: 1,
			water: 1,
			power: 3,
		},
		production: {
			oxygen: 1,
			water: 4,
			power: 0,
		},
		availableProblems: [
			{
				title: 'Inconcistent generation',
				description: 'There may be something wrong.\nIt is worth checking out.',
				production: {
					water: -1,
				},
				risk: 20,
				type: 'electronics',
				timeToCompleteWork: 4,
			},
			{
				title: 'Remote access failing',
				description: 'Hopefully you just have to\nrestart the computers.',
				usage: {
					power: 2,
				},
				risk: 15,
				type: 'engineering',
				timeToCompleteWork: 6,
			},
			{
				title: 'Broken pipes',
				description: 'One of the water pipes seem\nto be broken!',
				usage: {
					water: 2,
				},
				risk: 55,
				type: 'engineering',
				timeToCompleteWork: 10,
			},
			{
				title: 'Destroyed pipes',
				description: 'Serious problems with the water pipes.',
				usage: {
					water: 3,
				},
				risk: 65,
				type: 'engineering',
				timeToCompleteWork: 12,
			},
			{
				title: 'Clogged vents',
				description: 'Some biomass has massed on the\nvents causing overheating.',
				production: {
					water: -1,
				},
				risk: 45,
				type: 'biology',
				timeToCompleteWork: 8,
			},
			{
				title: 'Minor contaminants',
				description: 'Some minor contaminants detected in\nthe water.',
				production: {
					water: -1,
				},
				risk: 35,
				type: 'biology',
				timeToCompleteWork: 4,
			},
			{
				title: 'Serious contamination',
				description: 'A strange strain of bacteria is\n multiplying fast!',
				production: {
					water: -3,
				},
				risk: 65,
				type: 'biology',
				timeToCompleteWork: 12,
			},
		],
		sprite: new VroomSprite('sprites/water-treatment.png', false),
	});

	// People
	this.people = [];

	this.people.push(new Person({
		name: 'Gerald Stevens',
		stats: {
			health: 100,
			biology: 6,
			electronics: 3,
			engineering: 2,
		},
	}));

	this.people.push(new Person({
		name: 'Adriana Lutz',
		stats: {
			health: 100,
			biology: 2,
			electronics: 6,
			engineering: 3,
		},
	}));

	this.people.push(new Person({
		name: 'Trevor Garcia',
		stats: {
			health: 100,
			biology: 2,
			electronics: 3,
			engineering: 1,
		},
	}));

	this.people.push(new Person({
		name: 'Averi Owen',
		stats: {
			health: 100,
			biology: 1,
			electronics: 3,
			engineering: 2,
		},
	}));

	this.people.push(new Person({
		name: 'Kevin Eriksen',
		stats: {
			health: 100,
			biology: 4,
			electronics: 1,
			engineering: 2,
		},
	}));

	this.people.push(new Person({
		name: 'Kaylah Horn',
		stats: {
			health: 100,
			biology: 2,
			electronics: 3,
			engineering: 6,
		},
	}));

	this.people.push(new Person({
		name: 'Ayden Rowe',
		stats: {
			health: 100,
			biology: 2,
			electronics: 1,
			engineering: 4,
		},
	}));

	// Register entity
	Vroom.registerEntity(map);

	this.show();
};

// Update function. Handles all logic for objects related to this module.
map.update = function(step) {
	if(this.visible) {
		if(this.inputActive) {
			// Check for shift
			var speed = this.scrollSpeed;
			var moving = false;

			if(Vroom.isKeyPressed(16)) {
				speed = this.scrollSpeed * 2;
			}

			// Trigger top
			if(Vroom.isKeyPressed(38) || Vroom.isKeyPressed(87) || Vroom.isMouseOverArea(this.scrollTriggers.top.pos, this.scrollTriggers.top.dim, false)) {
				Vroom.activeCamera.pos.y -= speed;
				moving = true;
			}

			// Trigger right
			if(Vroom.isKeyPressed(39) || Vroom.isKeyPressed(68) || Vroom.isMouseOverArea(this.scrollTriggers.right.pos, this.scrollTriggers.right.dim, false)) {
				Vroom.activeCamera.pos.x += speed;
				moving = true;
			}

			// Trigger bottom
			if(Vroom.isKeyPressed(40) || Vroom.isKeyPressed(83) || Vroom.isMouseOverArea(this.scrollTriggers.bottom.pos, this.scrollTriggers.bottom.dim, false)) {
				Vroom.activeCamera.pos.y += speed;
				moving = true;
			}

			// Trigger left
			if(Vroom.isKeyPressed(37) || Vroom.isKeyPressed(65) || Vroom.isMouseOverArea(this.scrollTriggers.left.pos, this.scrollTriggers.left.dim, false)) {
				Vroom.activeCamera.pos.x -= speed;
				moving = true;
			}

			// Play scroll
			if(moving) {
				if(this.scrollSound.playing) {
					this.lastScrollSoundPlayback = Date.now();
				} else if(Date.now() - this.lastScrollSoundPlayback >= this.scrollSoundInterval) {
					this.scrollSound.play();
				}
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

	// Register people
	for (var i = 0; i < this.people.length; i++) {
		Vroom.registerEntity(this.people[i]);
	}

	this.visible = true;
};

map.hide = function() {
	// Deregsiter locations
	for (var location in this.locations) {
		this.locations[location].onDeregister();
		Vroom.deregisterEntity(this.locations[location]._id);
	}

	// Deregister people
	for (var i = 0; i < this.people.length; i++) {
		Vroom.deregisterEntity(this.people[i]._id);
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