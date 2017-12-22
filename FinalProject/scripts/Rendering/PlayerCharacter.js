// ------------------------------------------------------------------
//
// Rendering function for an /Components/PlayerCharacter object.
//
// ------------------------------------------------------------------
Main.renderer.PlayerCharacter = (function(core) {
	'use strict';
	var that = {};

	that.render = function(sprite) {
		Main.renderer.AnimatedSprite.render(sprite.sprite);
	};

	return that;
}(Main.renderer.core));
