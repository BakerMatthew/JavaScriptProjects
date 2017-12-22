MazeScreens.screens['high-scores'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}
	
	function run() {
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MazeScreens.game));
