/* global Main */

Main.screens['controls'] = (function(screen) {
	'use strict';

	var waitForInput = false;
	var buttonToChange = '';

	function prepareHandler(buttonId) {
		waitForInput = true;
		Main.screens['game-play'].unregisterHandler(getKeyEventValue(document.getElementById(buttonId).textContent));
		document.getElementById(buttonId).textContent = '...';
		buttonToChange = buttonId;
	}
	
	function initialize() {
		document.getElementById('id-controls-back').addEventListener( 'click', function() {
			screen.showScreen('main-menu');
		});

		//
		// Movement buttons
		document.getElementById('id-movement-up').addEventListener( 'click', function() {
			prepareHandler('id-movement-up');
		});
		document.getElementById('id-movement-down').addEventListener( 'click', function() {
			prepareHandler('id-movement-down');
		});
		document.getElementById('id-movement-left').addEventListener( 'click', function() {
			prepareHandler('id-movement-left');
		});
		document.getElementById('id-movement-right').addEventListener( 'click', function() {
			prepareHandler('id-movement-right');
		});

		document.getElementById('id-mute-music').addEventListener( 'click', function() {
			prepareHandler('id-mute-music');
		});

		//
		// Shooting buttons
		document.getElementById('id-shooting-up').addEventListener( 'click', function() {
			prepareHandler('id-shooting-up');
		});
		document.getElementById('id-shooting-down').addEventListener( 'click', function() {
			prepareHandler('id-shooting-down');
		});
		document.getElementById('id-shooting-left').addEventListener( 'click', function() {
			prepareHandler('id-shooting-left');
		});
		document.getElementById('id-shooting-right').addEventListener( 'click', function() {
			prepareHandler('id-shooting-right');
		});
		
		document.addEventListener('keydown', function(event) {
			if (waitForInput && event.keyCode != Main.input.KeyEvent.DOM_VK_ESCAPE && event.keyCode != Main.input.KeyEvent.DOM_VK_SPACE) {
				//
				// Don't allow the player to bind movement and shooting to the same key
				if (document.getElementById('id-movement-up').textContent == getKeyEventText(event.keyCode)) {
					document.getElementById('id-movement-up').textContent = '...';
				}
				if (document.getElementById('id-movement-down').textContent == getKeyEventText(event.keyCode)) {
					document.getElementById('id-movement-down').textContent = '...';
				}
				if (document.getElementById('id-movement-left').textContent == getKeyEventText(event.keyCode)) {
					document.getElementById('id-movement-left').textContent = '...';
				}
				if (document.getElementById('id-movement-right').textContent == getKeyEventText(event.keyCode)) {
					document.getElementById('id-movement-right').textContent = '...';
				}
				if (document.getElementById('id-shooting-up').textContent == getKeyEventText(event.keyCode)) {
					document.getElementById('id-shooting-up').textContent = '...';
				}
				if (document.getElementById('id-shooting-down').textContent == getKeyEventText(event.keyCode)) {
					document.getElementById('id-shooting-down').textContent = '...';
				}
				if (document.getElementById('id-shooting-left').textContent == getKeyEventText(event.keyCode)) {
					document.getElementById('id-shooting-left').textContent = '...';
				}
				if (document.getElementById('id-shooting-right').textContent == getKeyEventText(event.keyCode)) {
					document.getElementById('id-shooting-right').textContent = '...';
				}
				if (document.getElementById('id-mute-music').textContent == getKeyEventText(event.keyCode)) {
					document.getElementById('id-mute-music').textContent = '...';
				}
				document.getElementById(buttonToChange).textContent = getKeyEventText(event.keyCode);

				//
				// Register the key
				Main.screens['game-play'].unregisterHandler(getKeyEventValue(document.getElementById(buttonToChange).textContent));
				var pos = '';
				switch (buttonToChange) {
					case 'id-movement-up':
						Main.screens['game-play'].registerMovementUp(event.keyCode);
						pos = 'MovementUp';
						break;
					case 'id-movement-down':
						Main.screens['game-play'].registerMovementDown(event.keyCode);
						pos = 'MovementDown';
						break;
					case 'id-movement-left':
						Main.screens['game-play'].registerMovementLeft(event.keyCode);
						pos = 'MovementLeft';
						break;
					case 'id-movement-right':
						Main.screens['game-play'].registerMovementRight(event.keyCode);
						pos = 'MovementRight';
						break;
					case 'id-shooting-up':
						Main.screens['game-play'].registerShootingUp(event.keyCode);
						pos = 'ShootingUp';
						break;
					case 'id-shooting-down':
						Main.screens['game-play'].registerShootingDown(event.keyCode);
						pos = 'ShootingDown';
						break;
					case 'id-shooting-left':
						Main.screens['game-play'].registerShootingLeft(event.keyCode);
						pos = 'ShootingLeft';
						break;
					case 'id-shooting-right':
						Main.screens['game-play'].registerShootingRight(event.keyCode);
						pos = 'ShootingRight';
						break;
					case 'id-mute-music':
						Main.screens['game-play'].registerMuteMusic(event.keyCode);
						pos = 'MuteMusic';
						break;
				}
				Main.screens['game-play'].updateJson('controls', pos, getKeyEventText(event.keyCode));
				buttonToChange = '';
				waitForInput = false;
			}
		});
	}
	
	function run() {
		var controls = Main.screens['game-play'].getControls();

		document.getElementById('id-movement-up').textContent = controls.MovementUp;
		document.getElementById('id-movement-down').textContent = controls.MovementDown;
		document.getElementById('id-movement-left').textContent = controls.MovementLeft;
		document.getElementById('id-movement-right').textContent = controls.MovementRight;

		document.getElementById('id-mute-music').textContent = controls.MuteMusic;

		document.getElementById('id-shooting-up').textContent = controls.ShootingUp;
		document.getElementById('id-shooting-down').textContent = controls.ShootingDown;
		document.getElementById('id-shooting-left').textContent = controls.ShootingLeft;
		document.getElementById('id-shooting-right').textContent = controls.ShootingRight;
	}
	
	return {
		initialize: initialize,
		run: run
	};
}(Main.screen));
