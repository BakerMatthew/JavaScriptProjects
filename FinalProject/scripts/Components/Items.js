//------------------------------------------------------------------
//
// Defines an Item component.  An Item contains a static image.
// The image is defined as:
//	{
//		image: '',
//		size: { width: , height: },	// In world coordinates
//		center: { x: , y: }			// In world coordinates
//	}
//
//------------------------------------------------------------------
Main.components.Items = function(spec) {
	'use strict';
	var	that = {
			get image() { return spec.image; },
			set image(value) { spec.image = value; },
			get center() { return spec.center; },
			get size() { return spec.size; }
		};

	return that;
};
