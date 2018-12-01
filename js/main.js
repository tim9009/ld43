////////////////////////////// GAME VARIABLES //////////////////////////////
var gameData = {};

var gameState = {
	gameStarted: false,
	time: 0,
	lastTimeUpdate: null,
	timeInterval: 1000,
	levels: {
		oxygen: {
			max: 1000,
			current: 500,
		},
		water: {
			max: 1000,
			current: 500,
		},
		power: {
			max: 1000,
			current: 500,
		},
	},
};

Vroom.mainUpdateLoopExtension = function() {
	if(gameState.gameStarted) {
		if(gameState.lastTimeUpdate === null) {
			gameState.lastTimeUpdate = Date.now();
		}

		if(Date.now() - gameState.lastTimeUpdate >= gameState.timeInterval) {
			gameState.time++;
			gameState.lastTimeUpdate = Date.now();
		}
	}
};