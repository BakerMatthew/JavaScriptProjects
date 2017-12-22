GameScreens.screens['game-play'] = (function(game, input, graphics, persistence) {
	'use strict';
	let cancelNextRequest;
	let prevTime;

	//
	// images holds the address location of used images (.png and .jpg)
	let images;
	//
	// particles holds all ParticleSystem objects from destroying bricks
	let particles;
	//
	// piecesInfo hold data about the pieces
	let piecesInfo;
	//
	// pieces holds the ball, paddle, walls, lives, ect.
	let pieces;
	//
	// labels currently only holds the score
	let labels;

	let keyboardInput;

	function initialize() {
		cancelNextRequest = false;
		prevTime = null;

		images = {
			border: 'images/white_border.png',
			ball: 'images/white_circle.png',
			paddle: 'images/white_rectangle.png',
			greenRectangle: 'images/green_rectangle.jpg',
			blueRectangle: 'images/blue_rectangle.jpg',
			orangeRectangle: 'images/orange_rectangle.png',
			yellowRectangle: 'images/yellow_rectangle.png',
			one: 'images/white_one.png',
			two: 'images/white_two.png',
			three: 'images/white_three.png'
		}

		particles = [];

		piecesInfo = {
			rowCount: 8,
			colCount: 14,
			brickHeight: 25,
			brickWidth: 69,
			paddleWidth: 135,

			brickSections: [],
			destroyedBrickCount: 0,
			completeRows: [],

			startingXSpeed: 90,
			startingYSpeed: 180,
			baseXSpeed: 90,
			baseYSpeed: 180,

			countDownFlag: true,
			countDownTimer: null,
			countDownSeconds: 3
		};

		pieces = {
			walls: graphics.Texture( {
				image: images.border,
				center: { x: 500, y: 275 },
				width: 1000, height: 550,
				moveRateX: 0, moveRateY: 0,
				right: true, up: true, alive: true
			}),
			paddle: graphics.Texture( {
				image: images.paddle,
				center: { x: 500, y: 530 },
				width: piecesInfo.paddleWidth, height: 10,
				moveRateX: 450, moveRateY: 0,
				right: true, up: true, alive: true
			}),
			ball: graphics.Texture( {
				image: images.ball,
				center: { x: 500, y: 515 },
				width: 12, height: 12,
				moveRateX: piecesInfo.baseXSpeed*0.5, moveRateY: piecesInfo.baseYSpeed,
				right: true, up: true, alive: true
			}),
			bricks: createBricks(),
			lives: 3,
			countdown: {
				one: graphics.Texture( {
					image: images.one,
					center: { x: 500, y: 225 },
					width: 225, height: 400,
					moveRateX: 0, moveRateY: 0,
					right: true, up: true, alive: true
				}),
				two: graphics.Texture( {
					image: images.two,
					center: { x: 500, y: 225 },
					width: 225, height: 400,
					moveRateX: 0, moveRateY: 0,
					right: true, up: true, alive: true
				}),
				three: graphics.Texture( {
					image: images.three,
					center: { x: 500, y: 225 },
					width: 225, height: 400,
					moveRateX: 0, moveRateY: 0,
					right: true, up: true, alive: true
				})
			}
		};
		labels = {
			score: 0
		};

		keyboardInput = input.Keyboard();
		keyboardInput.registerCommand(KeyEvent.DOM_VK_LEFT, pieces.paddle.moveLeft);
		keyboardInput.registerCommand(KeyEvent.DOM_VK_RIGHT, pieces.paddle.moveRight);
		keyboardInput.registerCommand(KeyEvent.DOM_VK_ESCAPE, exitMenu);

		graphics.updateLives(pieces.lives);
	}

	function updateHighScore() {		
		persistence.add(labels.score);
	}

	function exitMenu() {
		prevTime = null;
		piecesInfo.countDownTimer = null;
		cancelNextRequest = true;
		game.showScreen('main-menu'); 
	}

	function resetLife() {
		piecesInfo.baseXSpeed = piecesInfo.startingXSpeed;
		piecesInfo.baseYSpeed = piecesInfo.startingYSpeed;

		pieces.paddle.changeWidth(piecesInfo.paddleWidth);
		pieces.paddle.changeCenterLocation(500, 530);

		pieces.ball.changeSpeed(piecesInfo.baseXSpeed*0.55, piecesInfo.baseYSpeed);
		pieces.ball.changeCenterLocation(500, 515);
		pieces.ball.changeDir(true, true);

		piecesInfo.destroyedBrickCount = 0;


		graphics.updateLives(pieces.lives);
		piecesInfo.countDownFlag = true;
		prevTime = null;
	}

	function resetGame() {
		console.log('Game Over');

		pieces.bricks = createBricks();
		pieces.lives = 3;

		particles.length = 0;
		updateHighScore();
		labels.score = 0;

		resetLife();
	}
	
	function createBricks() {
		let bricks = [];
		for (let row = 0; row < piecesInfo.rowCount; row++) {
			let nextRow = [];
			let brickColor = getBrickColor(row);
			for (let col = 0; col < piecesInfo.colCount; col++) {
				let brick = graphics.Texture( {
					image: brickColor,
					center: { x: ((piecesInfo.brickWidth+1)*(col+1)) - 25, y: (27*(row+1)) + 40 },
					width: piecesInfo.brickWidth, height: piecesInfo.brickHeight,
					moveRateX: 0, moveRateY: 0,
					right: true, up: true, alive: true
				});
				nextRow.push(brick);
			}
			piecesInfo.brickSections.push((27*(row+1)) + 40);
			bricks.push(nextRow);
			piecesInfo.completeRows.push(piecesInfo.colCount);
		}
		return bricks;
	}

	function getBrickColor(row) {
		if (row < 2) {
			return images.greenRectangle;
		} else if (row < 4) {
			return images.blueRectangle;
		} else if (row < 6) {
			return images.orangeRectangle;
		} else {
			return images.yellowRectangle;
		}
	}

	function renderLabels() {
		document.getElementById('curr-score').textContent = labels.score;
	}

	function processInput(timeDifference) {
		keyboardInput.update(timeDifference);
	}

	function updateBallSpeed(speed) {
		piecesInfo.baseXSpeed += speed * 0.85;
		piecesInfo.baseYSpeed += speed;
		pieces.ball.changeSpeed(pieces.ball.getInfo().moveRateX, piecesInfo.baseYSpeed);
	}

	function checkBallSpeedUp() {
		if (piecesInfo.destroyedBrickCount === 4) {
			updateBallSpeed(40);
		} else if (piecesInfo.destroyedBrickCount === 12) {
			updateBallSpeed(60);
		} else if (piecesInfo.destroyedBrickCount === 36) {
			updateBallSpeed(80);
		} else if (piecesInfo.destroyedBrickCount === 62){
			updateBallSpeed(100);
		}
	}

	function drawCountDown() {
		if (!piecesInfo.countDownTimer) {
			piecesInfo.countDownSeconds = 3;
			piecesInfo.countDownTimer = new Date().getTime();
		}

		if ((new Date().getTime() - piecesInfo.countDownTimer) > 1000) {
			piecesInfo.countDownTimer = new Date().getTime();
			piecesInfo.countDownSeconds -= 1;
		}
		if (piecesInfo.countDownSeconds === 3) {
			pieces.countdown.three.draw();
		} else if (piecesInfo.countDownSeconds === 2) {
			pieces.countdown.two.draw();
		} else if (piecesInfo.countDownSeconds === 1) {
			pieces.countdown.one.draw();
		} else if (piecesInfo.countDownSeconds === 0) {
			piecesInfo.countDownTimer = null;
			piecesInfo.countDownFlag = false;
		}
	}

	function processBall(timeDifference) {
		if (pieces.ball.move(timeDifference)) { // Returns true if the ball hits the bottom
			pieces.lives -= 1;
			if (pieces.lives === 0) {
				resetGame();
			} else {
				resetLife();
			}
		}
	}

	function haveCollided(r1, r2) {
		return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top)
	}

	function updateScore(row) {
		piecesInfo.completeRows[row] -= 1;
		if (piecesInfo.completeRows[row] === 0) {
			labels.score += 25;
		}
		if (row < 2) {
			labels.score += 5;
		} else if (row < 4) {
			labels.score += 3;
		} else if (row < 6) {
			labels.score += 2;
		} else {
			labels.score += 1;
		}
	}

	function checkPaddleSize(row) {
		if (row === 0 && pieces.paddle.getInfo().width >= 100) {
			pieces.paddle.changeWidth(pieces.paddle.getInfo().width/2);
		}
	}

	function changeBallAngle(ball, paddle) {
		let xDir = (ball.center.x - paddle.center.x) / (paddle.width / 2);

		if (xDir >= 0) {
			pieces.ball.changeDir(true, true);
		} else {
			pieces.ball.changeDir(false, true);
		}

		if (xDir < 0) {
			xDir *= -1;
		}
		pieces.ball.changeSpeed(piecesInfo.baseXSpeed * xDir, piecesInfo.baseYSpeed);
	}

	function getPieceSides(piece) {
		let p = piece.getInfo();
		return {
			left: p.center.x - (p.width / 2),
			right: p.center.x + (p.width / 2),
			top: p.center.y - (p.height),
			bottom: p.center.y + (p.height / 2)
		};
	}

	function getSumFor(arr) {
		return arr.reduce(function(a, b) { return a + b; }, 0);
	}

	function createBrickParticle(brick, ball, color) {
		particles.push(ParticleSystem( {
				image: color,
				center: {x: ball.center.x, y: brick.center.y},
				speed: {mean: ball.moveRateY / 1.65, stdev: ball.moveRateY / 7},
				lifetime: {mean: 0.8, stdev: 0.3},
				xDir: ball.right, yDir: ball.up
			}, graphics));
		particles.push(ParticleSystem( {
				image: color,
				center: {x: ball.right ? Math.max(ball.center.x - 12, brick.center.x - brick.width) : Math.min(ball.center.x + 20, brick.center - brick.width), y: brick.center.y + brick.height / 4},
				speed: {mean: ball.moveRateY / 1.6, stdev: ball.moveRateY / 7.2},
				lifetime: {mean: 0.75, stdev: 0.3},
				xDir: ball.right, yDir: ball.up
			}, graphics));
		particles.push(ParticleSystem( {
				image: color,
				center: {x: ball.right ? Math.max(ball.center.x + 12, brick.center.x - brick.width) : Math.min(ball.center.x - 20, brick.center - brick.width), y: brick.center.y - brick.height / 4},
				speed: {mean: ball.moveRateY / 1.6, stdev: ball.moveRateY / 6.8},
				lifetime: {mean: 0.75, stdev: 0.3},
				xDir: ball.right, yDir: ball.up
			}, graphics));
		for (let i = 0; i < Math.floor(Math.random() * (25 - 18 + 1)) + 18; i++) {
			particles[particles.length-1].create();
		}
		for (let i = 0; i < Math.floor(Math.random() * (25 - 18 + 1)) + 18; i++) {
			particles[particles.length-2].create();
		}
		for (let i = 0; i < Math.floor(Math.random() * (25 - 18 + 1)) + 18; i++) {
			particles[particles.length-3].create();
		}
	}

	function brickDetection(ball, ballBoundaries) {
		for (let row = piecesInfo.rowCount-1; row >= 0; row--) {
			if (ball.center.y < piecesInfo.brickSections[row] + piecesInfo.brickHeight + 1 && ball.center.y > piecesInfo.brickSections[row] - piecesInfo.brickHeight - 1) {
				for (let col = 0; col < piecesInfo.colCount; col++) {
					if (pieces.bricks[row][col].isAlive()) {
						let brickBoundaries = getPieceSides(pieces.bricks[row][col]);
						brickBoundaries.top += 12;
						brickBoundaries.bottom -= 1;
						if (haveCollided(ballBoundaries, brickBoundaries)) {
							createBrickParticle(pieces.bricks[row][col].getInfo(), ball, getBrickColor(row));

							if (brickBoundaries.top < ball.center.y && ball.center.y < brickBoundaries.bottom) {
								pieces.ball.switchRight();
							} else {
								pieces.ball.switchUp();
							}
							pieces.bricks[row][col].makeDead();
							updateScore(row);
							piecesInfo.destroyedBrickCount += 1;
							checkBallSpeedUp();
							checkPaddleSize(row);
							if (getSumFor(piecesInfo.completeRows) === 0) {
								resetGame();
							}
							return;
						}
					}
				}
			}
		}
	}

	function paddleDetection(ball, ballBoundaries) {
		let paddleBoundaries = getPieceSides(pieces.paddle);
		if (haveCollided(ballBoundaries, paddleBoundaries)) {
			pieces.ball.switchUp();
			changeBallAngle(ball, pieces.paddle.getInfo());
		}
	}

	function checkCollision() {
		let ball = pieces.ball.getInfo();
		let ballBoundaries = getPieceSides(pieces.ball);
		if (ball.center.y < 280) {
			brickDetection(ball, ballBoundaries);
		} else if (!ball.up && ball.center.y > 519) {
			paddleDetection(ball, ballBoundaries);
		}
	}

	function drawPieces() {
		graphics.clear();
		for (let row = 0; row < piecesInfo.rowCount; row++) {
			for (let col = 0; col < piecesInfo.colCount; col++) {
				pieces.bricks[row][col].draw();
			}
		}
		if (piecesInfo.countDownFlag) {
			drawCountDown();
		}
		for (let i = 0; i < particles.length; i++) {
			particles[i].render();
		}
		pieces.walls.draw();
		pieces.paddle.draw();
		pieces.ball.draw();
	}

	function update(timeDifference) {
		if (!piecesInfo.countDownFlag) {
			processInput(timeDifference);
			processBall(timeDifference);
			checkCollision();

			for (let i = 0; i < particles.length; i++) {
				particles[i].update(timeDifference);
			}
		}
	}

	function render() {
		renderLabels();
		drawPieces();
	}

	function gameLoop(currTime) {
		if (!prevTime) {
			prevTime = currTime;
		}
		let timeDifference = currTime - prevTime;
		prevTime = currTime;
		update(timeDifference);
		render();
		
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize: initialize,
		run: run,
		restartGame: resetGame
	};
}(GameScreens.game, GameScreens.input, GameScreens.graphics, GameScreens.persistence));
