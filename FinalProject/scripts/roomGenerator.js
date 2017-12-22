/* global Main */

//
// Randomly generates a 12x12 grid of rooms, only roomCount amount of rooms will be active.
// The starting room is always { x: 5, y: 5 }

// ------------------------------------------------------------------
//
// Returns a [Room] object. A room is defined as:
//	{
//		location: { x: , y: },
//		walls: { north: { entrance: false, roomType: 'normal' }, south: , east: , west: },
//		active: ,
//		traversed: ,
//		selected: ,
//		enemies: [],
//		items: []
//	}
//
// ------------------------------------------------------------------
function generateRooms(floorCount, roomCount, treasures) {
	let dimension = 12;
	var rooms = [];

	//
	// Populate the 12x12 grid
	for (let y = 0; y < dimension; y++) {
		rooms.push([]);
		for (let x = 0; x < dimension; x++) {
			rooms[y].push(Main.components.Room({
				location: { x: x, y: y },
				walls: { north: { entrance: false, roomType: 'normal' }, south: { entrance: false, roomType: 'normal' }, east: { entrance: false, roomType: 'normal' }, west: { entrance: false, roomType: 'normal' } },
				active: false,
				traversed: false,
				selected: false,
				enemies: [],
				items: [],
				type: 'normal',
			}));
		}
	}
	
	//
	// Prepare the queue
	var startingRoom = { x: 5, y: 5 };
	var availableRoomsQueue = [];
	availableRoomsQueue.push({
			x: rooms[startingRoom.y-1][startingRoom.x].location.x,
			y: rooms[startingRoom.y-1][startingRoom.x].location.y
		});
	availableRoomsQueue.push({
			x: rooms[startingRoom.y+1][startingRoom.x].location.x,
			y: rooms[startingRoom.y+1][startingRoom.x].location.y
		});
	availableRoomsQueue.push({
			x: rooms[startingRoom.y][startingRoom.x-1].location.x,
			y: rooms[startingRoom.y][startingRoom.x-1].location.y
		});
	availableRoomsQueue.push({
			x: rooms[startingRoom.y][startingRoom.x+1].location.x,
			y: rooms[startingRoom.y][startingRoom.x+1].location.y
		});

	rooms[startingRoom.y][startingRoom.x].active = true;
	rooms[startingRoom.y][startingRoom.x].selected = true;
	roomCount -= 1;

	//
	// Add enemy rooms
	let nextRoomIndex;
	let nextRoomX;
	let nextRoomY;
	let possibleConnection = [];
	while (roomCount > 0) {
		nextRoomIndex = Math.floor(Math.random() * availableRoomsQueue.length);
		nextRoomX = availableRoomsQueue[nextRoomIndex].x;
		nextRoomY = availableRoomsQueue[nextRoomIndex].y;

		availableRoomsQueue.splice(nextRoomIndex, 1);
		rooms[nextRoomY][nextRoomX].active = true;
		roomCount -= 1;

		//
		// Add entrance to one adjacent room room
		possibleConnection.length = 0;
		if (nextRoomY-1 >= 0 && rooms[nextRoomY-1][nextRoomX].active) {
			possibleConnection.push('N');
		}
		else if (nextRoomY+1 < dimension && rooms[nextRoomY+1][nextRoomX].active) {
			possibleConnection.push('S');
		}
		else if (nextRoomX-1 >= 0 && rooms[nextRoomY][nextRoomX-1].active) {
			possibleConnection.push('W');
		}
		else if (nextRoomX+1 >= 0 && rooms[nextRoomY][nextRoomX+1].active) {
			possibleConnection.push('E');
		}
		switch (possibleConnection[Math.floor(Math.random() * possibleConnection.length)]) {
			case 'N':
				rooms[nextRoomY][nextRoomX].createEntranceAt('N');
				rooms[nextRoomY-1][nextRoomX].createEntranceAt('S');
				break;
			case 'S':
				rooms[nextRoomY][nextRoomX].createEntranceAt('S');
				rooms[nextRoomY+1][nextRoomX].createEntranceAt('N');
				break;
			case 'W':
				rooms[nextRoomY][nextRoomX].createEntranceAt('W');
				rooms[nextRoomY][nextRoomX-1].createEntranceAt('E');
				break;
			case 'E':
				rooms[nextRoomY][nextRoomX].createEntranceAt('E');
				rooms[nextRoomY][nextRoomX+1].createEntranceAt('W');
				break;
		}

		//
		// Push available rooms onto the queue
		if (nextRoomY-1 >= 0 && !rooms[nextRoomY-1][nextRoomX].active && !rooms[nextRoomY-1][nextRoomX].selected) {
			availableRoomsQueue.push({
				x: rooms[nextRoomY-1][nextRoomX].location.x,
				y: rooms[nextRoomY-1][nextRoomX].location.y
			});
			rooms[nextRoomY-1][nextRoomX].selected = true;
		}
		if (nextRoomY+1 < dimension && !rooms[nextRoomY+1][nextRoomX].active && !rooms[nextRoomY+1][nextRoomX].selected) {
			availableRoomsQueue.push({
				x: rooms[nextRoomY+1][nextRoomX].location.x,
				y: rooms[nextRoomY+1][nextRoomX].location.y
			});
			rooms[nextRoomY+1][nextRoomX].selected = true;
		}
		if (nextRoomX-1 >= 0 && !rooms[nextRoomY][nextRoomX-1].active && !rooms[nextRoomY][nextRoomX-1].selected) {
			availableRoomsQueue.push({
				x: rooms[nextRoomY][nextRoomX-1].location.x,
				y: rooms[nextRoomY][nextRoomX-1].location.y
			});
			rooms[nextRoomY][nextRoomX-1].selected = true;
		}
		if (nextRoomX+1 < dimension && !rooms[nextRoomY][nextRoomX+1].active && !rooms[nextRoomY][nextRoomX+1].selected) {
			availableRoomsQueue.push({
				x: rooms[nextRoomY][nextRoomX+1].location.x,
				y: rooms[nextRoomY][nextRoomX+1].location.y
			});
			rooms[nextRoomY][nextRoomX+1].selected = true;
		}
	}

	//
	// Add enemies to the rooms
	//------------------------------------------------------------------
	//
	// An EnemyUnit object is defined as:
	//	{
	//		type: ,						// Enemy unit type
	//		size: { width: , height: },	// In world coordinates
	//		center: { x: , y: },		// In world coordinates
	//		speed: , 					// World units per second
	//		spriteInfo: { sheet: , count: , time: [] },
	//	}
	//
	//------------------------------------------------------------------
	var monsterChoice = ['bee', 'skull', 'ghost', 'grumpy', 'eagle'];
	// var monsterChoice = ['grumpy'];
	// var monsterChoice = ['sandworm'];

	for (let y = 0; y < dimension; y++) {
		for (let x = 0; x < dimension; x++) {
			if (rooms[y][x].active) {
				if (x === 5 && y === 5) {
					// Starting Room
					continue;
				}
				let choice = Math.floor(Math.random() * monsterChoice.length);
				if (monsterChoice[choice] === 'bee') {
					for (let i = 0; i < Math.floor(Math.random() * (9 - 6 + 1)) + 6 + floorCount * 2; i++) {
						rooms[y][x].enemies.push(makeBee());
					}
					for (let i = 0; i < Math.floor(Math.random() * (5 - 3 + 1)) + 3 + floorCount * 2; i++) {
						rooms[y][x].enemies.push(makeRedBee());
					}
				} else if (monsterChoice[choice] === 'skull') {
					for (let i = 0; i < Math.floor(Math.random() * (3 - 2 + 1)) + 2 + floorCount; i++) {
						rooms[y][x].enemies.push(makeSkull());
					}
				} else if (monsterChoice[choice] === 'ghost') {
					for (let i = 0; i < Math.floor(Math.random() * (4 - 3 + 1)) + 3 + floorCount; i++) {
						rooms[y][x].enemies.push(makeGhost());
					}
				} else if (monsterChoice[choice] === 'grumpy') {
					for (let i = 0; i < 3 + floorCount; i++) {
						rooms[y][x].enemies.push(makeGrumpy());
					}
				} else if (monsterChoice[choice] === 'eagle') {
					for (let i = 0; i < 4 + floorCount; i++) {
						rooms[y][x].enemies.push(makeEagle());
					}
				} else if (monsterChoice[choice] === 'sandworm') {
					rooms[y][x].enemies.push(makeSandworm());
				}
			}
		}
	}

	//
	// Add treasure room
	nextRoomIndex = Math.floor(Math.random() * availableRoomsQueue.length);
	nextRoomX = availableRoomsQueue[nextRoomIndex].x;
	nextRoomY = availableRoomsQueue[nextRoomIndex].y;

	availableRoomsQueue.splice(nextRoomIndex, 1);
	rooms[nextRoomY][nextRoomX].active = true;
	rooms[nextRoomY][nextRoomX].type = 'treasure';
	switch (treasures[Math.floor(Math.random() * treasures.length)]) {
		case 'image-powerup-damage':
			rooms[nextRoomY][nextRoomX].items.push(Main.components.Items({
					image: 'image-powerup-damage',
					center: { x: 0.50, y: 0.50 },
					size: { width: 0.04 , height: 0.04 } 
				}));
			break;
		case 'image-powerup-speed':
			rooms[nextRoomY][nextRoomX].items.push(Main.components.Items({
					image: 'image-powerup-speed',
					center: { x: 0.50, y: 0.50 },
					size: { width: 0.04 , height: 0.04 } 
				}));
			break;
	}

	//
	// Add entrance to one adjacent room room
	possibleConnection.length = 0;
	if (nextRoomY-1 >= 0 && rooms[nextRoomY-1][nextRoomX].active) {
		possibleConnection.push('N');
	}
	else if (nextRoomY+1 < dimension && rooms[nextRoomY+1][nextRoomX].active) {
		possibleConnection.push('S');
	}
	else if (nextRoomX-1 >= 0 && rooms[nextRoomY][nextRoomX-1].active) {
		possibleConnection.push('W');
	}
	else if (nextRoomX+1 >= 0 && rooms[nextRoomY][nextRoomX+1].active) {
		possibleConnection.push('E');
	}
	switch (possibleConnection[Math.floor(Math.random() * possibleConnection.length)]) {
		case 'N':
			rooms[nextRoomY][nextRoomX].createEntranceAt('N');
			rooms[nextRoomY-1][nextRoomX].createEntranceAt('S');
			rooms[nextRoomY-1][nextRoomX].walls.south.roomType = 'treasure';
			break;
		case 'S':
			rooms[nextRoomY][nextRoomX].createEntranceAt('S');
			rooms[nextRoomY+1][nextRoomX].createEntranceAt('N');
			rooms[nextRoomY+1][nextRoomX].walls.north.roomType = 'treasure';
			break;
		case 'W':
			rooms[nextRoomY][nextRoomX].createEntranceAt('W');
			rooms[nextRoomY][nextRoomX-1].createEntranceAt('E');
			rooms[nextRoomY][nextRoomX-1].walls.east.roomType = 'treasure';
			break;
		case 'E':
			rooms[nextRoomY][nextRoomX].createEntranceAt('E');
			rooms[nextRoomY][nextRoomX+1].createEntranceAt('W');
			rooms[nextRoomY][nextRoomX+1].walls.west.roomType = 'treasure';
			break;
	}

	//
	// Add boss room	
	nextRoomIndex = Math.floor(Math.random() * availableRoomsQueue.length);
	nextRoomX = availableRoomsQueue[nextRoomIndex].x;
	nextRoomY = availableRoomsQueue[nextRoomIndex].y;

	availableRoomsQueue.splice(nextRoomIndex, 1);
	rooms[nextRoomY][nextRoomX].active = true;
	rooms[nextRoomY][nextRoomX].type = 'boss';
	if (floorCount === 1) {
		rooms[nextRoomY][nextRoomX].enemies.push(makeSandworm());
	} else if (floorCount === 2) {
		rooms[nextRoomY][nextRoomX].enemies.push(makeSandworm());
	} else if (floorCount === 3) {
		rooms[nextRoomY][nextRoomX].enemies.push(makeSandworm());
	} 
	
	//
	// Add entrance to one adjacent room room
	possibleConnection.length = 0;
	if (nextRoomY-1 >= 0 && rooms[nextRoomY-1][nextRoomX].active) {
		possibleConnection.push('N');
	}
	else if (nextRoomY+1 < dimension && rooms[nextRoomY+1][nextRoomX].active) {
		possibleConnection.push('S');
	}
	else if (nextRoomX-1 >= 0 && rooms[nextRoomY][nextRoomX-1].active) {
		possibleConnection.push('W');
	}
	else if (nextRoomX+1 >= 0 && rooms[nextRoomY][nextRoomX+1].active) {
		possibleConnection.push('E');
	}
	switch (possibleConnection[Math.floor(Math.random() * possibleConnection.length)]) {
		case 'N':
			rooms[nextRoomY][nextRoomX].createEntranceAt('N');
			rooms[nextRoomY-1][nextRoomX].createEntranceAt('S');
			rooms[nextRoomY-1][nextRoomX].walls.south.roomType = 'boss';
			break;
		case 'S':
			rooms[nextRoomY][nextRoomX].createEntranceAt('S');
			rooms[nextRoomY+1][nextRoomX].createEntranceAt('N');
			rooms[nextRoomY+1][nextRoomX].walls.north.roomType = 'boss';
			break;
		case 'W':
			rooms[nextRoomY][nextRoomX].createEntranceAt('W');
			rooms[nextRoomY][nextRoomX-1].createEntranceAt('E');
			rooms[nextRoomY][nextRoomX-1].walls.east.roomType = 'boss';
			break;
		case 'E':
			rooms[nextRoomY][nextRoomX].createEntranceAt('E');
			rooms[nextRoomY][nextRoomX+1].createEntranceAt('W');
			rooms[nextRoomY][nextRoomX+1].walls.west.roomType = 'boss';
			break;
	}

	//
	// Logs the maze
	// var activeCount = 0
	// var line = '\t';
	// for (let y = 0; y < 10; y++) {
	// 	line += y;
	// }
	// console.log(line);
	// for (let y = 0; y < dimension; y++) {
	// 	line = '';
	// 	line += y;
	// 	line += '\t';
	// 	for (let x = 0; x < dimension; x++) {
	// 		if (rooms[y][x].type === 'boss') {
	// 			line += 'B';
	// 		} else if (rooms[y][x].type === 'treasure') {
	// 			line += 'T';
	// 		} else if (rooms[y][x].active) {
	// 			activeCount+=1;
	// 			line += 'O';
	// 		} else {
	// 			line += 'X';
	// 		}
	// 	}
	// 	console.log(line);
	// }
	// console.log('totalactive: ', activeCount);

	return rooms;
}

function makeBee() {
	let variance = Math.floor(Math.random() * (14 - 8 + 1)) + 8;
	return Main.components.EnemyUnit({
		type: 'bee',
		size: { width: 0.03, height: 0.03 },
		center: { x: (Math.floor(Math.random() * (70 - 30 + 1)) + 30) / 100, y: (Math.floor(Math.random() * (70 - 30 + 1)) + 30) / 100 },
		speed: { current: { x: 0, y: 0 }, max: { x: 0.06, y: 0.06 } },
		spriteInfo: { sheet: 'animated-orange-bee', count: 4, time: [67 + variance, 42 + variance, 67 + variance, 67 + variance] },
		creatureInfo: { health: 3, power: 1}
	});
}

function makeRedBee() {
	let variance = Math.floor(Math.random() * (14 - 8 + 1)) + 8;
	return Main.components.EnemyUnit({
		type: 'red-bee',
		size: { width: 0.0325, height: 0.0325 },
		center: { x: (Math.floor(Math.random() * (70 - 30 + 1)) + 30) / 100, y: (Math.floor(Math.random() * (70 - 30 + 1)) + 30) / 100 },
		speed: { current: { x: 0, y: 0 }, max: { x: 0.10, y: 0.10 } },
		spriteInfo: { sheet: 'animated-red-bee', count: 4, time: [60 + variance, 0, 60 + variance, 60 + variance] },
		creatureInfo: { health: 4, power: 1}
	});
}

function makeSkull() {
	let variance = Math.floor(Math.random() * (14 - 8 + 1)) + 8;
	return Main.components.EnemyUnit({
		type: 'skull',
		size: { width: 0.075, height: 0.075 },
		center: { x: (Math.floor(Math.random() * (70 - 30 + 1)) + 30) / 100, y: (Math.floor(Math.random() * (70 - 30 + 1)) + 30) / 100 },
		speed: { current: { x: 0, y: 0 }, max: { x: 0.125, y: 0.125 } },
		spriteInfo: { sheet: 'animated-skull', count: 2, time: [67 + variance, 67 + variance] },
		creatureInfo: { health: 9, power: 1}
	});
}

function makeGhost() {
	let variance = Math.floor(Math.random() * (14 - 8 + 1)) + 8;
	return Main.components.EnemyUnit({
		type: 'ghost',
		size: { width: 0.133, height: 0.133 },
		center: { x: (Math.floor(Math.random() * (7 - 3 + 1)) + 3) / 10, y: (Math.floor(Math.random() * (7 - 3 + 1)) + 3) / 10 },
		speed: { current: { x: 0, y: 0 }, max: { x: 0.233, y: 0.233 } },
		spriteInfo: { sheet: 'animated-ghost', count: 13, time: [50 + variance, 50 + variance, 50 + variance, 50 + variance, 50 + variance, 50 + variance, 50 + variance, 50 + variance, 50 + variance, 50 + variance, 50 + variance, 50 + variance, 50 + variance] },
		creatureInfo: { health: 5, power: 1}
	});
}

function makeGrumpy() {
	let variance = Math.floor(Math.random() * (750 - 250 + 1)) + 250;
	return Main.components.EnemyUnit({
		type: 'grumpy',
		size: { width: 0.085, height: 0.085 },
		center: { x: (Math.floor(Math.random() * (7 - 3 + 1)) + 3) / 10, y: (Math.floor(Math.random() * (7 - 3 + 1)) + 3) / 10 },
		speed: { current: { x: 0, y: 0 }, max: { x: 0.233, y: 0.233 } },
		spriteInfo: { sheet: 'animated-grumpy', count: 2, time: [1333 + variance, 500] },
		creatureInfo: { health: 6, power: 2}
	});
}

function makeEagle() {
	let variance = Math.floor(Math.random() * (20 - 8 + 1)) + 8;
	return Main.components.EnemyUnit({
		type: 'eagle',
		size: { width: 0.065, height: 0.035 },
		center: { x: (Math.floor(Math.random() * (70 - 30 + 1)) + 30) / 100, y: (Math.floor(Math.random() * (70 - 30 + 1)) + 30) / 100 },
		speed: { current: { x: 0, y: 0 }, max: { x: 0.625, y: 0.625 } },
		spriteInfo: { sheet: 'animated-eagle', count: 7, time: [175 + variance, 175 + variance, 175 + variance, 300 + variance, 40 + variance, 40 + variance, 40 + variance] },
		creatureInfo: { health: 6, power: 1}
	});
}

function makeSandworm() {
	return Main.components.EnemyUnit({
		type: 'sandworm',
		size: { width: 0.175, height: 0.175 },
		center: { x: 0.5, y: 0.5 },
		speed: { current: { x: 0, y: 0 }, max: { x: 0.33, y: 0.33 } },
		spriteInfo: { sheet: 'animated-sandworm', count: 12, time: [165, 165, 165, 140, 140, 140, 140, 140, 140, 140, 140, 140] },
		creatureInfo: { health: 90, power: 2}
	});
}
