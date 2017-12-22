/* global Main */

//
// Rendering function for a /Components/Text object
Main.renderer.Text = (function(core) {
	'use strict';
	var that = {};

	that.render = function(text) {
		core.drawText(text);
	};

	return that;
}(Main.renderer.core));
