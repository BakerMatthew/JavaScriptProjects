/* global Main */

//
// This namespace holds the dynamic loading main model
Main.model = (function(components) {
	'use strict';

	var playerCharacter;
	var healthCount;
	var playerCharacterInvincibilityFrames;
	var score;
	var floorCount;
	var treasures = [];

	var particles = [];

	var bullets = [];
	var bulletSpeed;
	var bulletLifetime;
	var bulletImage;
	var bulletPower;
	var bulletSize;
	var shootDirection;
	var movementDirection = [];
	var shootingSpeed;
	var deviationAmount;
	var shootOrigin;
	var up;
	var down;
	var left;
	var right;

	var roomCount;
	var rooms = [];
	var currentRoom;

	//
	// Creates a bullet with the given spec object:
	// {
	//		offset: { x: , y: },
	//		info: { lifetime: , power: },
	//		speed: { x: , y: },
	// }
	function createBullet(spec) {
		shootOrigin *= -1;
		if (shootOrigin > 0) {
			spec.offset.x *= -1;
			spec.offset.y *= -1;
		}
		bullets.push(components.Bullet({
			size: { width: bulletSize, height: bulletSize },
			center: { x: playerCharacter.center.x + spec.offset.x, y: playerCharacter.center.y + spec.offset.y },
			rotation: 0,
			speed: { x: spec.speed.x, y: spec.speed.y },
			spriteInfo: { sheet: 'animated-energy-ball', count: 3, time: [150, 150, 150] },
			info: { lifetime: spec.info.lifetime, power: spec.info.power }
		}));
	}

	//
	// Creates bullet ParticleSystem where the bullet ended then removes it
	function removeBullet(index) {
		Main.assets['shooting-explosion-sound'].play();
		let particleImage = '';
		if (bullets[index].spriteInfo.sheet === 'animated-energy-ball') {
			particleImage = 'image-energy-ball-particle';
		} else if (bullets[index].spriteInfo.sheet === 'animated-enemy-energy-ball') {
			particleImage = 'image-enemy-energy-ball-particle';
		}
		if (bullets[index].speed.x < 0) {
			bullets[index].speed.x *= -1;
		}
		if (bullets[index].speed.y < 0) {
			bullets[index].speed.y *= -1;
		}
		particles.push(ParticleSystem( {
			image: Main.assets[particleImage],
			center: { x: bullets[index].center.x, y: bullets[index].center.y },
			speed: { mean: (bullets[index].speed.x + bullets[index].speed.y) / 1.65, stdev: (bullets[index].speed.x + bullets[index].speed.y) / 4 },
			lifetime: { mean: 0.8, stdev: 0.25 },
			size: { mean: 3, stdev: 1 }
		}, Main.renderer.core));
		for (let i = 0; i < Math.floor(Math.random() * (12 - 6 + 1)) + 6; i++) {
			particles[particles.length-1].create();
		}
		bullets.splice(index, 1);
	}

	//
	// Removes the given enemy
	function removeEnemy(index) {
		let assetImage = '';
		if (rooms[currentRoom.y][currentRoom.x].enemies[index].type === 'skull') {
			assetImage = 'image-grey-crystal';
		} else if (rooms[currentRoom.y][currentRoom.x].enemies[index].type === 'ghost') {
			assetImage = 'image-blue-crystal';
		} else {
			assetImage = 'image-red-crystal';
		}
		particles.push(ParticleSystem( {
			image: Main.assets[assetImage],
			center: { x: rooms[currentRoom.y][currentRoom.x].enemies[index].center.x, y: rooms[currentRoom.y][currentRoom.x].enemies[index].center.y },
			speed: { mean: (rooms[currentRoom.y][currentRoom.x].enemies[index].speed.max.x + rooms[currentRoom.y][currentRoom.x].enemies[index].speed.max.y) / 3, stdev: (rooms[currentRoom.y][currentRoom.x].enemies[index].speed.max.x + rooms[currentRoom.y][currentRoom.x].enemies[index].speed.max.y) / 5 },
			lifetime: { mean: 0.6, stdev: 0.25 },
			size: { mean: 1.5, stdev: 0.5 }
		}, Main.renderer.core));
		for (let i = 0; i < Math.floor(Math.random() * (15 - 8 + 1)) + 8; i++) {
			particles[particles.length-1].create();
		}
		rooms[currentRoom.y][currentRoom.x].enemies.splice(index, 1);
		//
		// If the room is cleared, spawn items
		if (rooms[currentRoom.y][currentRoom.x].enemies.length === 0) {
			if (rooms[currentRoom.y][currentRoom.x].type === 'boss') {
				var xPos = 0.5;
				var yPos = 0.5;
				if (playerCharacter.center.x > 0.5) {
					xPos = 0.25;
				} else {
					xPos = 0.75
				}
				if (playerCharacter.center.y > 0.5) {
					yPos = 0.25;
				} else {
					yPos = 0.75
				}
				rooms[currentRoom.y][currentRoom.x].items.push(components.Items({
						image: 'image-stairs',
						center: { x: xPos, y: yPos },
						size: { width: 0.125 , height: 0.125 } 
					}));
			} else {
				var itemImage = '';
				switch (Math.floor(Math.random() * 3) + 1) {
					case 0:
						itemImage = 'half-heart';
						break;
					case 1:
						itemImage = 'half-heart';
						break;
					case 2:
						itemImage = 'full-heart';
						break;
					default:
						break;
				}
				if (itemImage != '') {
					rooms[currentRoom.y][currentRoom.x].items.push(components.Items({
							image: itemImage,
							center: { x: 0.50, y: 0.50 },
							size: { width: 0.04 , height: 0.04 } 
						}));
				}
			}
		}
	}

	//
	// Compares two rectangles to see if they have collided
	function haveCollided(r1, r2) {
		return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top)
	}

	//
	// Returns the dimensions of a box for an object
	function getBoundariesFor(obj) {
		return {
			top: obj.center.y - (obj.size.height / 2.5),
			bottom: obj.center.y + (obj.size.height / 2.5),
			left: obj.center.x - (obj.size.width / 2.5),
			right: obj.center.x + (obj.size.width / 2.5)
		};
	}

	//
	// Updates the player character while checking its hit detection with enemies and walls
	function playerCharacterUpdate(timeDifference) {
		playerCharacter.update(timeDifference);

		//
		// Update player character location
		playerCharacter.center.x += (playerCharacter.speed.current.x / 1000) * timeDifference;
		playerCharacter.center.y += (playerCharacter.speed.current.y / 1000) * timeDifference;
		
		//
		// Update player character movement velocity
		if (movementDirection[up] === 0 && playerCharacter.speed.current.y < 0) {
			playerCharacter.speed.current.y = Math.min(0, playerCharacter.speed.current.y + (playerCharacter.speed.max.y * timeDifference / 200));
		}
		if (movementDirection[down] === 0 && playerCharacter.speed.current.y > 0) {
			playerCharacter.speed.current.y = Math.max(0, playerCharacter.speed.current.y - (playerCharacter.speed.max.y * timeDifference / 200));
		}
		if (movementDirection[left] === 0 && playerCharacter.speed.current.x < 0) {
			playerCharacter.speed.current.x = Math.min(0, playerCharacter.speed.current.x + (playerCharacter.speed.max.x * timeDifference / 200));
		}
		if (movementDirection[right] === 0 && playerCharacter.speed.current.x > 0) {
			playerCharacter.speed.current.x = Math.max(0, playerCharacter.speed.current.x - (playerCharacter.speed.max.x * timeDifference / 200));
		}

		//
		// Check player character with walls and exits
		if (playerCharacter.center.y < 0.02 && rooms[currentRoom.y][currentRoom.x].walls.north.entrance && playerCharacter.center.x >= 0.42 && playerCharacter.center.x <= 0.58 && rooms[currentRoom.y][currentRoom.x].enemies.length === 0) {
			if (playerCharacter.center.y < -0.02) {
				//
				// Change to north room
				currentRoom.y -= 1;
				playerCharacter.center.y = 0.98;
				playerCharacter.center.x = 0.50;
				updateRoom();
			}
		} else {
			playerCharacter.center.y = Math.max(playerCharacter.center.y, 0.011);
		}
		if (playerCharacter.center.y > 0.98 && rooms[currentRoom.y][currentRoom.x].walls.south.entrance && playerCharacter.center.x >= 0.42 && playerCharacter.center.x <= 0.58 && rooms[currentRoom.y][currentRoom.x].enemies.length === 0) {
			if (playerCharacter.center.y > 1.02) {
				//
				// Change to south room
				currentRoom.y += 1;
				playerCharacter.center.y = 0.02;
				playerCharacter.center.x = 0.50;
				updateRoom();
			}
		} else {
			playerCharacter.center.y = Math.min(playerCharacter.center.y, 1.0 - 0.011);
		}
		if (playerCharacter.center.x < 0.02 && rooms[currentRoom.y][currentRoom.x].walls.west.entrance && playerCharacter.center.y >= 0.43 && playerCharacter.center.y <= 0.57 && rooms[currentRoom.y][currentRoom.x].enemies.length === 0) {
			if (playerCharacter.center.x < -0.02) {
				//
				// Change to west room
				currentRoom.x -= 1;
				playerCharacter.center.y = 0.50;
				playerCharacter.center.x = 0.98;
				updateRoom();
			}
		} else {
			playerCharacter.center.x = Math.max(playerCharacter.center.x, 0.011);
		}
		if (playerCharacter.center.x > 0.98 && rooms[currentRoom.y][currentRoom.x].walls.east.entrance && playerCharacter.center.y >= 0.43 && playerCharacter.center.y <= 0.57 && rooms[currentRoom.y][currentRoom.x].enemies.length === 0) {
			if (playerCharacter.center.x > 1.02) {
				//
				// Change to east room
				currentRoom.x += 1;
				playerCharacter.center.y = 0.50;
				playerCharacter.center.x = 0.02;
				updateRoom();
			}
		} else {
			playerCharacter.center.x = Math.min(playerCharacter.center.x, 1.0 - 0.011);
		}
		
		//
		// Check hit detection with all enemies
		playerCharacterInvincibilityFrames -= timeDifference;
		let playerBoundaries = getBoundariesFor(playerCharacter);
		for (let j = rooms[currentRoom.y][currentRoom.x].enemies.length - 1; j >= 0; j--) {
			let enemyBoundaries = getBoundariesFor(rooms[currentRoom.y][currentRoom.x].enemies[j]);
				if (playerCharacterInvincibilityFrames <= 0 && haveCollided(playerBoundaries, enemyBoundaries)) {
					healthCount = Math.max(0, healthCount - rooms[currentRoom.y][currentRoom.x].enemies[j].creatureInfo.power);
					playerCharacterInvincibilityFrames = 1000;
					Main.assets['player-damage-sound'].play();
					//
					// Check for player death
					if (healthCount <= 0) {
						// @TODO: Game over, reset game
						that.restartGame();
						break;
					}
				}
		}

		//
		// Check hit detection with all items
		for (let j = rooms[currentRoom.y][currentRoom.x].items.length - 1; j >= 0; j--) {
			let itemBoundaries = getBoundariesFor(rooms[currentRoom.y][currentRoom.x].items[j]);
				if (haveCollided(playerBoundaries, itemBoundaries)) {
					if (rooms[currentRoom.y][currentRoom.x].items[j].image === 'half-heart' && healthCount < 6) {
						healthCount += 1;
						Main.assets['player-item-sound'].play();
						rooms[currentRoom.y][currentRoom.x].items.splice(j, 1);
					} else if (rooms[currentRoom.y][currentRoom.x].items[j].image === 'full-heart' && healthCount < 6) {
						if (healthCount === 5) {
							healthCount += 1;
							rooms[currentRoom.y][currentRoom.x].items[j].image = 'half-heart';
							Main.assets['player-item-sound'].play();
						} else {
							healthCount += 2;
							Main.assets['player-item-sound'].play();
							rooms[currentRoom.y][currentRoom.x].items.splice(j, 1);
						}
					} else if (rooms[currentRoom.y][currentRoom.x].items[j].image === 'image-powerup-damage') {
						Main.assets['player-item-powerup-sound'].play();
						bulletImage = 'animated-energy-ball-damage';
						if (playerCharacter.image === 'animated-player-character-speed') {
							playerCharacter.image = 'animated-player-character-damage-speed';
							playerCharacter.sprite.spriteSheet = Main.assets['animated-player-character-damage-speed'];
						} else {
							playerCharacter.image = 'animated-player-character-damage';
							playerCharacter.sprite.spriteSheet = Main.assets['animated-player-character-damage'];
						}
						bulletPower += 1;
						bulletSize += 0.015;
						rooms[currentRoom.y][currentRoom.x].items.splice(j, 1);
						for (let z = 0; z < treasures.length; z++) {
							if (treasures[z] === 'image-powerup-damage') {
								treasures.splice(z, 1);
								break;
							}
						}
					} else if (rooms[currentRoom.y][currentRoom.x].items[j].image === 'image-powerup-speed') {
						Main.assets['player-item-powerup-sound'].play();
						if (playerCharacter.image === 'animated-player-character-damage') {
							playerCharacter.image = 'animated-player-character-damage-speed';
							playerCharacter.sprite.spriteSheet = Main.assets['animated-player-character-damage-speed'];
						} else {
							playerCharacter.image = 'animated-player-character-speed';
							playerCharacter.sprite.spriteSheet = Main.assets['animated-player-character-speed'];
						}
						playerCharacter.speed.max.x += 0.125;
						playerCharacter.speed.max.y += 0.125;
						shootingSpeed -= 200;
						Main.screens['game-play'].updateShooting();
						rooms[currentRoom.y][currentRoom.x].items.splice(j, 1);
						for (let z = 0; z < treasures.length; z++) {
							if (treasures[z] === 'image-powerup-speed') {
								treasures.splice(z, 1);
								break;
							}
						}
					} else if (rooms[currentRoom.y][currentRoom.x].items[j].image === 'image-stairs') {
						nextFloor();
						rooms[currentRoom.y][currentRoom.x].items.splice(j, 1);
					}
				}
		}
	}

	//
	// Updates the bullets while checking their hit detection with walls and enemies
	function bulletUpdate(timeDifference) {
		for (let i = bullets.length - 1; i >= 0; i--) {
			bullets[i].update(timeDifference);
			
			//
			// Check bullet hit detections with walls and checks lifetime
			if (bullets[i].info.lifetime <= 0 || bullets[i].center.x >= 1.0 || bullets[i].center.x <= 0 || bullets[i].center.y >= 1.0 || bullets[i].center.y <= 0) {
				removeBullet(i);
				continue;
			}

			//
			// Check bullet hit detection with enemies
			let bulletBoundaries = getBoundariesFor(bullets[i]);
			if (bullets[i].spriteInfo.sheet === 'animated-energy-ball') {
				for (let j = rooms[currentRoom.y][currentRoom.x].enemies.length - 1; j >= 0; j--) {
					let enemyBoundaries = getBoundariesFor(rooms[currentRoom.y][currentRoom.x].enemies[j]);
					if (haveCollided(bulletBoundaries, enemyBoundaries)) {
						//
						// Update and check enemy creature life
						rooms[currentRoom.y][currentRoom.x].enemies[j].creatureInfo.health -= bullets[i].info.power;
						if (rooms[currentRoom.y][currentRoom.x].enemies[j].creatureInfo.health <= 0) {
							removeEnemy(j);
						}
						removeBullet(i);
						break;
					}
				}
			} else { // Check enemy bullets with player character
				let playerBoundaries = getBoundariesFor(playerCharacter);
				if (haveCollided(playerBoundaries, bulletBoundaries)) {
					if (playerCharacterInvincibilityFrames <= 0) {
						healthCount = Math.max(0, healthCount - bullets[i].info.power);
						playerCharacterInvincibilityFrames = 1000;
						Main.assets['player-damage-sound'].play();
						//
						// Check for player death
						if (healthCount <= 0) {
							// @TODO: Game over, reset game
							that.restartGame();
							break;
						}
					}
					removeBullet(i);
					continue;
				}
			}
		}
	}

	//
	// Called when the player character enters an adjacent room
	function updateRoom() {
		bullets.length = 0;
		particles.length = 0;
	}

	//
	// Called when the player enters stairs
	function nextFloor() {
		roomCount += 2;
		floorCount += 1;
		rooms = generateRooms(floorCount, roomCount, treasures);
		currentRoom = { x: 5, y: 5 };

		playerCharacter.center.x = 0.50;
		playerCharacter.center.y = 0.50;
	};

	var	that = {};

	//
	// This function initializes the input main model.
	that.initialize = function() {
		roomCount = 12;
		floorCount = 1;
		treasures = ['image-powerup-damage', 'image-powerup-speed'];
		rooms = generateRooms(floorCount, roomCount, treasures);
		currentRoom = { x: 5, y: 5 };

		//
		// Used with movementDirection: [0, 0, 0, 0]
		up = 0;
		down = 1;
		left = 2;
		right = 3;

		healthCount = 6;
		playerCharacterInvincibilityFrames = 0;
		score = 0;

		bulletSpeed = 0.35;
		bulletLifetime = 1500;
		shootingSpeed = 450;
		bulletPower = 2;
		bulletSize = 0.05;
		shootOrigin = 1;
		shootDirection = 'X';
		movementDirection = [0, 0, 0, 0];
		deviationAmount = 2.5;
		bulletImage = 'animated-energy-ball';
		
		playerCharacter = components.PlayerCharacter({
			image: 'animated-player-character',
			size: { width: 0.1, height: 0.1 },
			center: { x: 0.50, y: 0.50 },
			speed: { current: { x: 0, y: 0 }, max: { x: 0.40, y: 0.40 }},
		});
	};

	//
	// Character Controls (Constant push down input)
	that.moveCharacterUp = function(timeDifference) {
		playerCharacter.speed.current.y = Math.max(playerCharacter.speed.max.y * -1, playerCharacter.speed.current.y - (playerCharacter.speed.max.y * timeDifference / 250));
	};
	that.moveCharacterDown = function(timeDifference) {
		playerCharacter.speed.current.y = Math.min(playerCharacter.speed.max.y, playerCharacter.speed.current.y + (playerCharacter.speed.max.y * timeDifference / 250));
	};
	that.moveCharacterLeft = function(timeDifference) {
		playerCharacter.speed.current.x = Math.max(playerCharacter.speed.max.x * -1, playerCharacter.speed.current.x - (playerCharacter.speed.max.x * timeDifference / 250));
	};
	that.moveCharacterRight = function(timeDifference) {
		playerCharacter.speed.current.x = Math.min(playerCharacter.speed.max.x, playerCharacter.speed.current.x + (playerCharacter.speed.max.x * timeDifference / 250));
	};
	//
	// If the player is moving in a given direction, it influences the speed of shot bullets
	that.setMovementDir = function(dir) {
		movementDirection[dir] = 1;
	};
	that.unsetMovementDir = function(dir) {
		movementDirection[dir] = 0;
	};

	//
	// Gun Controls (Repeating interval push down input)
	that.shootBulletUp = function() {
		if (shootDirection === 'U') {
			createBullet({
				offset: { x: 0.01, y: 0 },
				speed: { x: 0 + (movementDirection[left] * playerCharacter.speed.current.x / deviationAmount) + (movementDirection[right] * playerCharacter.speed.current.x / deviationAmount), y: (-1 * bulletSpeed) + (movementDirection[up] * playerCharacter.speed.current.y / deviationAmount) },
				info: { lifetime: bulletLifetime, power: bulletPower }
			});
		}
	};
	that.shootBulletDown = function() {
		if (shootDirection === 'D') {
			createBullet({
				offset: { x: 0.01, y: 0 },
				speed: { x: 0 + (movementDirection[left] * playerCharacter.speed.current.x / deviationAmount) + (movementDirection[right] * playerCharacter.speed.current.x / deviationAmount), y: bulletSpeed + (movementDirection[down] * playerCharacter.speed.current.y / deviationAmount) },
				info: { lifetime: bulletLifetime, power: bulletPower }
			});
		}
	};
	that.shootBulletLeft = function() {
		if (shootDirection === 'L') {
			createBullet({
				offset: { x: 0, y: 0.01 },
				speed: { x: (-1 * bulletSpeed) + (movementDirection[left] * playerCharacter.speed.current.x / deviationAmount), y: 0 + (movementDirection[up] * playerCharacter.speed.current.y / deviationAmount) + (movementDirection[down] * playerCharacter.speed.current.y / deviationAmount) },
				info: { lifetime: bulletLifetime, power: bulletPower }
			});
		}
	};
	that.shootBulletRight = function() {
		if (shootDirection === 'R') {
			createBullet({
				offset: { x: 0, y: 0.01 },
				speed: { x: bulletSpeed + (movementDirection[right] * playerCharacter.speed.current.x / deviationAmount), y: 0 + (movementDirection[up] * playerCharacter.speed.current.y / deviationAmount) + (movementDirection[down] * playerCharacter.speed.current.y / deviationAmount) },
				info: { lifetime: bulletLifetime, power: bulletPower }
			});
		}
	};
	//
	// Flags so that the player character can't shoot in multiple directions
	that.setShootingDir = function(dir) {
		if (shootDirection == 'X') {
			shootDirection = dir;
		}
	};
	that.unsetShootingDir = function(dir) {
		shootDirection = 'X';
	};

	//
	// Returns the player character's current health
	that.getHealthCount = function() {
		return healthCount;
	};

	//
	// Returns the current floor
	that.getFloorCount = function() {
		return floorCount;
	};

	//
	// Returns the player character's current location
	that.getPlayerCharacterLocation = function() {
		return playerCharacter.center;
	}

	//
	// Returns the game's current score
	that.getScore = function() {
		return score;
	}

	//
	// Adds bullet to bullets[]
	that.addEnemyBullet = function(bullet) {
		bullets.push(bullet);
	}

	//
	// Returns shooting speed
	that.getShootingSpeed = function() {
		return shootingSpeed = 450;
	}

	//
	// Restarts the game to floor one
	that.restartGame = function() {
		Main.screens['game-play'].restartGame();
		roomCount = 12;
		floorCount = 1;
		treasures = ['image-powerup-damage', 'image-powerup-speed'];
		rooms = generateRooms(floorCount, roomCount, treasures);
		currentRoom = { x: 5, y: 5 };
		bulletImage = 'animated-energy-ball';
		

		healthCount = 6;
		score = 0;

		bullets.length = 0;
		bulletSpeed = 0.35;
		bulletLifetime = 1500;
		shootingSpeed = 450;
		bulletPower = 2;
		bulletSize = 0.05;
		particles.length = 0;
		
		playerCharacter = components.PlayerCharacter({
			image: 'animated-player-character',
			size: { width: 0.1, height: 0.1 },
			center: { x: 0.50, y: 0.50 },
			speed: { current: { x: 0, y: 0 }, max: { x: 0.40, y: 0.40 }},
		});
	};
	
	//
	// Updates the game model
	that.update = function(timeDifference) {
		//
		// Update player character
		playerCharacterUpdate(timeDifference);

		//
		// Update the current room: enemy creatures
		rooms[currentRoom.y][currentRoom.x].update(rooms[currentRoom.y][currentRoom.x], timeDifference);

		//
		// Update the bullets
		bulletUpdate(timeDifference);

		//
		// Update the particles
		for (let i = 0; i < particles.length; i++) {
			particles[i].update(timeDifference);
		}
	};

	//
	// Renders the game model
	that.render = function(renderer) {

		//
		// Render the current room: creatures, walls, objects
		renderer.Room.render(rooms[currentRoom.y][currentRoom.x], floorCount);

		//
		// Render player character
		renderer.PlayerCharacter.render(playerCharacter);

		//
		// Render bullet projectiles
		for (let i = 0; i < bullets.length; i++) {
			renderer.Bullet.render(bullets[i]);
		}

		//
		// Render particles
		for (let i = 0; i < particles.length; i++) {
			particles[i].render();
		}
	};

	return that;

}(Main.components));
