//------------------------------------------------------------------
//
// Defines an EnemyUnit component.  An EnemyUnit contains an animated sprite.
// The sprite is defined as:
//	{
//		type: ,						// Enemy unit type
//		size: { width: , height: },	// In world coordinates
//		center: { x: , y: },		// In world coordinates
//		speed: { current: , max: }, // World units per second
//		spriteInfo: { sheet: , count: , time: [] },
//		creatureInfo: { health: , power: }
//	}
//
//------------------------------------------------------------------
Main.components.EnemyUnit = function(spec) {
	'use strict';
	var sprite = null;
	var timer = 500;
	var pattern = 1;
	var triggerRate;
	if (spec.type === 'ghost') {
		triggerRate = 750;
	} else if (spec.type === 'grumpy') {
		triggerRate = spec.spriteInfo.time[0] + spec.spriteInfo.time[1];
		timer = 0;
	} else if (spec.type === 'sandworm') {
		triggerRate = spec.spriteInfo.time[0] + spec.spriteInfo.time[1] + spec.spriteInfo.time[2] + spec.spriteInfo.time[3] + spec.spriteInfo.time[4] + spec.spriteInfo.time[5] + spec.spriteInfo.time[6] + spec.spriteInfo.time[7] + spec.spriteInfo.time[8] + spec.spriteInfo.time[9] + spec.spriteInfo.time[10] + spec.spriteInfo.time[11];
		timer = 0;
	}
	var skullTracking = false;
	var	that = {
			get type() { return spec.type; },
			get center() { return sprite.center; },
			get sprite() { return sprite; },
			get size() { return spec.size; },
			get speed() { return spec.speed; },
			get creatureInfo() { return spec.creatureInfo; }
		};

	function getDistance(a, b) {
		return Math.hypot(Math.abs(a.x - b.x), Math.abs(a.y - b.y))
	}

	//
	// Update for bee enemy
	function beeUpdate(timeDifference) {
		let dir = Math.floor(Math.random() * (5 - 1 + 0)) + 0;
		
		//
		// Choose a random direction to move in
		if (dir === 0) {
			// up
			spec.speed.current.y -= spec.speed.max.y * timeDifference / 250;
		} else if (dir === 1) {
			// down
			spec.speed.current.y += spec.speed.max.y * timeDifference / 250;
		} else if (dir === 2) {
			// left
			spec.speed.current.x -= spec.speed.max.x * timeDifference / 250;
		} else if (dir === 3) {
			// right
			spec.speed.current.x += spec.speed.max.x * timeDifference / 250;
		}

		//
		// Track onto player character when in range
		let playerCharacterLocation = Main.model.getPlayerCharacterLocation();
		let distance = getDistance(spec.center, playerCharacterLocation);

		if (distance < 0.25) {
			let xDist = playerCharacterLocation.x - spec.center.x;
			let yDist = playerCharacterLocation.y - spec.center.y;

			if (xDist > 0) {
				spec.speed.current.x += spec.speed.max.x * timeDifference / 300;
			}
			if (xDist < 0) {
				spec.speed.current.x -= spec.speed.max.x * timeDifference / 300;
			}
			if (yDist > 0) {
				spec.speed.current.y += spec.speed.max.y * timeDifference / 300;
			}
			if (yDist < 0) {
				spec.speed.current.y -= spec.speed.max.y * timeDifference / 300;
			}
		}

		//
		// Slowly reduce movement
		if (spec.speed.current.y < 0) {
			spec.speed.current.y += spec.speed.max.y * timeDifference / 4500;
		}
		if (spec.speed.current.y > 0) {
			spec.speed.current.y -= spec.speed.max.y * timeDifference / 4500;
		}
		if (spec.speed.current.x < 0) {
			spec.speed.current.x += spec.speed.max.x * timeDifference / 4500;
		}
		if (spec.speed.current.x > 0) {
			spec.speed.current.x -= spec.speed.max.x * timeDifference / 4500;
		}
	}

	//
	// Update for red bee enemy
	function redBeeUpdate(timeDifference) {
		let dir = Math.floor(Math.random() * (5 - 1 + 0)) + 0;
		
		//
		// Choose a random direction to move in
		if (dir === 0) {
			// up
			spec.speed.current.y -= spec.speed.max.y * timeDifference / 250;
		} else if (dir === 1) {
			// down
			spec.speed.current.y += spec.speed.max.y * timeDifference / 250;
		} else if (dir === 2) {
			// left
			spec.speed.current.x -= spec.speed.max.x * timeDifference / 250;
		} else if (dir === 3) {
			// right
			spec.speed.current.x += spec.speed.max.x * timeDifference / 250;
		}

		//
		// Track onto player character
		let playerCharacterLocation = Main.model.getPlayerCharacterLocation();
		let distance = getDistance(spec.center, playerCharacterLocation);

		let xDist = playerCharacterLocation.x - spec.center.x;
		let yDist = playerCharacterLocation.y - spec.center.y;

		if (xDist > 0) {
			spec.speed.current.x += spec.speed.max.x * timeDifference / 300;
		}
		if (xDist < 0) {
			spec.speed.current.x -= spec.speed.max.x * timeDifference / 300;
		}
		if (yDist > 0) {
			spec.speed.current.y += spec.speed.max.y * timeDifference / 300;
		}
		if (yDist < 0) {
			spec.speed.current.y -= spec.speed.max.y * timeDifference / 300;
		}

		//
		// Slowly reduce movement
		if (spec.speed.current.y < 0) {
			spec.speed.current.y += spec.speed.max.y * timeDifference / 4500;
		}
		if (spec.speed.current.y > 0) {
			spec.speed.current.y -= spec.speed.max.y * timeDifference / 4500;
		}
		if (spec.speed.current.x < 0) {
			spec.speed.current.x += spec.speed.max.x * timeDifference / 4500;
		}
		if (spec.speed.current.x > 0) {
			spec.speed.current.x -= spec.speed.max.x * timeDifference / 4500;
		}
	}

	//
	// Update for skull enemy
	function skullUpdate(timeDifference) {
		let playerCharacterLocation = Main.model.getPlayerCharacterLocation();
		let distance = getDistance(spec.center, playerCharacterLocation);
		timer += timeDifference;

		//
		// Check if timer has reached tracking time
		if (timer > 2500) {
			skullTracking = true;
		}

		if (distance < 0.35 && spec.speed.max.x <= 0.2) {
			skullTracking = true;
			spec.speed.max.x = 0.2;
			spec.speed.max.y = 0.2;
		}

		//
		// Check if skull should become enraged
		if (spec.creatureInfo.health <= 4 || distance < 0.20) {
			skullTracking = true;
			spec.spriteInfo.sheet = 'animated-red-skull';
			sprite.spriteSheet = Main.assets[spec.spriteInfo.sheet];
			spec.speed.max.x = 0.275;
			spec.speed.max.y = 0.275;
		}

		//
		// Track onto player character when in range or continue tracking
		if (skullTracking) {
			let xDist = playerCharacterLocation.x - spec.center.x;
			let yDist = playerCharacterLocation.y - spec.center.y;

			if (xDist > 0) {
				spec.speed.current.x += spec.speed.max.x * timeDifference / 300;
			}
			if (xDist < 0) {
				xDist *= -1;
				spec.speed.current.x -= spec.speed.max.x * timeDifference / 300;
			}
			if (yDist > 0) {
				spec.speed.current.y += spec.speed.max.y * timeDifference / 300;
			}
			if (yDist < 0) {
				yDist *= -1;
				spec.speed.current.y -= spec.speed.max.y * timeDifference / 300;
			}
		}

		//
		// Slowly reduce movement
		if (spec.speed.current.y < 0) {
			spec.speed.current.y += spec.speed.max.y * timeDifference / 2000;
		}
		if (spec.speed.current.y > 0) {
			spec.speed.current.y -= spec.speed.max.y * timeDifference / 2000;
		}
		if (spec.speed.current.x < 0) {
			spec.speed.current.x += spec.speed.max.x * timeDifference / 2000;
		}
		if (spec.speed.current.x > 0) {
			spec.speed.current.x -= spec.speed.max.x * timeDifference / 2000;
		}
	}

	//
	// Update for ghost enemy
	function ghostUpdate(timeDifference) {
		timer += timeDifference;
		if (timer > triggerRate) {
			timer -= triggerRate;
			triggerRate += Math.floor(Math.random() * (750 - 250 + 1)) - 250;
			triggerRate = Math.max(666, triggerRate);
			triggerRate = Math.min(triggerRate, 1333);
			//
			// Choose a random direction to move in
			var dirFound = false;
			while (!dirFound) {
				let dir = Math.floor(Math.random() * (5 - 1 + 0)) + 0;
				if (dir === 0 && spec.center.y > 0.125) {
					// up
					spec.speed.current.y = spec.speed.max.y * -1;
					spec.speed.current.x = 0;
					dirFound = true;
				} else if (dir === 1 && spec.center.y < 0.875) {
					// down
					spec.speed.current.y = spec.speed.max.y;
					spec.speed.current.x = 0;
					dirFound = true;
				} else if (dir === 2 && spec.center.x > 0.125) {
					// left
					spec.speed.current.x = spec.speed.max.x * -1;
					spec.speed.current.y = 0;
					dirFound = true;
				} else if (dir === 3 && spec.center.x < 0.875) {
					// right
					spec.speed.current.x = spec.speed.max.x;
					spec.speed.current.y = 0;
					dirFound = true;
				}
			}
			
			//
			// Choose the next rate
			triggerRate = (Math.floor(Math.random() * (100 - 50 + 1)) + 50) * 10;
		}
	}

	//
	// Update for grumpy enemy
	function grumpyUpdate(timeDifference) {
		timer += timeDifference;

		if (timer > triggerRate) {
			timer -= triggerRate;

			Main.model.addEnemyBullet( Main.components.Bullet({
					size: { width: 0.066, height: 0.066 },
					center: { x: spec.center.x, y: spec.center.y },
					rotation: 0,
					speed: { x: 0, y: -0.285 },
					spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
					info: { lifetime: 3000, power: 1 }
				}));
			Main.model.addEnemyBullet( Main.components.Bullet({
					size: { width: 0.066, height: 0.066 },
					center: { x: spec.center.x, y: spec.center.y },
					rotation: 0,
					speed: { x: 0, y: 0.285 },
					spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
					info: { lifetime: 3000, power: 1 }
				}));
			Main.model.addEnemyBullet( Main.components.Bullet({
					size: { width: 0.066, height: 0.066 },
					center: { x: spec.center.x, y: spec.center.y },
					rotation: 0,
					speed: { x: -0.285, y: 0 },
					spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
					info: { lifetime: 3000, power: 1 }
				}));
			Main.model.addEnemyBullet( Main.components.Bullet({
					size: { width: 0.066, height: 0.066 },
					center: { x: spec.center.x, y: spec.center.y },
					rotation: 0,
					speed: { x: 0.285, y: 0 },
					spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
					info: { lifetime: 3000, power: 1 }
				}));
		}
	}

	//
	// Update for eagle enemy
	function eagleUpdate(timeDifference) {
		if (sprite.sprite === 4) {
			//
			// Track onto player character
			let playerCharacterLocation = Main.model.getPlayerCharacterLocation();
			let distance = getDistance(spec.center, playerCharacterLocation);

			if (distance < 0.55) {
				let xDist = playerCharacterLocation.x - spec.center.x;
				let yDist = playerCharacterLocation.y - spec.center.y;

				if (xDist >= 0) {
					spec.speed.current.x = spec.speed.max.x * xDist * 10;
				}
				if (xDist < 0) {
					spec.speed.current.x = spec.speed.max.x * xDist * 10;
				}
				if (yDist >= 0) {
					spec.speed.current.y = spec.speed.max.y * yDist * 10;
				}
				if (yDist < 0) {
					spec.speed.current.y = spec.speed.max.y * yDist * 10;
				}
			} else {
				//
				// Choose a random direction to move in
				spec.speed.current.x = spec.speed.max.x * (Math.floor(Math.random() * (70 - 30 + 1)) - 20) / 20;
				spec.speed.current.y = spec.speed.max.y * (Math.floor(Math.random() * (70 - 30 + 1)) - 20) / 20;
			}
		}

		//
		// Slowly reduce movement
		if (spec.speed.current.y < 0) {
			spec.speed.current.y = Math.min(0, spec.speed.current.y + spec.speed.max.y * timeDifference / 500);
		}
		if (spec.speed.current.y > 0) {
			spec.speed.current.y = Math.max(0, spec.speed.current.y - spec.speed.max.y * timeDifference / 500);
		}
		if (spec.speed.current.x < 0) {
			spec.speed.current.x = Math.min(0, spec.speed.current.x + spec.speed.max.x * timeDifference / 500);
		}
		if (spec.speed.current.x > 0) {
			spec.speed.current.x = Math.max(0, spec.speed.current.x - spec.speed.max.x * timeDifference / 500);
		}
	}

	//
	// Update for sandworm enemy boss
	function sandwormUpdate(timeDifference) {
		timer += timeDifference;
		//
		// Check trigger timer
		if (timer > triggerRate) {
			timer -= triggerRate;
			pattern *= -1;
		}

		//
		// Shoot and move
		if (sprite.sprite === 4) {
			//
			// Track onto player character
			let playerCharacterLocation = Main.model.getPlayerCharacterLocation();

			let xDist = playerCharacterLocation.x - spec.center.x;
			let yDist = playerCharacterLocation.y - spec.center.y;

			if (xDist >= 0) {
				spec.speed.current.x = spec.speed.max.x * xDist * 10;
			}
			if (xDist < 0) {
				spec.speed.current.x = spec.speed.max.x * xDist * 10;
			}
			if (yDist >= 0) {
				spec.speed.current.y = spec.speed.max.y * yDist * 10;
			}
			if (yDist < 0) {
				spec.speed.current.y = spec.speed.max.y * yDist * 10;
			}

			//
			// Spray bullets
			var lifeVariance = (Math.floor(Math.random() * (1250 - 50 + 1)) + 50);
			var sizeVariance = (Math.floor(Math.random() * (2000 - 750 + 1)) + 750) / 100000;
			if (pattern > 0) {
				Main.model.addEnemyBullet( Main.components.Bullet({
						size: { width: 0.04 + sizeVariance, height: 0.04 + sizeVariance },
						center: { x: spec.center.x, y: spec.center.y },
						rotation: 0,
						speed: { x: 0, y: -0.5},
						spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
						info: { lifetime: lifeVariance, power: 1 }
					}));
				Main.model.addEnemyBullet( Main.components.Bullet({
						size: { width: 0.04 + sizeVariance, height: 0.04 + sizeVariance },
						center: { x: spec.center.x, y: spec.center.y },
						rotation: 0,
						speed: { x: 0, y: 0.5},
						spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
						info: { lifetime: lifeVariance, power: 1 }
					}));
				Main.model.addEnemyBullet( Main.components.Bullet({
						size: { width: 0.04 + sizeVariance, height: 0.04 + sizeVariance },
						center: { x: spec.center.x, y: spec.center.y },
						rotation: 0,
						speed: { x: -0.5, y: 0 },
						spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
						info: { lifetime: lifeVariance, power: 1 }
					}));
				Main.model.addEnemyBullet( Main.components.Bullet({
						size: { width: 0.04 + sizeVariance, height: 0.04 + sizeVariance },
						center: { x: spec.center.x, y: spec.center.y },
						rotation: 0,
						speed: { x: 0.5, y: 0 },
						spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
						info: { lifetime: lifeVariance, power: 1 }
					}));
			} else {
				Main.model.addEnemyBullet( Main.components.Bullet({
						size: { width: 0.04 + sizeVariance, height: 0.04 + sizeVariance },
						center: { x: spec.center.x, y: spec.center.y },
						rotation: 0,
						speed: { x: -0.3525, y: -0.3525},
						spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
						info: { lifetime: lifeVariance, power: 1 }
					}));
				Main.model.addEnemyBullet( Main.components.Bullet({
						size: { width: 0.04 + sizeVariance, height: 0.04 + sizeVariance },
						center: { x: spec.center.x, y: spec.center.y },
						rotation: 0,
						speed: { x: 0.3525, y: 0.3525},
						spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
						info: { lifetime: lifeVariance, power: 1 }
					}));
				Main.model.addEnemyBullet( Main.components.Bullet({
						size: { width: 0.04 + sizeVariance, height: 0.04 + sizeVariance },
						center: { x: spec.center.x, y: spec.center.y },
						rotation: 0,
						speed: { x: -0.3525, y: 0.3525 },
						spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
						info: { lifetime: lifeVariance, power: 1 }
					}));
				Main.model.addEnemyBullet( Main.components.Bullet({
						size: { width: 0.04 + sizeVariance, height: 0.04 + sizeVariance },
						center: { x: spec.center.x, y: spec.center.y },
						rotation: 0,
						speed: { x: 0.3525, y: -0.3525 },
						spriteInfo: { sheet: 'animated-enemy-energy-ball', count: 3, time: [100, 100, 100] },
						info: { lifetime: lifeVariance, power: 1 }
					}));
			}
		}

		//
		// Slowly reduce movement
		if (spec.speed.current.y < 0) {
			spec.speed.current.y = Math.min(0, spec.speed.current.y + spec.speed.max.y * timeDifference / 500);
		}
		if (spec.speed.current.y > 0) {
			spec.speed.current.y = Math.max(0, spec.speed.current.y - spec.speed.max.y * timeDifference / 500);
		}
		if (spec.speed.current.x < 0) {
			spec.speed.current.x = Math.min(0, spec.speed.current.x + spec.speed.max.x * timeDifference / 500);
		}
		if (spec.speed.current.x > 0) {
			spec.speed.current.x = Math.max(0, spec.speed.current.x - spec.speed.max.x * timeDifference / 500);
		}
	}

	that.update = function(timeDifference) {
		//
		// Note: Player Character update checks hit detection for all enemy units with itself
		sprite.update(timeDifference, true);

		//
		// Update velocity based on type
		if (spec.type === 'bee') {
			beeUpdate(timeDifference);
		} else if (spec.type === 'skull') {
			skullUpdate(timeDifference);
		} else if (spec.type === 'ghost') {
			ghostUpdate(timeDifference);
		} else if (spec.type === 'red-bee') {
			redBeeUpdate(timeDifference);
		} else if (spec.type === 'grumpy') {
			grumpyUpdate(timeDifference);
		} else if (spec.type === 'eagle') {
			eagleUpdate(timeDifference);
		} else if (spec.type === 'sandworm') {
			sandwormUpdate(timeDifference);
		}

		//
		// Keep enemies velocity within bounds
		if (spec.speed.current.y < 0) {
			spec.speed.current.y = Math.max(spec.speed.max.y * -1, spec.speed.current.y);
		}
		if (spec.speed.current.y > 0) {
			spec.speed.current.y = Math.min(spec.speed.current.y, spec.speed.max.y);
		}
		if (spec.speed.current.x < 0) {
			spec.speed.current.x = Math.max(spec.speed.max.x * -1, spec.speed.current.x);
		}
		if (spec.speed.current.x > 0) {
			spec.speed.current.x = Math.min(spec.speed.current.x, spec.speed.max.x);
		}

		//
		// Update position
		spec.center.x += (spec.speed.current.x / 1000) * timeDifference;
		spec.center.x = Math.min(spec.center.x, 1.0);
		spec.center.x = Math.max(spec.center.x, 0);

		spec.center.y += (spec.speed.current.y / 1000) * timeDifference;
		spec.center.y = Math.min(spec.center.y, 1.0);
		spec.center.y = Math.max(spec.center.y, 0);

	};

	//
	// Get our animated EnemyUnit model and renderer created
	sprite = Main.components.AnimatedSprite({
		spriteSheet: Main.assets[spec.spriteInfo.sheet],
		spriteCount: spec.spriteInfo.count,
		spriteTime: spec.spriteInfo.time,
		animationScale: spec.animationScale,
		spriteSize: spec.size,			// Maintain the size on the sprite
		spriteCenter: spec.center		// Maintain the center on the sprite
	});

	return that;
};
