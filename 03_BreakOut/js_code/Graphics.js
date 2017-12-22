GameScreens.graphics = (function() {
	'use strict';
	
	let canvas = document.getElementById('game-canvas');
	let context = canvas.getContext('2d');
	
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	function clear() {
		context.clear();
	}

	function drawImage(spec) {
		context.save();
		
		context.translate(spec.center.x, spec.center.y);
		context.rotate(spec.rotation);
		context.translate(-spec.center.x, -spec.center.y);
		
		context.drawImage(
			spec.image, 
			spec.center.x - spec.size/2, 
			spec.center.y - spec.size/2,
			spec.size, spec.size);
		
		context.restore();
	}
	
	function Texture(piece) {
		let that = {};
		let ready = false;
		let image = new Image();
		
		image.onload = function() { 
			ready = true;
		};
		image.src = piece.image;

		that.switchUp = function() {
			if (piece.up) {
				piece.up = false;
			} else {
				piece.up = true;
			}
		};

		that.switchRight = function() {
			if (piece.right) {
				piece.right = false;
			} else {
				piece.right = true;
			}
		};

		that.changeSpeed = function(newX, newY) {
			piece.moveRateX = newX;
			piece.moveRateY = newY;
		};

		that.changeWidth = function(newWidth) {
			piece.width = newWidth;
		};

		that.changeCenterLocation = function(newX, newY) {
			piece.center.x = newX;
			piece.center.y = newY;
		};

		that.changeDir = function(xDir, yDir) {
			piece.right = xDir;
			piece.up = yDir;
		};
		
		that.moveLeft = function(timeDifference) {
			if (piece.center.x - (piece.width / 2) <= 10) {
				piece.right = true;
				return;
			}
			piece.center.x -= piece.moveRateX * (timeDifference / 1000);
		};
		that.moveRight = function(timeDifference) {
			if (piece.center.x + (piece.width / 2) >= 990) {
				piece.right = false;
				return;
			}
			piece.center.x += piece.moveRateX * (timeDifference / 1000);
		};

		that.move = function(timeDifference) {
			//
			// move bounds the piece inside the borders
			if (piece.right) {
				if (piece.center.x + (piece.width / 2) >= 990) {
					piece.right = false;
				} else {
					piece.center.x += piece.moveRateX * (timeDifference / 1000);
				}
			} else {
				if (piece.center.x - (piece.width / 2) <= 10) {
					piece.right = true;
				} else {
					piece.center.x -= piece.moveRateX * (timeDifference / 1000);
				}
			}
			if (piece.up) {
				if (piece.center.y - (piece.height / 2) <= 10) {
					piece.up = false;
				} else {
					piece.center.y -= piece.moveRateY * (timeDifference / 1000);
				}
			} else {
				if (piece.center.y + (piece.width / 2) >= 540) {
					piece.up = true;
					return true;
				} else {
					piece.center.y += piece.moveRateY * (timeDifference / 1000);
				}
			}
		};
		
		that.draw = function() {
			if (ready && piece.alive) {
				context.save();
				
				context.translate(piece.center.x, piece.center.y);
				context.translate(-piece.center.x, -piece.center.y);
				context.drawImage(image,
					piece.center.x - piece.width/2, piece.center.y - piece.height/2,
					piece.width, piece.height);
				
				context.restore();
			}
		};

		that.makeDead = function() {
			piece.alive = false;
		}

		that.makeAlive = function() {
			piece.alive = true;
		}

		that.isAlive = function() {
			return piece.alive;
		}

		that.getInfo = function() {
			return {
				center: { x: piece.center.x, y: piece.center.y },
				width: piece.width, height: piece.height,
				moveRateX: piece.moveRateX, moveRateY: piece.moveRateY,
				right: piece.right, up: piece.up, alive: piece.alive
			};
		}
		
		return that;
	}

	function updateLives(count) {
		document.getElementById('lives').innerHTML = "";
		for (let life = 0; life < count; life++) {
			let img = document.createElement('IMG');

			img.setAttribute('src', 'images/white_rectangle.png');
			img.setAttribute('class', 'mark');
			img.setAttribute('width', '135');
			img.setAttribute('height', '10')

			document.getElementById('lives').appendChild(img);
			document.getElementById('lives').innerHTML += "&nbsp";
		}
	}

	return {
		clear: clear,
		Texture: Texture,
		updateLives: updateLives,
		drawImage: drawImage
	};
}());
