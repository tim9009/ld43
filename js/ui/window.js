// Constructor
function Window(initArgs) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this, false);
	
	// general
	this.title = initArgs.title || 'Title';
	this.visible = false;
	this.closeButton = initArgs.closeButton || false;
	this.layer = initArgs.layer || 3;

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

	this.updateDerrived();
};

// Update function. Handles all logic for objects related to this class.
Window.prototype.update = function(step) {
	if(this.visible) {
		if(this.closeButton && (Vroom.isAreaClicked(this.closeButtonPos, this.closeButtonDim, false) || Vroom.isKeyPressed(27))) {
			this.hide();
		}
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

		// Title
		Vroom.ctx.font = '8px lcd_solid';
		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.fillText(this.title, this.contentPos.x, this.contentPos.y + 8);

		// Content
		this.renderContent(camera);
	}
};

// Render window content
Window.prototype.renderContent = function(camera) {

};

// Update derived variables
Window.prototype.updateDerrived = function() {
	this.updateBounds();

	// Content
	this.contentPos = {
		x: this.pos.x + this.style.padding.left,
		y: this.pos.y + this.style.padding.top,
	};

	this.contentDim = {
		width: this.dim.width - this.style.padding.left - this.style.padding.right,
		height: this.dim.height - this.style.padding.top - this.style.padding.bottom,
	};

	// Close button
	this.closeButtonPos = {
		x: this.pos.x + this.dim.width - this.closeButtonDim.width,
		y: this.pos.y,
	};
};

Window.prototype.hide = function() {
	this.visible = false;
};

Window.prototype.show = function() {
	this.visible = true;
};