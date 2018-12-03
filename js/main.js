////////////////////////////// GAME VARIABLES //////////////////////////////
var gameData = {
	clickSound : new VroomSound('sounds/click_1.wav'),
	closeSound : new VroomSound('sounds/close_1.wav'),
	errorSound : new VroomSound('sounds/close_1.wav'),
	problemSound : new VroomSound('sounds/failure_1.wav'),
	successSound : new VroomSound('sounds/success_1.wav'),
	deathSound : new VroomSound('sounds/death_1.wav'),
};

gameData.clickSound.loadBuffer();
gameData.clickSound.gain = 0.1;

gameData.closeSound.loadBuffer();
gameData.closeSound.gain = 0.4;

gameData.errorSound.loadBuffer();
gameData.errorSound.gain = 0.4;

gameData.problemSound.loadBuffer();
gameData.problemSound.gain = 0.2;

gameData.successSound.loadBuffer();
gameData.successSound.gain = 0.1;

gameData.deathSound.loadBuffer();
gameData.deathSound.gain = 0.1;

var gameState = {
	gameLost: false,
	gameWon: false,
	gameStarted: false,
	time: 14 * 24,
	lastTimeUpdate: null,
	timeInterval: 1000,
	timeTick: false,
	levels: {
		oxygen: {
			max: 1000,
			current: 1000,
		},
		water: {
			max: 1000,
			current: 1000,
		},
		power: {
			max: 1000,
			current: 1000,
		},
	},
};

function restart() {
	gameState = {
		gameLost: false,
		gameWon: false,
		gameStarted: false,
		time: 14 * 24,
		lastTimeUpdate: null,
		timeInterval: 1000,
		timeTick: false,
		levels: {
			oxygen: {
				max: 1000,
				current: 1000,
			},
			water: {
				max: 1000,
				current: 1000,
			},
			power: {
				max: 1000,
				current: 1000,
			},
		}
	};

	map.hide();
	map.init();
	map.show();

	Vroom.activeCamera.pos = {
		x: Vroom.dim.width / 2,
		y: Vroom.dim.height / 2,
	};

	gameState.gameStarted = true;
}

Vroom.mainUpdateLoopExtension = function() {
	if(gameState.gameStarted && !gameState.gameWon && !gameState.gameLost) {
		// Check fo win/lose
		if(gameState.levels.oxygen.current <= 0, gameState.levels.water.current <= 0, gameState.levels.power.current <= 0) {
			gameState.gameLost = true;
		}

		if(gameState.time === 0) {
			gameState.gameWon = true;
		}

		gameState.timeTick = false;
		if(gameState.lastTimeUpdate === null) {
			gameState.lastTimeUpdate = Date.now();
		}

		// Timestep
		if(Date.now() - gameState.lastTimeUpdate >= gameState.timeInterval) {
			gameState.time--;
			gameState.timeTick = true;
			gameState.lastTimeUpdate = Date.now();

			for(var location in map.locations) {
				// If locaiton is operative
				if(map.locations[location].structure.current > 0) {

					var production = map.locations[location].getTotalProduction();
					var usage = map.locations[location].getTotalUsage();

					// Produce
					gameState.levels.oxygen.current += production.oxygen;
					gameState.levels.water.current += production.water;
					gameState.levels.power.current += production.power;

					// Use
					gameState.levels.oxygen.current -= usage.oxygen;
					gameState.levels.water.current -= usage.water;
					gameState.levels.power.current -= usage.power;
				}
			}
		}

		// Limit to 0
		if(gameState.levels.oxygen.current < 0) {
			gameState.levels.oxygen.current = 0;
		}

		if(gameState.levels.water.current < 0) {
			gameState.levels.water.current = 0;
		}

		if(gameState.levels.power.current < 0) {
			gameState.levels.power.current = 0;
		}


		// Limit to max
		if(gameState.levels.oxygen.current > gameState.levels.oxygen.max) {
			gameState.levels.oxygen.current = gameState.levels.oxygen.max;
		}

		if(gameState.levels.water.current > gameState.levels.water.max) {
			gameState.levels.water.current = gameState.levels.water.max;
		}

		if(gameState.levels.power.current > gameState.levels.power.max) {
			gameState.levels.power.current = gameState.levels.power.max;
		}
	}
};