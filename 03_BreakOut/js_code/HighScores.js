GameScreens.screens['high-scores'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener( 'click', function() { 
			game.showScreen('main-menu');
		});

		document.getElementById('id-high-scores-reset').addEventListener( 'click', function() { 
			GameScreens.persistence.resetScores();
			GameScreens.persistence.updateHighScoreList();
		});

		document.addEventListener('keydown', function(event) {
			if (event.keyCode == KeyEvent.DOM_VK_ESCAPE) {
				event.preventDefault();
				game.showScreen('main-menu');
			}
		});
	}
	
	function run() {
		GameScreens.persistence.updateHighScoreList();
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(GameScreens.game));

GameScreens.persistence = (function () {
	'use strict';
	let highScores = [];
	let previousScores = localStorage.getItem('MyGame.highScores');
	if (previousScores !== null) {
		highScores = JSON.parse(previousScores);
	}

	function add(score) {
		addAndSortHighScore(score);
		if (highScores.length > 5) {
			removeLowestScore();
		}
		localStorage['MyGame.highScores'] = JSON.stringify(highScores);
		updateHighScoreList();
	}

	function addAndSortHighScore(score) {
		if (score > highScores[0]) {
			highScores.splice(0, 0, score);
		} else {
			let scoreAdded = false;
			for (let i = 0; i < highScores.length - 1; i++) {
				if (score > highScores[i+1]) {
					highScores.splice(i+1, 0, score);
					scoreAdded = true;
					break;
				}
			}
			if (!scoreAdded) {
				highScores.push(score);
			}
		}
	}

	function updateHighScoreList() {
		document.getElementById('high-scores-span').innerHTML = '';
		for (let i = 0; i < highScores.length; i++) {
			document.getElementById('high-scores-span').innerHTML += highScores[i] + '<br>';
		}
	}

	function removeLowestScore() {
		highScores.pop();
		localStorage['MyGame.highScores'] = JSON.stringify(highScores);
	}

	function resetScores() {
		highScores.length = 0;
		for (let i = 0; i < 5; i++) {
			highScores.push(0);
		}
		localStorage['MyGame.highScores'] = JSON.stringify(highScores);
	}

	function report() {
		console.log('-- High Scores --');
		for (let score = 0; score < highScores.length; score++) {
			console.log(highScores[score]);
		}
	}

	return {
		add: add,
		report: report,
		updateHighScoreList: updateHighScoreList,
		resetScores: resetScores
	};
}());