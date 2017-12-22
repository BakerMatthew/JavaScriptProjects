MazeScreens.screens['help'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-help-back').addEventListener(
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
