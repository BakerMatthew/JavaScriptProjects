/* global Main */

Main.screens['about'] = (function(screen) {
	'use strict';

	
	function initialize() {
		document.getElementById('id-about-back').addEventListener( 'click', function() {
			screen.showScreen('main-menu');
		});
		
		document.addEventListener('keydown', function(event) {
			if (event.keyCode == Main.input.KeyEvent.DOM_VK_ESCAPE) {
				event.preventDefault();
				screen.showScreen('main-menu');
			}
		});
	}
	
	function run() {
	}
	
	return {
		initialize: initialize,
		run: run
	};
}(Main.screen));
