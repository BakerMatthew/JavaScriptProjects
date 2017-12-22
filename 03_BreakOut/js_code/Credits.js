GameScreens.screens['credits'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-credits-back').addEventListener( 'click', function() {
			game.showScreen('main-menu');
		});
		
		document.addEventListener('keydown', function(event) {
			if (event.keyCode == KeyEvent.DOM_VK_ESCAPE) {
				event.preventDefault();
				game.showScreen('main-menu');
			}
		});
	}
	
	function run() {
	}
	
	return {
		initialize: initialize,
		run: run
	};
}(GameScreens.game));
