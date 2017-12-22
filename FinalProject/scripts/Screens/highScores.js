/* global Main */

Main.screens['high-scores'] = (function(screen) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener( 'click', function() { 
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
		let highScores = Main.screens['game-play'].getHighScores();
		document.getElementById('high-scores-span').innerHTML = '';

		//
		// Use a selection sort for the scores
		for (let i = 0; i < highScores.length - 1; i++) {
			let maxIndex = i;
			for (let j = i + 1; j < highScores.length; j++) {
				if (highScores[j]['score'] > highScores[maxIndex]['score']) {
					maxIndex = j;
				}
			}
			if (maxIndex != i) {
				let tmp = highScores[i];
				highScores[i] = highScores[maxIndex];
				highScores[maxIndex] = tmp;
			}
		}


		for (let i = 0; i < highScores.length && i < 5; i++) {
			document.getElementById('high-scores-span').innerHTML += highScores[i]['name'] + ':&nbsp;' + highScores[i]['score'] + '<br>';
		}
		for (let i = highScores.length; i < 5; i++) {
			document.getElementById('high-scores-span').innerHTML += 0 + '<br>';
		}
	}
	
	return {
		initialize: initialize,
		run: run
	};
}(Main.screen));
