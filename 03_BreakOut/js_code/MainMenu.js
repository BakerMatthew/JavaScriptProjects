GameScreens.screens['main-menu'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-new-game').addEventListener('click', function() {
			game.showScreen('game-play');
		});

		document.getElementById('id-restart-game').addEventListener('click', function() {
			GameScreens.screens['game-play'].restartGame();
			game.showScreen('game-play');
		});
		
		document.getElementById('id-high-scores').addEventListener('click', function() {
			game.showScreen('high-scores');
		});
		
		document.getElementById('id-credits').addEventListener('click', function() {
			game.showScreen('credits');
		});
	}
	
	function run() {
	}
	
	return {
		initialize: initialize,
		run: run
	};
}(GameScreens.game));
