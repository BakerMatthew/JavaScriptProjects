// ------------------------------------------------------------------
//
// Rendering function for an /Components/EnemyUnit object.
//
// ------------------------------------------------------------------
Main.renderer.EnemyUnit = (function(core) {
	'use strict';
	var that = {};

	that.render = function(sprite) {
		if (sprite.type === 'ghost') {
			core.saveContext();
			core.rotateCanvas(sprite.center, Math.PI/2);
			Main.renderer.AnimatedSprite.render(sprite.sprite);
			core.restoreContext();
		} else {
			Main.renderer.AnimatedSprite.render(sprite.sprite);
		}
	};

	return that;
}(Main.renderer.core));
