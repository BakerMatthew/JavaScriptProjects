//------------------------------------------------------------------
//
// Defines a PlayerCharacter component.  A PlayerCharacter contains an animated sprite.
// The sprite is defined as:
//	{
//		image:  ,
//		size: { width: , height: },	// In world coordinates
//		center: { x: , y: }			// In world coordinates
//		speed: { current: , max: },	// World units per second
//	}
//
//------------------------------------------------------------------
Main.components.PlayerCharacter = function(spec) {
	'use strict';
	var sprite = null;
	var	that = {
			get image() { return spec.image; },
			set image(value) { spec.image = value; },
			get center() { return sprite.center; },
			get sprite() { return sprite; },
			get size() { return spec.size; },
			get speed() { return spec.speed; }
		};

	that.update = function(timeDifference) {
		sprite.update(timeDifference, true);
	};

	//
	// Get our animated PlayerCharacter model and renderer created
	sprite = Main.components.AnimatedSprite({
		spriteSheet: Main.assets[spec.image],
		spriteCount: 5,
		spriteTime: [60, 60, 60, 60, 60],
		animationScale: spec.animationScale,
		spriteSize: spec.size,			// Maintain the size on the sprite
		spriteCenter: spec.center		// Maintain the center on the sprite
	});

	return that;
};
