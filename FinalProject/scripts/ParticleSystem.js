function ParticleSystem(spec, core) {
	'use strict';
	let that = {};
	let nextParticleID = 1;
	let particles = {};	// Set of all active particles

	that.create = function() {
		let p = {
				image: spec.image,
				size: Random.nextGaussian(spec.size.mean, spec.size.stdev),
				center: {x: spec.center.x, y: spec.center.y},
				direction: Random.nextCircleVector(),
				speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
				rotation: 0,
				lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// in seconds
				alive: 0	// in seconds
			};
		p.size = Math.max(1, p.size);
		p.lifetime = Math.max(0.01, p.lifetime);
		particles[nextParticleID++] = p;
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
		let value;
		let particle;
		for (value in particles) {
			if (particles.hasOwnProperty(value)) {
				particle = particles[value];
 				core.drawImage(
					particle.image,
					0, 0,
					particle.image.width, particle.image.height,
					particle.center.x, particle.center.y,
					particle.size/250, particle.size/250
				);
			}
		}
	};
	
	return that;
}
