var generalInterface = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
generalInterface.init = function() {
	this.layer = 4;

	this.dim = {
		width: Vroom.dim.width,
		height: 14,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};

	this.popupMessageActive = false;
	this.popupMessageDisplayDuration = 3000;
	this.popupMessageDisplayStartTime = 0;
	this.popupMessages = [];

	// Register entity
	Vroom.registerEntity(generalInterface);
};

// Collision event function. Is called every tick the entity is colliding.

// Update function. Handles all logic for objects related to this module.
generalInterface.update = function(step) {
	if(gameState.gameWon || gameState.gameLost) {
		if(Vroom.mouseState.clicked) {
			restart();
		}
	}

	// Show new messages
	if(this.popupMessages.length > 0 && !this.popupMessageActive) {
		this.popupMessageActive = true;
		this.popupMessageDisplayStartTime = Date.now();
	}

	// Delete message if duration has passed
	if(this.popupMessageActive && Date.now() - this.popupMessageDisplayStartTime >= this.popupMessageDisplayDuration) {
		this.popupMessages.splice(0, 1);
		this.popupMessageActive = false;
	}
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
	var oxygenPercentage = Math.floor((gameState.levels.oxygen.current * 100) / gameState.levels.oxygen.max);
	var waterPercentage = Math.floor((gameState.levels.water.current * 100) / gameState.levels.water.max);
	var powerPercentage = Math.floor((gameState.levels.power.current * 100) / gameState.levels.power.max);

	Vroom.ctx.textAlign = 'start';

	// Oxygen
	Vroom.ctx.fillStyle = '#fff';
	if(oxygenPercentage <= 25) {
		Vroom.ctx.fillStyle = '#B8000A';
	}else
	if(oxygenPercentage <= 50) {
		Vroom.ctx.fillStyle = '#CC8F06';
	}
	Vroom.ctx.fillText('Air:' + oxygenPercentage + '%', this.pos.x + 4, this.pos.y + 10);

	// Water
	Vroom.ctx.fillStyle = '#fff';
	if(waterPercentage <= 25) {
		Vroom.ctx.fillStyle = '#B8000A';
	}else
	if(waterPercentage <= 50) {
		Vroom.ctx.fillStyle = '#CC8F06';
	}
	Vroom.ctx.fillText('Water:' + waterPercentage + '%', this.pos.x + 4 + 45, this.pos.y + 10);

	// Power
	Vroom.ctx.fillStyle = '#fff';
	if(powerPercentage <= 25) {
		Vroom.ctx.fillStyle = '#B8000A';
	}else
	if(powerPercentage <= 50) {
		Vroom.ctx.fillStyle = '#CC8F06';
	}
	Vroom.ctx.fillText('Power:' + powerPercentage + '%', this.pos.x + 4 + 100, this.pos.y + 10);

	// Popup messages
	if(this.popupMessageActive) {
		var popupDim = {
			width: 150,
			height: 20,
		};

		var popupPos = {
			x: 5,
			y: Vroom.dim.height - popupDim.height - 5,
		};

		Vroom.ctx.fillStyle = '#333';
		Vroom.ctx.fillRect(popupPos.x, popupPos.y, popupDim.width, popupDim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.font = '18px lcd_solid';
		Vroom.multilineText('!', {x: popupPos.x, y: popupPos.y + 17}, 7);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.font = '5px lcd_solid';
		Vroom.multilineText(this.popupMessages[0].text, {x: popupPos.x + 15, y: popupPos.y + (popupDim.height / 2) + 2}, 7);
	}

	// Win screen
	if(gameState.gameWon || gameState.gameLost) {
		var dim = {
			width: 200,
			height: 120,
		};

		var pos = {
			x: (Vroom.dim.width / 2) - (dim.width / 2),
			y: (Vroom.dim.height / 2) - (dim.height / 2) + 10,
		};

		Vroom.ctx.fillStyle = '#627F89';
		Vroom.ctx.fillRect(pos.x, pos.y, dim.width, dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.font = '8px lcd_solid';

		Vroom.ctx.textAlign = 'center';

		if(gameState.gameWon) {
			Vroom.multilineText('Well done!\n\nYou managed to keep this colony\ntogether until help could arrive.\nThe sacrifice of those who died will\nalways be remembered.', {x: pos.x + (dim.width / 2), y: pos.y + 20}, 10);
		} else
		if(gameState.gameLost) {
			Vroom.multilineText('What a tragedy!\n\nHelp arrived only to find the colony\nin ruins. Every single colonist dead.\nSuch a waste.', {x: pos.x + (dim.width / 2), y: pos.y + 20}, 10);
		}


		Vroom.ctx.fillText('[Click to restart]', pos.x + (dim.width / 2), pos.y + dim.height - 20);
	}
};

generalInterface.addPopupMessage = function(initArgs) {
	initArgs = initArgs || {};

	this.popupMessages.push({
		text: initArgs.text || 'No text',
	});
};

// Init call
generalInterface.init();