/* global Main */

// ------------------------------------------------------------------
//
// Defines a Room object. The spec is defined as:
//	{
//		location: { x: , y: },
//		walls: { north: { entrance: true, roomType: '' }, south: , east: , west: },
//		active: ,
//		traversed: ,
//		selected: ,
//		enemies: [],
//		items: [ { image: ,x: ,y: ,width: ,height:  } ],
//		type: ,
//	}
//
// ------------------------------------------------------------------
Main.components.Room = function(spec) {
	'use strict';
	var that = {
		get location() { return spec.location; },
		get walls() { return spec.walls; },
		set walls(value) { spec.walls = value; },
		get active() { return spec.active; },
		set active(value) { spec.active = value; },
		get traversed() { return spec.traversed; },
		set traversed(value) { spec.traversed = value; },
		get selected() { return spec.selected; },
		set selected(value) { spec.traversed = value; },
		get enemies() { return spec.enemies; },
		set enemies(value) { spec.enemies = value; },
		get items() { return spec.items; },
		set items(value) { spec.items = value; },
		get type() { return spec.type; },
		set type(value) { spec.type = value; },
	};

	that.createEntranceAt = function(dir) {
		if (dir === 'N') {
			spec.walls.north.entrance = true;
		} else if (dir === 'S') {
			spec.walls.south.entrance = true;
		} else if (dir === 'E') {
			spec.walls.east.entrance = true;
		} else if (dir === 'W') {
			spec.walls.west.entrance = true;
		} else {
			console.log('Error: unable to create entrance at: ' + dir);
		}
	};

	that.update = function(room, timeDifference) {
		for (let i = 0; i < room.enemies.length; i++) {
			room.enemies[i].update(timeDifference);
		}
	};

	return that;
};
