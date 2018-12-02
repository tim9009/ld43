////////////////////////////// GAME VARIABLES //////////////////////////////
var gameData = {};

var gameState = {
	gameLost: false,
	gameWon: false,
	gameStarted: false,
	time: 0,
	lastTimeUpdate: null,
	timeInterval: 100,
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