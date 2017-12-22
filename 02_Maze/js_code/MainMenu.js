MazeScreens.screens['main-menu'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {game.showScreen('game-play'); });
		
		document.getElementById('id-controls').addEventListener(
			'click',
			function() {game.showScreen('controls'); });
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { game.showScreen('high-scores'); });
		
		document.getElementById('id-help').addEventListener(
			'click',
			function() { game.showScreen('help'); });
		
		document.getElementById('id-about').addEventListener(
			'click',
			function() { game.showScreen('about'); });
	}
	
	function run() {
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MazeScreens.game));
