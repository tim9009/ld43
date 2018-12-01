////////////////////////////// GAME VARIABLES //////////////////////////////
var gameData = {};

var gameState = {
	gameLost: false,
	gameWon: false,
	gameStarted: false,
	time: 0,
	lastTimeUpdate: null,
	timeInterval: 1000,
	timeTick: false,
	levels: {
		oxygen: {
			max: 1000,
			current: 500,
			usage: 2,
		},
		water: {
			max: 1000,
			current: 500,
			usage: 2,
		},
		power: {
			max: 1000,
			current: 500,
			usage: 2,
		},
	},
};

Vroom.mainUpdateLoopExtension = function() {
	if(gameState.gameStarted) {
		gameState.timeTick = false;
		if(gameState.lastTimeUpdate === null) {
			gameState.lastTimeUpdate = Date.now();
		}

		// Timestep
		if(Date.now() - gameState.lastTimeUpdate >= gameState.timeInterval) {
			gameState.time++;
			gameState.timeTick = true;
			gameState.lastTimeUpdate = Date.now();

			// Use Oxygen
			gameState.levels.oxygen.current -= gameState.levels.oxygen.usage;

			// Use Water
			gameState.levels.water.current -= gameState.levels.water.usage;

			// Use Power
			gameState.levels.power.current -= gameState.levels.power.usage;
		}
	}
};