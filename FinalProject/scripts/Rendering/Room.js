/* global Main */

// ------------------------------------------------------------------
//
// Rendering function for an /Components/Room object.
//
// ------------------------------------------------------------------
Main.renderer.Room = (function(core) {
	'use strict';
	var that = {};
	var	introText = Main.components.Text({
		text : 'Welcome! As you look at entrances, take note of their color!',
		font : '16px Arial, sans-serif',
		fill : 'rgba(255, 255, 255, 1)',
		position : { x : 0.15, y : 0.25 }
	});
	var	introTextTwo = Main.components.Text({
		text : 'Grey Entrance: Normal monster room',
		font : '16px Arial, sans-serif',
		fill : 'rgba(255, 255, 255, 1)',
		position : { x : 0.15, y : 0.30 }
	});
	var	introTextThree = Main.components.Text({
		text : 'Yellow Entrance: Treasure room',
		font : '16px Arial, sans-serif',
		fill : 'rgba(255, 255, 255, 1)',
		position : { x : 0.15, y : 0.33 }
	});
	var	introTextFour = Main.components.Text({
		text : 'Red Entrance: Boss room',
		font : '16px Arial, sans-serif',
		fill : 'rgba(255, 255, 255, 1)',
		position : { x : 0.15, y : 0.36 }
	});
	var	introTextFive = Main.components.Text({
		text : 'Defeat all enemies to unlock doors!',
		font : '16px Arial, sans-serif',
		fill : 'rgba(255, 255, 255, 1)',
		position : { x : 0.15, y : 0.41 }
	});
	var	introTextSix = Main.components.Text({
		text : 'Collect treasures for powerups!',
		font : '16px Arial, sans-serif',
		fill : 'rgba(255, 255, 255, 1)',
		position : { x : 0.15, y : 0.44 }
	});
	var	introTextSeven = Main.components.Text({
		text : 'Beat bosses to progress floors!',
		font : '16px Arial, sans-serif',
		fill : 'rgba(255, 255, 255, 1)',
		position : { x : 0.15, y : 0.47 }
	});
	var	introTextEight = Main.components.Text({
		text : 'Good Luck!',
		font : '16px Arial, sans-serif',
		fill : 'rgba(255, 255, 255, 1)',
		position : { x : 0.15, y : 0.52 }
	});

	that.render = function(room, floorCount) {
		if (room.location.x === 5 && room.location.y === 5 && floorCount === 1) {
			Main.renderer.Text.render(introText);
			Main.renderer.Text.render(introTextTwo);
			Main.renderer.Text.render(introTextThree);
			Main.renderer.Text.render(introTextFour);
			Main.renderer.Text.render(introTextFive);
			Main.renderer.Text.render(introTextSix);
			Main.renderer.Text.render(introTextSeven);
			Main.renderer.Text.render(introTextEight);
		}
		
		//
		// Draw walls and entrances
		if (!room.walls.north.entrance) {
			core.drawLine('rgba(255, 255, 255, 1)', {x:0, y:0}, {x:1, y:0});
		} else {
			core.drawLine('rgba(255, 255, 255, 1)', {x:0, y:0}, {x:0.42, y:0});
			core.drawLine('rgba(255, 255, 255, 1)', {x:0.58, y:0}, {x:1, y:0});
			if (room.walls.north.roomType === 'normal') {
				core.drawLine('rgba(125, 125, 125, 0.75)', {x:0.42, y:0}, {x:0.58, y:0});
			} else if (room.walls.north.roomType === 'boss') {
				core.drawLine('rgba(255, 0, 0, 0.75)', {x:0.42, y:0}, {x:0.58, y:0});
			} else if (room.walls.north.roomType === 'treasure') {
				core.drawLine('rgba(245, 245, 0, 0.75)', {x:0.42, y:0}, {x:0.58, y:0});
			}
		}
		if (!room.walls.south.entrance) {
			core.drawLine('rgba(255, 255, 255, 1)', {x:0, y:1}, {x:1, y:1});
		} else {
			core.drawLine('rgba(255, 255, 255, 1)', {x:0, y:1}, {x:0.42, y:1});
			core.drawLine('rgba(255, 255, 255, 1)', {x:0.58, y:1}, {x:1, y:1});
			if (room.walls.south.roomType === 'normal') {
				core.drawLine('rgba(125, 125, 125, 0.75)', {x:0.42, y:1}, {x:0.58, y:1});
			} else if (room.walls.south.roomType === 'boss') {
				core.drawLine('rgba(255, 0, 0, 0.75)', {x:0.42, y:1}, {x:0.58, y:1});
			} else if (room.walls.south.roomType === 'treasure') {
				core.drawLine('rgba(245, 245, 0, 0.75)', {x:0.42, y:1}, {x:0.58, y:1});
			}
		}
		if (!room.walls.east.entrance) {
			core.drawLine('rgba(255, 255, 255, 1)', {x:1, y:0}, {x:1, y:1});
		} else {
			core.drawLine('rgba(255, 255, 255, 1)', {x:1, y:0}, {x:1, y:0.43});
			core.drawLine('rgba(255, 255, 255, 1)', {x:1, y:0.57}, {x:1, y:1});
			if (room.walls.east.roomType === 'normal') {
				core.drawLine('rgba(125, 125, 125, 0.75)', {x:1, y:0.43}, {x:1, y:0.57});
			} else if (room.walls.east.roomType === 'boss') {
				core.drawLine('rgba(255, 0, 0, 0.75)', {x:1, y:0.43}, {x:1, y:0.57});
			} else if (room.walls.east.roomType === 'treasure') {
				core.drawLine('rgba(245, 245, 0, 0.75)', {x:1, y:0.43}, {x:1, y:0.57});
			}
		}
		if (!room.walls.west.entrance) {
			core.drawLine('rgba(255, 255, 255, 1)', {x:0, y:0}, {x:0, y:1});
		} else {
			core.drawLine('rgba(255, 255, 255, 1)', {x:0, y:0}, {x:0, y:0.43});
			core.drawLine('rgba(255, 255, 255, 1)', {x:0, y:0.57}, {x:0, y:1});
			if (room.walls.west.roomType === 'normal') {
				core.drawLine('rgba(125, 125, 125, 0.75)', {x:0, y:0.43}, {x:0, y:0.57});
			} else if (room.walls.west.roomType === 'boss') {
				core.drawLine('rgba(255, 0, 0, 0.75)', {x:0, y:0.43}, {x:0, y:0.57});
			} else if (room.walls.west.roomType === 'treasure') {
				core.drawLine('rgba(245, 245, 0, 0.75)', {x:0, y:0.43}, {x:0, y:0.57});
			}
		}

		//
		// Draw walled off entrances if there are still enemies alive
		if (room.enemies.length != 0) {
			if (room.walls.north.entrance) {
				core.drawLine('rgba(255, 35, 35, 1)', {x:0.42, y:0}, {x:0.58, y:0});
			}
			if (room.walls.south.entrance) {
				core.drawLine('rgba(255, 35, 35, 1)', {x:0.42, y:1}, {x:0.58, y:1});
			}
			if (room.walls.east.entrance) {
				core.drawLine('rgba(255, 35, 35, 1)', {x:1, y:0.43}, {x:1, y:0.57});
			}
			if (room.walls.west.entrance) {
				core.drawLine('rgba(255, 35, 35, 1)', {x:0, y:0.43}, {x:0, y:0.57});
			}
		}

		//
		// Render enemies
		for (let i = 0; i < room.enemies.length; i++) {
			Main.renderer.EnemyUnit.render(room.enemies[i]);
		}
		
		//
		// Render items
		for (let i = 0; i < room.items.length; i++) {
			Main.renderer.core.drawImage(
				Main.assets[room.items[i].image],
				0, 0,
				Main.assets[room.items[i].image].width, Main.assets[room.items[i].image].height,
				room.items[i].center.x, room.items[i].center.y,
				room.items[i].size.width, room.items[i].size.height
			);
		}
	};

	return that;
}(Main.renderer.core));
