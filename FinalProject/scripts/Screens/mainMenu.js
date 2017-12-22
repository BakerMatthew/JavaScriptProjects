/* global Main */

Main.screens['main-menu'] = (function(screen) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-play-game').addEventListener('click', function() {
			screen.showScreen('game-play');
		});

		document.getElementById('id-restart-game').addEventListener('click', function() {
			Main.model.restartGame();
			screen.showScreen('game-play');
		});
		
		document.getElementById('id-controls').addEventListener('click', function() {
			screen.showScreen('controls');
		});

		document.getElementById('id-high-scores').addEventListener('click', function() {
			screen.showScreen('high-scores');
		});
		
		document.getElementById('id-about').addEventListener('click', function() {
			screen.showScreen('about');
		});
	}
	
	function run() {
	}
	
	return {
		initialize: initialize,
		run: run
	};
}(Main.screen));