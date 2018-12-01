////////////////////////////// START ENGINE //////////////////////////////
function start() {
	var startPos = {
		x: Vroom.dim.width / 2,
		y: Vroom.dim.height / 2,
	};

	Vroom.activateCamera(Vroom.createCamera(startPos.x, startPos.y, 1, 'both', 0.007));

	// Disable image smooting
	var imageSmoothingEnabled = false;
	Vroom.ctx.mozImageSmoothingEnabled = imageSmoothingEnabled;
	Vroom.ctx.webkitImageSmoothingEnabled = imageSmoothingEnabled;
	Vroom.ctx.msImageSmoothingEnabled = imageSmoothingEnabled;
	Vroom.ctx.imageSmoothingEnabled = imageSmoothingEnabled;

	// Vroooom vrooom!
	Vroom.run();

	gameState.gameStarted = true;

	// Set focus on window to make the game work when played in an iFrame
	window.focus();
}

start();

// Wait for things to load.
//setTimeout(start, 1000);