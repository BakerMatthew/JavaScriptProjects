// ------------------------------------------------------------------
//
// Rendering function for an /Components/Bullet object.
//
// ------------------------------------------------------------------
Main.renderer.Bullet = (function(core) {
	'use strict';
	var that = {};

	that.render = function(sprite) {
		Main.renderer.AnimatedSprite.render(sprite.sprite);
	};

	return that;
}(Main.renderer.core));
