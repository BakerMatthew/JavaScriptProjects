function ParticleSystem(spec, graphics) {
	'use strict';
	let that = {};
	let nextName = 1;	// unique identifier for the next particle
	let particles = {};	// Set of all active particles
	let imageSrc = spec.image;

	spec.image = new Image();
	spec.image.onload = function() {
		// Replace the render function
		that.render = function() {
			let value;
			let particle;
			
			for (value in particles) {
				if (particles.hasOwnProperty(value)) {
					particle = particles[value];
					graphics.drawImage(particle);
				}
			}
		};
	};
	spec.image.src = imageSrc;

	that.create = function() {
		let p = {
				image: spec.image,
				size: Random.nextGaussian(5, 3),
				center: {x: spec.center.x, y: spec.center.y},
				direction: Random.nextCircleVector(spec.xDir, spec.yDir),
				speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
				rotation: 0,
				lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
				alive: 0	// How long the particle has been alive, in seconds
			};
		p.size = Math.max(1, p.size);
		p.lifetime = Math.max(0.01, p.lifetime);
		particles[nextName++] = p;
	};
	
	that.update = function(timeDifference) {
		let removeMe = [];
		let value;
		let particle;
		
		timeDifference = timeDifference / 1000;
		
		for (value in particles) {
			if (particles.hasOwnProperty(value)) {
				particle = particles[value];
				particle.alive += timeDifference;
				
				particle.center.x += (timeDifference * particle.speed * particle.direction.x);
				particle.center.y += (timeDifference * particle.speed * particle.direction.y);
				
				particle.rotation += particle.speed / 500;
				
				if (particle.alive > particle.lifetime) {
					removeMe.push(value);
				}
			}
		}

		for (particle = 0; particle < removeMe.length; particle++) {
			delete particles[removeMe[particle]];
		}
		removeMe.length = 0;
	};
	
	that.render = function() {
	};
	
	return that;
}
