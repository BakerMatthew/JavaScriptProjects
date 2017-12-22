/* globals Main, console, require */

Main = {
	input: {},
	components: {},
	renderer: {},
	assets: {},
	screens: {}
};

//
// Only this file is specified in the index.html
Main.loader = (function() {
	'use strict';
	var scriptOrder = [{
			scripts: ['jsonIO'],
			message: 'jsonIO loaded',
			onComplete: null
		}, {
			scripts: ['Input/Keyboard'],
			message: 'Inputs loaded',
			onComplete: null
		}, {
			scripts: ['Components/Text'],
			message: 'Component text loaded',
			onComplete: null
		}, {
			scripts: ['Components/EnemyUnit'],
			message: 'Component enemy unit loaded',
			onComplete: null
		}, {
			scripts: ['Components/Room'],
			message: 'Component room loaded',
			onComplete: null
		}, {
			scripts: ['Components/PlayerCharacter'],
			message: 'Component PlayerCharacter loaded',
			onComplete: null
		}, {
			scripts: ['Components/Bullet'],
			message: 'Component Bullet loaded',
			onComplete: null
		}, {
			scripts: ['Components/AnimatedSprite'],
			message: 'Component animated sprite loaded',
			onComplete: null
		}, {
			scripts: ['Components/Items'],
			message: 'Component Items loaded',
			onComplete: null
		}, {
			scripts: ['Rendering/core'],
			message: 'Rendering core loaded',
			onComplete: null
		}, {
			scripts: ['Rendering/Text'],
			message: 'Rendering text loaded',
			onComplete: null
		}, {
			scripts: ['Rendering/Room'],
			message: 'Rendering room loaded',
			onComplete: null
		}, {
			scripts: ['Rendering/PlayerCharacter'],
			message: 'Rendering PlayerCharacter loaded',
			onComplete: null
		}, {
			scripts: ['Rendering/EnemyUnit'],
			message: 'Rendering EnemyUnit loaded',
			onComplete: null
		}, {
			scripts: ['Rendering/Bullet'],
			message: 'Rendering Bullet loaded',
			onComplete: null
		}, {
			scripts: ['Rendering/AnimatedSprite'],
			message: 'Rendering animated sprite loaded',
			onComplete: null
		}, {
			scripts: ['roomGenerator'],
			message: 'Room Generator loaded',
			onComplete: null
		}, {
			scripts: ['Random'],
			message: 'Random loaded',
			onComplete: null
		}, {
			scripts: ['ParticleSystem'],
			message: 'Particle System loaded',
			onComplete: null
		}, {
			scripts: ['Screens/screen'],
			message: 'Screens screen loaded',
			onComplete: null
		}, {
			scripts: ['Screens/mainMenu'],
			message: 'Screens main menu loaded',
			onComplete: null
		}, {
			scripts: ['Screens/about'],
			message: 'Screens about loaded',
			onComplete: null
		}, {
			scripts: ['Screens/controls'],
			message: 'Screens controls loaded',
			onComplete: null
		}, {
			scripts: ['Screens/highScores'],
			message: 'Screens highScores loaded',
			onComplete: null
		}, {
			scripts: ['model'],
			message: 'Model loaded',
			onComplete: null
		}, {
			scripts: ['main'],
			message: 'Main loaded',
			onComplete: null
		}],
		assetOrder = [{
			// Source: https://opengameart.org/content/50-rpg-sound-effects
			key: 'shooting-sound',
			source: '/assets/sound/sfx_damage_hit2.wav'
		}, {
			// Source: https://opengameart.org/content/50-rpg-sound-effects
			key: 'shooting-explosion-sound',
			source: '/assets/sound/sfx_exp_shortest_soft9.wav'
		}, {
			// Source: https://opengameart.org/content/50-rpg-sound-effects
			key: 'player-damage-sound',
			source: '/assets/sound/sfx_sounds_damage1.wav'
		}, {
			// Source: https://opengameart.org/content/50-rpg-sound-effects
			key: 'player-item-sound',
			source: '/assets/sound/sfx_sounds_powerup6.wav'
		}, {
			// Source: https://opengameart.org/content/50-rpg-sound-effects
			key: 'player-item-powerup-sound',
			source: '/assets/sound/sfx_sounds_powerup1.wav'
		}, {
			// Source: https://opengameart.org/content/dungeon-of-agony
			key: 'dungeon-music-explore',
			source: '/assets/sound/Dungeon_of_Agony.mp3'
		}, {
			// Source: https://opengameart.org/content/block-ninja-2d-sprites
			key: 'animated-player-character',
			source: '/assets/images/player-character.png'
		}, {
			// Source: https://opengameart.org/content/energy-ball
			key: 'image-energy-ball-particle',
			source: '/assets/images/energy-ball-particle.png'
		}, {
			// Source: https://opengameart.org/content/energy-ball
			key: 'image-enemy-energy-ball-particle',
			source: '/assets/images/enemy-energy-ball-particle.png'
		}, {
			// Source: https://opengameart.org/content/energy-ball
			key: 'animated-energy-ball',
			source: '/assets/images/energy-ball.png'
		}, {
			// Source: https://opengameart.org/content/energy-ball
			key: 'animated-enemy-energy-ball',
			source: '/assets/images/enemy-energy-ball.png'
		}, {
			// Source: https://opengameart.org/content/cute-creature-sprites
			key: 'animated-orange-bee',
			source: '/assets/images/orange-bee.png'
		}, {
			// Source: https://opengameart.org/content/cute-creature-sprites
			key: 'animated-red-bee',
			source: '/assets/images/red-bee.png'
		}, {
			// Source: https://opengameart.org/content/a-bald-eagle
			key: 'animated-eagle',
			source: '/assets/images/bald-eagle-flap.png'
		}, {
			// Source: https://opengameart.org/content/animated-ghost
			key: 'animated-ghost',
			source: '/assets/images/ghost.png'
		}, {
			// Source: https://opengameart.org/content/grumpy-land-monster-sprite-sheets
			key: 'animated-grumpy',
			source: '/assets/images/grumpy.png'
		}, {
			// Source: https://opengameart.org/content/heart-health-bar
			key: 'heart-zero',
			source: '/assets/images/heart-0.png'
		}, {
			// Source: https://opengameart.org/content/heart-health-bar
			key: 'heart-one',
			source: '/assets/images/heart-1.png'
		}, {
			// Source: https://opengameart.org/content/heart-health-bar
			key: 'heart-two',
			source: '/assets/images/heart-2.png'
		}, {
			// Source: https://opengameart.org/content/heart-health-bar
			key: 'heart-three',
			source: '/assets/images/heart-3.png'
		}, {
			// Source: https://opengameart.org/content/heart-health-bar
			key: 'heart-four',
			source: '/assets/images/heart-4.png'
		}, {
			// Source: https://opengameart.org/content/heart-health-bar
			key: 'heart-five',
			source: '/assets/images/heart-5.png'
		}, {
			// Source: https://opengameart.org/content/heart-health-bar
			key: 'heart-six',
			source: '/assets/images/heart-6.png'
		}, {
			// Source: https://opengameart.org/content/rotating-crystal-animation-8-step
			key: 'image-red-crystal',
			source: '/assets/images/image-red-crystal.png'
		}, {
			// Source: https://opengameart.org/content/rotating-crystal-animation-8-step
			key: 'image-grey-crystal',
			source: '/assets/images/image-grey-crystal.png'
		}, {
			// Source: https://opengameart.org/content/rotating-crystal-animation-8-step
			key: 'image-blue-crystal',
			source: '/assets/images/image-blue-crystal.png'
		}, {
			// Source: https://opengameart.org/content/bevouliin-horns-skull-sprite-sheets
			key: 'animated-skull',
			source: '/assets/images/skull.png'
		}, {
			// Source: https://opengameart.org/content/bevouliin-horns-skull-sprite-sheets
			key: 'animated-red-skull',
			source: '/assets/images/red-skull.png'
		}, {
			// Source: https://opengameart.org/content/heart-health-bar
			key: 'half-heart',
			source: '/assets/images/half-heart.png'
		}, {
			// Source: https://opengameart.org/content/heart-health-bar
			key: 'full-heart',
			source: '/assets/images/full-heart.png'
		}, {
			// Source: http://www.dumbmanex.com/files/BossWorm_Artpack
			key: 'animated-sandworm',
			source: '/assets/images/sandworm.png'
		}, {
			// Source: https://opengameart.org/content/block-ninja-2d-sprites
			key: 'image-powerup-damage',
			source: '/assets/images/image-powerup-damage.png'
		}, {
			// Source: https://opengameart.org/content/energy-ball
			key: 'animated-energy-ball-damage',
			source: '/assets/images/energy-ball-damage.png'
		}, {
			// Source: https://opengameart.org/content/block-ninja-2d-sprites
			key: 'animated-player-character-damage',
			source: '/assets/images/player-character-damage.png'
		}, {
			// Source: https://opengameart.org/content/dungeon-stairs
			key: 'image-stairs',
			source: '/assets/images/stairs.png'
		}, {
			// Source: https://opengameart.org/content/block-ninja-2d-sprites
			key: 'image-powerup-speed',
			source: '/assets/images/image-powerup-speed.png'
		}, {
			// Source: https://opengameart.org/content/block-ninja-2d-sprites
			key: 'animated-player-character-speed',
			source: '/assets/images/player-character-speed.png'
		}, {
			// Source: https://opengameart.org/content/block-ninja-2d-sprites
			key: 'animated-player-character-damage-speed',
			source: '/assets/images/player-character-damage-speed.png'
		}];

	//
	// Helper function used to load scripts in the order specified by the
	// 'scripts' parameter.  'scripts' expects an array of objects with
	// the following format...
	//	{
	//		scripts: [script1, script2, ...],
	//		message: 'Console message displayed after loading is complete',
	//		onComplete: function to call when loading is complete, may be null
	//	}
	function loadScripts(scripts, onComplete) {
		var entry = 0;
		//
		// When we run out of things to load, that is when we call onComplete.
		if (scripts.length > 0) {
			entry = scripts[0];
			require(entry.scripts, function() {
				console.log(entry.message);
				if (entry.onComplete) {
					entry.onComplete();
				}
				scripts.splice(0, 1);
				loadScripts(scripts, onComplete);
			});
		} else {
			onComplete();
		}
	}

	//
	// Helper function used to load assets in the order specified by the
	// 'assets' parameter.  'assets' expects an array of objects with
	// the following format...
	//	{
	//		key: 'asset-1',
	//		source: 'asset/asset.png'
	//	}
	//
	// onSuccess is invoked per asset as: onSuccess(key, asset)
	// onError is invoked per asset as: onError(error)
	// onComplete is invoked once per 'assets' array as: onComplete()
	function loadAssets(assets, onSuccess, onError, onComplete) {
		var entry = 0;
		//
		// When we run out of things to load, we call onComplete.
		if (assets.length > 0) {
			entry = assets[0];
			loadAsset(entry.source,
				function(asset) {
					onSuccess(entry, asset);
					assets.splice(0, 1);
					loadAssets(assets, onSuccess, onError, onComplete);
				},
				function(error) {
					onError(error);
					assets.splice(0, 1);
					loadAssets(assets, onSuccess, onError, onComplete);
				});
		} else {
			onComplete();
		}
	}

	//
	// This function is used to asynchronously load image and audio assets.
	// On success the asset is provided through the onSuccess callback.
	// Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
	function loadAsset(source, onSuccess, onError) {
		var xhr = new XMLHttpRequest(),
			asset = null,
			fileExtension = source.substr(source.lastIndexOf('.') + 1);	// Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

		if (fileExtension) {
			xhr.open('GET', source, true);
			xhr.responseType = 'blob';

			xhr.onload = function() {
				if (xhr.status === 200) {
					if (fileExtension === 'png' || fileExtension === 'jpg') {
						asset = new Image();
					} else if (fileExtension === 'mp3' || fileExtension === 'wav') {
						asset = new Audio();
					} else {
						if (onError) { onError('Unknown file extension: ' + fileExtension); }
					}
					asset.onload = function() {
						window.URL.revokeObjectURL(asset.src);
					};
					asset.src = window.URL.createObjectURL(xhr.response);
					if (onSuccess) { onSuccess(asset); }
				} else {
					if (onError) { onError('Failed to retrieve: ' + source); }
				}
			};
		} else {
			if (onError) { onError('Unknown file extension: ' + fileExtension); }
		}

		xhr.send();
	}

	
	//
	// Called when all the scripts are loaded, it kicks off the main app
	function mainComplete() {
		console.log('Everything is loaded');
		

		Main.screen.initialize();
		// Main.main.initialize();
	}

	//
	// Start with loading the assets, then the scripts
	console.log('Starting to dynamically load project assets');
	loadAssets(assetOrder,
		function(source, asset) {	// Store it on success
			Main.assets[source.key] = asset;
		},
		function(error) {
			console.log(error);
		},
		function() {
			console.log('All assets loaded');
			console.log('Starting to dynamically load project scripts');
			loadScripts(scriptOrder, mainComplete);
		}
	);

}());
