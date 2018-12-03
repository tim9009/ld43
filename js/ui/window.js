// Constructor
function Window(initArgs) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this, false);
	
	// General
	this.parent = initArgs.parent || null;
	this.layer = initArgs.layer || 3;
	this.title = initArgs.title || 'Title';
	this.visible = false;
	this.closeButton = initArgs.closeButton || false;
	this.cancelButton = initArgs.cancelButton || false;
	this.confirmButton = initArgs.confirmButton || false;
	this.confirmText = initArgs.confirmText || 'Confirm';
	this.inputActive = true;

	// Hooks
	this.openHook = initArgs.openHook || function() {};
	this.closeHook = initArgs.closeHook || function() {};
	this.preConfirmHook = initArgs.preConfirmHook || function() { return true; };
	this.confirmHook = initArgs.confirmHook || function() {};
	this.preCancelHook = initArgs.preCancelHook || function() {return true; };
	this.cancelHook = initArgs.cancelHook || function() {};
	this.updateHook = initArgs.updateHook || function() {};
	this.renderHook = initArgs.renderHook || function() {};

	// Dim
	this.dim = initArgs.dim || null;
	if(initArgs.dim) {
		this.dim.width = initArgs.dim.width || 0;
		this.dim.height = initArgs.dim.height || 0;
	} else {
		this.dim = {};
		this.dim.width = 0;
		this.dim.height = 0;
	}

	// Pos
	this.pos = initArgs.pos || null;
	if(initArgs.pos) {
		this.pos.x = initArgs.pos.x || 0;
		this.pos.y = initArgs.pos.y || 0;
	} else {
		this.pos = {};
		this.pos.x = 0;
		this.pos.y = 0;
	}
	
	// Style
	this.style = {};
	if(initArgs.style) {
		// Set values based on initArgs
		this.style.padding = initArgs.style.padding || {};
		this.style.padding.top = initArgs.style.padding.top || 0;
		this.style.padding.right = initArgs.style.padding.right || initArgs.style.padding.top || 0;
		this.style.padding.bottom = initArgs.style.padding.bottom || initArgs.style.padding.top || 0;
		this.style.padding.left = initArgs.style.padding.left || initArgs.style.padding.right || 0;
	} else {
		// Set default values
		this.style.padding = {};
		this.style.padding.top = 0;
		this.style.padding.right = 0;
		this.style.padding.bottom = 0;
		this.style.padding.left = 0;
	}

	// Custom
	this.state = initArgs.state || {};

	this.init();
}

// Set correct prototype and costructor
Window.prototype = Object.create(VroomEntity.prototype);
Window.prototype.constructor = Window;

// Init function
Window.prototype.init = function() {
	this.contentPos = {
		x: 0,
		y: 0,
	};

	this.contentDim = {
		width: 0,
		height: 0,
	};

	this.closeButtonPos = {
		x: 0,
		y: 0,
	};

	this.closeButtonDim = {
		width: 10,
		height: 10,
	};

	this.confirmButtonPos = {
		x: 0,
		y: 0,
	};

	this.confirmButtonDim = {
		width: 0,
		height: 0,
	};

	this.cancelButtonPos = {
		x: 0,
		y: 0,
	};

	this.cancelButtonDim = {
		width: 0,
		height: 0,
	};

	this.updateDerrived();
};

// Update function. Handles all logic for objects related to this class.
Window.prototype.update = function(step) {
	if(this.visible && this.inputActive) {
		// Close button
		if(this.closeButton && (Vroom.isAreaClicked(this.closeButtonPos, this.closeButtonDim, false) || Vroom.isKeyPressed(27))) {
			this.hide();
			this.cancelHook();
			gameData.closeSound.play();
		}

		// Cancel button
		if(this.cancelButton && (Vroom.isAreaClicked(this.cancelButtonPos, this.cancelButtonDim, false) || Vroom.isKeyPressed(27))) {
			if(this.preCancelHook()) {
				this.hide();
				this.cancelHook();
				gameData.closeSound.play();
			}
		}

		// Confirm button
		if(this.confirmButton && Vroom.isAreaClicked(this.confirmButtonPos, this.confirmButtonDim, false)) {
			if(this.preConfirmHook()) {
				this.hide();
				this.confirmHook();
				gameData.clickSound.play();
			}
		}

		this.updateHook(step);
	}
};

// Render function. Draws all elements related to this module to screen.
Window.prototype.render = function(camera) {
	if(this.visible) {
		// Window
		Vroom.ctx.textAlign = 'left';
		Vroom.ctx.fillStyle = '#627F89';
		Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);

		// Close button
		if(this.closeButton) {
			Vroom.ctx.font = '7px lcd_solid';
			Vroom.ctx.fillStyle = '#fff';
			Vroom.ctx.fillRect(this.closeButtonPos.x, this.closeButtonPos.y, this.closeButtonDim.width, this.closeButtonDim.height);
			Vroom.ctx.fillStyle = '#627F89';
			Vroom.ctx.fillText('X', this.closeButtonPos.x + 3, this.closeButtonPos.y + 8);
		}

		// Confirm button
		if(this.confirmButton) {
			Vroom.ctx.font = '7px lcd_solid';
			Vroom.ctx.fillStyle = '#fff';
			Vroom.ctx.fillRect(this.confirmButtonPos.x, this.confirmButtonPos.y, this.confirmButtonDim.width, this.confirmButtonDim.height);
			Vroom.ctx.fillStyle = '#627F89';
			Vroom.ctx.textAlign = 'center';
			Vroom.ctx.fillText(this.confirmText, this.confirmButtonPos.x + (this.confirmButtonDim.width / 2), this.confirmButtonPos.y + 10);
		}

		// Cancel button
		if(this.cancelButton) {
			Vroom.ctx.font = '7px lcd_solid';
			Vroom.ctx.fillStyle = '#fff';
			Vroom.ctx.fillRect(this.cancelButtonPos.x, this.cancelButtonPos.y, this.cancelButtonDim.width, this.cancelButtonDim.height);
			Vroom.ctx.fillStyle = '#627F89';
			Vroom.ctx.textAlign = 'center';
			Vroom.ctx.fillText('Cancel', this.cancelButtonPos.x + (this.cancelButtonDim.width / 2), this.cancelButtonPos.y + 10);
		}

		// Title
		Vroom.ctx.textAlign = 'left';
		Vroom.ctx.font = '8px lcd_solid';
		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.fillText(this.title, this.contentPos.x, this.pos.y + this.style.padding.top + 8);

		// Content
		this.renderHook(camera);
	}
};

// Update derived variables
Window.prototype.updateDerrived = function() {
	this.updateBounds();

	var contentOffsetTop = 12;

	// Content
	this.contentPos = {
		x: this.pos.x + this.style.padding.left,
		y: this.pos.y + this.style.padding.top + contentOffsetTop,
	};

	this.contentDim = {
		width: this.dim.width - this.style.padding.left - this.style.padding.right,
		height: this.dim.height - this.style.padding.top - this.style.padding.bottom - contentOffsetTop,
	};

	// Close button
	this.closeButtonPos = {
		x: this.pos.x + this.dim.width - this.closeButtonDim.width,
		y: this.pos.y,
	};

	//Confirm button
	this.confirmButtonDim = {
		width: (5 * this.confirmText.length) + 4,
		height: 15,
	};

	this.confirmButtonPos = {
		x: this.contentPos.x + this.contentDim.width - this.confirmButtonDim.width,
		y: this.contentPos.y + this.contentDim.height,
	};

	// Cancel button
	this.cancelButtonDim = {
		width: (5 * 'Cancel'.length) + 4,
		height: 15,
	};

	if(this.cancelButton) {
		this.cancelButtonPos = {
			x: this.contentPos.x + this.contentDim.width - this.cancelButtonDim.width - this.confirmButtonDim.width - 2,
			y: this.contentPos.y + this.contentDim.height,
		};
	} else {
		this.cancelButtonPos = this.closeButtonPos;
	}
};

Window.prototype.hide = function() {
	this.visible = false;
	this.closeHook();
};

Window.prototype.show = function() {
	this.visible = true;
	this.openHook();
};

Window.prototype.activateInput = function() {
	this.inputActive = true;
};

Window.prototype.deactivateInput = function() {
	this.inputActive = false;
};