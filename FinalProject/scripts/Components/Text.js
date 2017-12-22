/* global Main */

//------------------------------------------------------------------
//
// Defines a text object. The spec is defined as:
//	{
//		text: '',
//		font: '',
//		fill: '',
//		position: { x: , y: },
//		speed: { x: , y: },
//		info: { lifeTime: , power: },
//	}
//
//------------------------------------------------------------------
Main.components.Text = function(spec) {
	'use strict';
	var that = {
		get text() { return spec.text; },
		set text(value) { spec.text = value; },
		get font() { return spec.font; },
		get fill() { return spec.fill; },
		get position() { return spec.position; },
		get speed() { return spec.speed; },
		get info() { return spec.info; },
	};

	return that;
};
