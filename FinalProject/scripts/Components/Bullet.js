//------------------------------------------------------------------
//
// Defines a Bullet component.  A Bullet contains an animated sprite.
// The sprite is defined as:
//	{
//		size: { width: , height: },	// In world coordinates
//		center: { x: , y: }			// In world coordinates
//		speed: 						// World units per second
//		animationScale:				// (optional) Scaling factor for the frame animation times
//		spriteInfo: { sheet: , count: , time: [] },
// 		info: { lifetime: , power:  }
//	}
//
//------------------------------------------------------------------
Main.components.Bullet = function(spec) {
	'use strict';
	var sprite = null;
	var	that = {
			get center() { return sprite.center; },
			get sprite() { return sprite; },
			get size() { return spec.size; },
			get speed() { return spec.speed; },
			set speed(value) { spec.speed = value; },
			get info() { return spec.info; },
			get spriteInfo() { return spec.spriteInfo; },
		};

	that.update = function(timeDifference) {
		//
		// Update sprite
		sprite.update(timeDifference, true);

		//
		// Update lifetime
		spec.info.lifetime -= timeDifference;
			
		//
		// Update position
		spec.center.x += (spec.speed.x / 1000) * timeDifference;
		spec.center.y += (spec.speed.y / 1000) * timeDifference;
	};

	//
	// Get our animated bullet model and renderer created
	sprite = Main.components.AnimatedSprite({
		spriteSheet: Main.assets[spec.spriteInfo.sheet],
		spriteCount: spec.spriteInfo.count,
		spriteTime: spec.spriteInfo.time,
		animationScale: spec.animationScale,
		spriteSize: spec.size,			// Maintain the size on the sprite
		spriteCenter: spec.center		// Maintain the center on the sprite
	});

	return that;
};
