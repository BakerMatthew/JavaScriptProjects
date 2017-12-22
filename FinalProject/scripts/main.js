/* globals Main */

Main.screens['game-play'] = (function(renderer, components, input, model) {
	'use strict';
	var prevTime = null;
	var cancelNextRequest = false;
	var	frameTimes = [];
	var jsonData;
	var	textFPS = components.Text({
			text : 'fps',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.025, y : 0.975 }
		});
	var textFloor = components.Text({
			text : 'Floor: ',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.025, y : 0.0 }
		});
	var textHealth = components.Text({
			text : 'Health: ',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.025, y : 0.05 }
		});
	var textBombs = components.Text({
			text : 'Bombs: ',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.025, y : 0.10 }
		});
	var textKeys = components.Text({
			text : 'Keys: ',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.025, y : 0.15 }
		});
	var textCoins = components.Text({
			text : 'Coins: ',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.025, y : 0.20 }
		});
	var textMuteMusic = components.Text({
			text : 'Mute Music: ',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.025, y : 0.10 } // y: 0.25
		});
	var textMovement = components.Text({
			text : 'Movement: ',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.025, y : 0.61 }
		});
	var textMoveUp = components.Text({
			text : 'Up: ',
			font : '14px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.05, y : 0.64 }
		});
	var textMoveDown = components.Text({
			text : 'Down: ',
			font : '14px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.05, y : 0.67 }
		});
	var textMoveLeft = components.Text({
			text : 'Left: ',
			font : '14px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.05, y : 0.70 }
		});
	var textMoveRight = components.Text({
			text : 'Right: ',
			font : '14px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.05, y : 0.73 }
		});
	var textShooting = components.Text({
			text : 'Shooting: ',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.025, y : 0.81 }
		});
	var textShootUp = components.Text({
			text : 'Up: ',
			font : '14px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.05, y : 0.84 }
		});
	var textShootDown = components.Text({
			text : 'Down: ',
			font : '14px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.05, y : 0.87 }
		});
	var textShootLeft = components.Text({
			text : 'Left: ',
			font : '14px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.05, y : 0.90 }
		});
	var textShootRight = components.Text({
			text : 'Right: ',
			font : '14px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			position : { x : 1.05, y : 0.93 }
		});
	var bombCount = 0;
	var keyCount = 0;
	var coinCount = 0;
	var	keyboard = input.Keyboard();
	var	inputIds = {};

	//
	// Process any captured input
	function processInput(timeDifference) {
		keyboard.update(timeDifference);
	}

	//
	// Update the Game
	function update(timeDifference) {
		model.update(timeDifference);
	}

	//
	// Render the Game
	function render(timeDifference) {
		var averageTime = 0;
		var	fps = 0;
		var healthCount = model.getHealthCount();
		var floorCount = model.getFloorCount();

		renderer.core.clearCanvas();
		model.render(Main.renderer);

		//
		// Show FPS over last several frames
		frameTimes.push(timeDifference);
		if (frameTimes.length > 50) {
			frameTimes = frameTimes.slice(1);
			averageTime = frameTimes.reduce(function(a, b) { return a + b; }) / frameTimes.length;
			fps = Math.floor((1 / averageTime) * 10000) / 10;
			textFPS.text = 'fps: ' + fps;
			renderer.Text.render(textFPS);
		}

		//
		// Show item counts
		// textBombs.text = 'Bombs: ' + bombCount;
		// textKeys.text = 'Keys: ' + keyCount;
		// textCoins.text = 'Coins: ' + coinCount;
		textFloor.text = 'Floor: ' + floorCount;
		renderer.Text.render(textFloor);
		renderer.Text.render(textHealth);
		var heartImage = '';
		if (healthCount === 0) {
			heartImage = 'heart-zero';
		} else if (healthCount === 1) {
			heartImage = 'heart-one';
		} else if (healthCount === 2) {
			heartImage = 'heart-two';
		} else if (healthCount === 3) {
			heartImage = 'heart-three';
		} else if (healthCount === 4) {
			heartImage = 'heart-four';
		} else if (healthCount === 5) {
			heartImage = 'heart-five';
		} else if (healthCount === 6) {
			heartImage = 'heart-six';
		}
		renderer.core.drawImage(
			Main.assets[heartImage],
			0, 0,
			Main.assets[heartImage].width, Main.assets[heartImage].height,
			1.115, 0.05,
			0.1, 0.03
		);
		// renderer.Text.render(textBombs);
		// renderer.Text.render(textKeys);
		// renderer.Text.render(textCoins);

		renderer.Text.render(textMuteMusic);

		//
		// Show movement controls
		renderer.Text.render(textMovement);
		renderer.Text.render(textMoveUp);
		renderer.Text.render(textMoveDown);
		renderer.Text.render(textMoveLeft);
		renderer.Text.render(textMoveRight);

		//
		// Show shooting controls
		renderer.Text.render(textShooting);
		renderer.Text.render(textShootUp);
		renderer.Text.render(textShootDown);
		renderer.Text.render(textShootLeft);
		renderer.Text.render(textShootRight);
	}

	//
	// A game loop so we can show some animation with this main
	function gameLoop(currTime) {
		if (!prevTime) {
			prevTime = currTime
		}
		var timeDifference = currTime - prevTime;
		prevTime = currTime;

		processInput(timeDifference);
		update(timeDifference);
		render(timeDifference);
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
		
	}

	function registerMuteMusic(key) {
		textMuteMusic.text = 'Mute Music: ' + getKeyEventText(key);
		inputIds[key] = keyboard.registerHandler(function(timeDifference) {
				if (Main.assets['dungeon-music-explore'].paused) {
					Main.assets['dungeon-music-explore'].play();
				} else {
					Main.assets['dungeon-music-explore'].pause();
				}
			},
			key, false, undefined, undefined
		);
	}

	function registerBack(key) {
		inputIds[key] = keyboard.registerHandler(function(timeDifference) {
				prevTime = null;
				cancelNextRequest = true;
				Main.screen.showScreen('main-menu');
			},
			key, false, undefined, undefined
		);
	}

	//
	// Functions to register character movement controls
	function registerMovementUp(key) {
		textMoveUp.text = 'Up: ' + getKeyEventText(key);
		inputIds[key] = keyboard.registerHandler(function(timeDifference) {
				model.moveCharacterUp(timeDifference);
			},
			key, true, undefined, undefined, 0
		);
	}
	function registerMovementDown(key) {
		textMoveDown.text = 'Down: ' + getKeyEventText(key);
		inputIds[key] = keyboard.registerHandler(function(timeDifference) {
				model.moveCharacterDown(timeDifference);
			},
			key, true, undefined, undefined, 1
		);
	}
	function registerMovementLeft(key) {
		textMoveLeft.text = 'Left: ' + getKeyEventText(key);
		inputIds[key] = keyboard.registerHandler(function(timeDifference) {
				model.moveCharacterLeft(timeDifference);
			},
			key, true, undefined, undefined, 2
		);
	}
	function registerMovementRight(key) {
		textMoveRight.text = 'Right: ' + getKeyEventText(key);
		inputIds[key] = keyboard.registerHandler(function(timeDifference) {
				model.moveCharacterRight(timeDifference);
			},
			key, true, undefined, undefined, 3
		);
	}

	//
	// Functions to register character shooting controls
	function registerShootingUp(key) {
		textShootUp.text = 'Up: ' + getKeyEventText(key);
		inputIds[key] = keyboard.registerHandler(function() {
				model.shootBulletUp();
			},
			key, true, model.getShootingSpeed(), 'U', undefined
		);
	}
	function registerShootingDown(key) {
		textShootDown.text = 'Down: ' + getKeyEventText(key);
		inputIds[key] = keyboard.registerHandler(function() {
				model.shootBulletDown();
			},
			key, true, model.getShootingSpeed(), 'D', undefined
		);
	}
	function registerShootingLeft(key) {
		textShootLeft.text = 'Left: ' + getKeyEventText(key);
		inputIds[key] = keyboard.registerHandler(function() {
				model.shootBulletLeft();
			},
			key, true, model.getShootingSpeed(), 'L', undefined
		);
	}
	function registerShootingRight(key) {
		textShootRight.text = 'Right: ' + getKeyEventText(key);
		inputIds[key] = keyboard.registerHandler(function() {
				model.shootBulletRight();
			},
			key, true, model.getShootingSpeed(), 'R', undefined
		);
	}

	function unregisterHandler(key) {
		keyboard.unregisterHandler(key, inputIds[key]);
		delete inputIds[key];
	}

	function updateJson(entry, pos, data) {
		jsonData[entry][pos] = data;
		jsonWriteData(jsonData);
	}

	//
	// Register the keyboard inputs with the given json object
	function registerInputs(json) {
		jsonData = json;
		registerBack(getKeyEventValue(jsonData['controls']['Back']));
		registerMuteMusic(getKeyEventValue(jsonData['controls']['MuteMusic']));

		//
		// Character movement inputs
		registerMovementUp(getKeyEventValue(jsonData['controls']['MovementUp']));
		registerMovementDown(getKeyEventValue(jsonData['controls']['MovementDown']));
		registerMovementLeft(getKeyEventValue(jsonData['controls']['MovementLeft']));
		registerMovementRight(getKeyEventValue(jsonData['controls']['MovementRight']));

		//
		// Character shooting inputs
		registerShootingUp(getKeyEventValue(jsonData['controls']['ShootingUp']));
		registerShootingDown(getKeyEventValue(jsonData['controls']['ShootingDown']));
		registerShootingLeft(getKeyEventValue(jsonData['controls']['ShootingLeft']));
		registerShootingRight(getKeyEventValue(jsonData['controls']['ShootingRight']));
	}

	//
	// Returns stored scores
	function getHighScores() {
		return jsonData.scores;
	}

	//
	// Returns stored controls
	function getControls() {
		return jsonData.controls;
	}

	//
	// Update score
	function updateScore() {
		var index = -1;
		for (let i = 0; i < jsonData.scores.length; i++) {
			if (jsonData.scores[i].name === 'You') {
				index = i;
				break;
			}
		}
		var currScore = model.getFloorCount();
		if (index === -1) {
			jsonData.scores.push({
					name: 'You',
					score: currScore
				});
		} else {
			jsonData.scores[index].score = Math.max(currScore, jsonData.scores[index].score);;
		}
	}

	//
	// Update shooting speed
	function updateShooting() {
		registerShootingUp(getKeyEventValue(jsonData['controls']['ShootingUp']));
		registerShootingDown(getKeyEventValue(jsonData['controls']['ShootingDown']));
		registerShootingLeft(getKeyEventValue(jsonData['controls']['ShootingLeft']));
		registerShootingRight(getKeyEventValue(jsonData['controls']['ShootingRight']));
	}
	
	//
	// Entry point of the program
	function initialize() {
		renderer.core.initialize();

		textFPS.height = renderer.core.measureTextHeight(textFPS);
		textFPS.width = renderer.core.measureTextWidth(textFPS);

		Main.assets['shooting-explosion-sound'].volume = 0.25;
		Main.assets['shooting-sound'].volume = 0.10;
		Main.assets['player-damage-sound'].volume = 0.175;
		Main.assets['player-item-sound'].volume = 0.15;
		Main.assets['player-item-powerup-sound'].volume = 0.175;

		Main.assets['dungeon-music-explore'].loop = true;
		Main.assets['dungeon-music-explore'].volume = 0.15;
		Main.assets['dungeon-music-explore'].play();

		model.initialize();

		//
		// Gets the controls and high scores from json_data.txt
		jsonGetData();

		requestAnimationFrame(gameLoop);
	}

	function run() {
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}

	function restartGame() {
		updateScore();
		jsonWriteData(jsonData);
	}

	return {
		initialize: initialize,
		run: run,
		restartGame: restartGame,
		registerMuteMusic: registerMuteMusic,
		registerBack: registerBack,
		registerMovementUp: registerMovementUp,
		registerMovementDown: registerMovementDown,
		registerMovementLeft: registerMovementLeft,
		registerMovementRight: registerMovementRight,
		registerShootingUp: registerShootingUp,
		registerShootingDown: registerShootingDown,
		registerShootingLeft: registerShootingLeft,
		registerShootingRight: registerShootingRight,
		unregisterHandler: unregisterHandler,
		registerInputs: registerInputs,
		getHighScores: getHighScores,
		getControls: getControls,
		updateJson: updateJson,
		updateShooting: updateShooting,
	};

}(Main.renderer, Main.components, Main.input, Main.model));
