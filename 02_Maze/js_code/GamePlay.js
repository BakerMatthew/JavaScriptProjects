MazeScreens.screens['game-play'] = (function(game) {
	'use strict';
	var cancelNextRequest = false;
	var prevTime = null;
	var maze = {
		grid: [],
		width: 0,
		height: 0,
		shortestPath: [],
		startingDistance: 0,
		displayShortestPath: false,
		displayBreadcrumbs: false,
		wallColorInterval: 0,
		wallColorIntervalSize: 0,
		changeWallColor: false,
		displayScore: true,
		displayHint: false,
		solved: false,
		wallColors: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 75, 255)', 'rgb(255, 255, 255)'],
		player: {
			x: 0,
			y: 0
		}
	};
	var timer = {
		mazeTimer: 0,
		currInterval: 0,
	};
	var highScores = [120, 100, 80];
	var currScore = 0;
	let canvas = null;
	let context = null;
	
	function initialize() {
		document.getElementById('id-game-play-back').addEventListener(
		'click',
		function() {
			cancelNextRequest = true; 
			game.showScreen('main-menu'); 
		});
		document.getElementById('small-maze').addEventListener(
		'click',
		function() {
			generateMaze(10, 5);
		});
		document.getElementById('medium-maze').addEventListener(
		'click',
		function() {
			generateMaze(20, 10);
		});
		document.getElementById('large-maze').addEventListener(
		'click',
		function() {
			generateMaze(30, 15); 
		});
		document.getElementById('huge-maze').addEventListener(
		'click',
		function() {
			generateMaze(40, 20);
		});
		document.getElementById('display-path').addEventListener(
		'click',
		function() {
			if (maze.displayShortestPath) {
				maze.displayShortestPath = false;
			} else {
				maze.displayShortestPath = true;
			}
		});
		document.getElementById('display-breadcrumb').addEventListener(
		'click',
		function() {
			if (maze.displayBreadcrumbs) {
				maze.displayBreadcrumbs = false;
			} else {
				maze.displayBreadcrumbs = true;
			}
		});
		document.getElementById('display-score').addEventListener(
		'click',
		function() {
			if (!maze.solved) {
				if (maze.displayScore) {
					maze.displayScore = false;
				} else {
					maze.displayScore = true;
				}
			}
		});
		document.getElementById('display-hint').addEventListener(
		'click',
		function() {
			if (maze.displayHint) {
				maze.displayHint = false;
			} else {
				maze.displayHint = true;
			}
		});
		document.addEventListener('keydown', function(event) {
			if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.keyCode == 32) {
				event.preventDefault();
			}
			if (!maze.solved) {
				movePlayer(event.key);
			}
			if (event.key === 'h') {
				toggleHint();
			} else if (event.key === 'b') {
				toggleBreadcrumbs();
			} else if (event.key === 'p') {
				togglePath();
			} else if (event.key === 'y' && !maze.solved ) {

				toggleScore();
			}
		});

		canvas = document.getElementById('maze-canvas');
    	context = canvas.getContext('2d');
		CanvasRenderingContext2D.prototype.clear = function() {
			this.save();
			this.setTransform(1, 0, 0, 1, 0, 0);
			this.clearRect(0, 0, canvas.width, canvas.height);
			this.restore();
		};

		generateMaze(20, 10);
	}

	function movePlayer(key) {
		var playerMoved = false;
		if (key === 'w' || key === 'i' || key === 'ArrowUp') {
			if (!maze.grid[maze.player.y][maze.player.x].hasNorthWall()) {
				maze.player.y -= 1;
				playerMoved = true;
			}
		} else if (key === 's' || key === 'k' || key === 'ArrowDown') {
			if (!maze.grid[maze.player.y][maze.player.x].hasSouthWall()) {
				maze.player.y += 1;
				playerMoved = true;
			}
		} else if (key === 'a' || key === 'j' || key === 'ArrowLeft') {
			if (!maze.grid[maze.player.y][maze.player.x].hasWestWall()) {
				maze.player.x -= 1;
				playerMoved = true;
			}
		} else if (key === 'd' || key === 'l' || key === 'ArrowRight') {
			if (!maze.grid[maze.player.y][maze.player.x].hasEastWall()) {
				maze.player.x += 1;
				playerMoved = true;
			}
		}

		if (maze.player.x === maze.width-1 && maze.player.y === maze.height-1) {
			triggerEndGame();
		} else {
			if (maze.shortestPath.length >= 2 && playerMoved) {
				if (maze.player.x === maze.shortestPath[maze.shortestPath.length-2].x  && maze.player.y === maze.shortestPath[maze.shortestPath.length-2].y) {
					maze.shortestPath.pop();
					if (!maze.grid[maze.player.y][maze.player.x].hasBeenTraversed()) {
						currScore += 1;
					}
				} else {
					maze.shortestPath.push({x: maze.player.x, y: maze.player.y});
					currScore -= 1;
					if (currScore < 0) {
						currScore = 0;
					}
				}
				maze.grid[maze.player.y][maze.player.x].setTraversed();
				maze.displayHint = false;
			} else if (playerMoved) {
				maze.shortestPath.push({x: maze.player.x, y: maze.player.y});
				currScore -= 1;
				if (currScore < 0) {
					currScore = 0;
				}
				maze.grid[maze.player.y][maze.player.x].setTraversed();
				maze.displayHint = false;
			}
		}
	}

	function triggerEndGame() {
		maze.shortestPath.length = 0
		maze.solved = true;
		maze.displayScore = true;
		currScore += timer.mazeTimer + 1;

		if (currScore > highScores[0]) {
			highScores.splice(0, 0, currScore);
		} else {
			var scoreAdded = false;
			for (var i = 0; i < highScores.length - 1; i++) {
				if (currScore > highScores[i+1]) {
					highScores.splice(i+1, 0, currScore);
					scoreAdded = true;
					break;
				}
			}
			if (!scoreAdded) {
				highScores.push(currScore);
			}
		}
		
		document.getElementById('high-scores-span').innerHTML = '';
		for (var i = 0; i < highScores.length; i++) {
			document.getElementById('high-scores-span').innerHTML += highScores[i] + '<br>';
		}
	}

	function toggleHint() {
		if (maze.displayHint) {
			maze.displayHint = false;
		} else {
			maze.displayHint = true;
		}
	}

	function toggleBreadcrumbs() {
		if (maze.displayBreadcrumbs) {
			maze.displayBreadcrumbs = false;
		} else {
			maze.displayBreadcrumbs = true;
		}
	}

	function togglePath() {
		if (maze.displayShortestPath) {
			maze.displayShortestPath = false;
		} else {
			maze.displayShortestPath = true;
		}
	}

	function toggleScore() {
		if (maze.displayScore) {
			maze.displayScore = false;
		} else {
			maze.displayScore = true;
		}
	}

	function generateMaze(mazeWidth, mazeHeight) {
		maze.grid.length = 0;
		maze.width = mazeWidth;
		maze.height = mazeHeight;
		maze.shortestPath.length = 0
		maze.wallColorInterval = 2000;
		maze.changeWallColor = false;
		maze.solved = false;
		timer.mazeTimer = 100;
		timer.currInterval = 0;
		currScore = 0;
		maze.player.x = 0;
		maze.player.y = 0;

		for (var y = 0; y < maze.height; y++) {
			maze.grid.push([]);
			for (var x = 0; x < maze.width; x++) {
				maze.grid[y].push(mazeNode({
					traversed: false,
					northWall: false, southWall: false, eastWall: false, westWall: false,
					southWallColor: maze.wallColors[Math.floor(Math.random() * maze.wallColors.length)], eastWallColor: maze.wallColors[Math.floor(Math.random() * maze.wallColors.length)]
				}));
			}
		}
		maze.grid[0][0].setTraversed();
		createOuterWalls();
		mazeGenerator(0, 0, maze.width, maze.height, determineOrientation(maze.width, maze.height));
		//displayTerminalMaze();
		findShortestPath();
	}

	function drawCanvasMaze() {
		context.clear();
		
		context.lineWidth = 3;
		context.beginPath();
		context.strokeStyle = 'rgb(0, 255, 255)';
		context.moveTo(0, 0);
		context.lineTo(999, 0);
		context.lineTo(999, 499);
		context.lineTo(0, 499);
		context.stroke();
		context.closePath();
		for (let y = 0; y < maze.height; y++) {
			for (let x = 0; x < maze.width; x++) {
				drawMazeNode(y, x);
			}
		}
		if (maze.changeWallColor) {
			maze.changeWallColor = false;
		}

		if (maze.displayBreadcrumbs) {
			context.beginPath();
			context.rect((maze.player.x + 0.15) * (1000 / maze.width), (maze.player.y + 0.15) * (500 / maze.height), 0.7 * (1000 / maze.width), 0.7 * (500 / maze.height));
			context.fillStyle = 'rgb(50, 50, 50)';
			context.fill();
		}
		
		context.lineWidth = 1;
		if (maze.displayShortestPath) {
			drawShortestPath();
		}
		if (maze.displayHint) {
			drawHint();
		}
		drawEndPiece();
		drawPlayer();
	}

	function drawHint() {
		if (maze.shortestPath.length >= 2) {
			var x = maze.shortestPath[maze.shortestPath.length-2].x;
			var y = maze.shortestPath[maze.shortestPath.length-2].y;
			context.beginPath();
			context.rect((x + 0.25) * (1000 / maze.width), (y + 0.25) * (500 / maze.height), 0.5 * (1000 / maze.width), 0.5 * (500 / maze.height));
			context.fillStyle = 'yellow';
			context.fill();
		}
	}

	function drawPlayer() {
		var centerX = maze.player.x * (1000 / maze.width) + ((1000 / maze.width) / 2);
		var centerY = maze.player.y * (500 / maze.height) + ((500 / maze.height) / 2);
		if (maze.player.x === 0) {
			centerX = 0;
		}
		if (maze.player.y === 0) {
			centerY = 0;
		}
		if (maze.player.x === 0) {
			centerX += (1000 / maze.width) / 2;
		}
		if (maze.player.y === 0) {
			centerY += (500 / maze.height) / 2;
		}
		var radius = 250 / maze.width;

		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.fillStyle = 'rgb(255, 0, 0)';
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = 'rgb(200, 200, 200)';
		context.stroke();
	}

	function drawEndPiece() {
		var centerX = (maze.width-1) * (1000 / maze.width) + ((1000 / maze.width) / 2);
		var centerY = (maze.height-1) * (500 / maze.height) + ((500 / maze.height) / 2);
		var radius = 250 / maze.width;

		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.fillStyle = 'rgb(0, 0, 255)';
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = 'rgb(200, 200, 200)';
		context.stroke();
	}

	function drawMazeNode(y, x) {
		drawBreadcrumb(y, x);

		// Draw North
		// if (maze.grid[y][x].hasNorthWall()) {
		// 	drawSingleWall(y, y, x, x+1);
		// }

		// Draw South
		if (maze.grid[y][x].hasSouthWall() && y != maze.height-1) {
			maze.grid[y][x].setSouthWallColor(drawSingleWall(y+1, y+1, x, x+1, maze.grid[y][x].getSouthWallColor()));
		}

		// Draw East
		if (maze.grid[y][x].hasEastWall() && x != maze.width-1) {
			maze.grid[y][x].setEastWallColor(drawSingleWall(y, y+1, x+1, x+1, maze.grid[y][x].getEastWallColor()));
		}

		// // Draw West
		// if (maze.grid[y][x].hasWestWall()) {
		// 	drawSingleWall(y, y+1, x, x);
		// }
	}

	function drawBreadcrumb(y, x) {
		if (maze.displayBreadcrumbs) {
			if (maze.grid[y][x].hasBeenTraversed()) {
				context.beginPath();
				context.rect((x + 0.1) * (1000 / maze.width), (y + 0.1) * (500 / maze.height), 0.8 * (1000 / maze.width), 0.8 * (500 / maze.height));
				context.fillStyle = 'rgb(50, 50, 50)';
				context.fill();
			}
		}
	}

	function drawSingleWall(y1, y2, x1, x2, prevWallColor) {
		context.beginPath();
		var strokeStyle = ''
		if (maze.changeWallColor) {
			strokeStyle = maze.wallColors[Math.floor(Math.random() * maze.wallColors.length)];
		} else {
			strokeStyle = prevWallColor;
		}
		context.strokeStyle = strokeStyle;
		//context.strokeStyle = 'rgb(255, 255, 255)';
		context.moveTo(x1 * (1000 / maze.width), y1 * (500 / maze.height));
		context.lineTo(x2 * (1000 / maze.width), y2 * (500 / maze.height));
		context.stroke();
		context.closePath();
		return strokeStyle;
	}

	function drawShortestPath() {
		for (var i = 0; i < maze.shortestPath.length; i++) {
			var x = maze.shortestPath[i].x;
			var y = maze.shortestPath[i].y;
			context.beginPath();
			context.rect((x + 0.25) * (1000 / maze.width), (y + 0.25) * (500 / maze.height), 0.5 * (1000 / maze.width), 0.5 * (500 / maze.height));
			context.fillStyle = 'yellow';
			context.fill();
		}
	}

	function createOuterWalls() {
		// Horizontal Borders
		for (var x = 0; x < maze.width; x++) {
			maze.grid[0][x].createWallAt('N');
			maze.grid[maze.height-1][x].createWallAt('S');
		}
		// Vertical Borders
		for (var y = 0; y < maze.height; y++) {
			maze.grid[y][0].createWallAt('W');
			maze.grid[y][maze.width-1].createWallAt('E');
		}
	}

	function mazeGenerator(currXPosition, currYPosition, currWidth, currHeight, currOrientation) {
		if (currWidth < 2 || currHeight < 2) {
			return;
		}

		//displayTerminalMaze();

		// Find location of wall
		var wallXLocation = currXPosition;
		var wallYLocation = currYPosition;
		if (currOrientation === 'H') {
			wallYLocation += Math.floor(Math.random() * (currHeight-2));
		} else {
			wallXLocation += Math.floor(Math.random() * (currWidth-2));
		}

		// Find location of passage through wall
		var passageXinWall = wallXLocation;
		var passageYinWall = wallYLocation;
		if (currOrientation === 'H') {
			passageXinWall += Math.floor(Math.random() * currWidth);
		} else {
			passageYinWall += Math.floor(Math.random() * currHeight);
		}

		// Determine length of wall
		var wallLength = 0;
		if (currOrientation == 'H') {
			wallLength = currWidth;
		} else {
			wallLength = currHeight;
		}

		// Create wall in maze.grid[y][x]
		for (var i = 0; i < wallLength; i++) {
			if (currOrientation === 'H') {
				if (wallXLocation === passageXinWall) {
					wallXLocation++;
					continue;
				}
				maze.grid[wallYLocation][wallXLocation].createWallAt('S');
				if (wallYLocation+1 < maze.height){
					maze.grid[wallYLocation+1][wallXLocation].createWallAt('N');
				}
				wallXLocation++;
			} else {
				if (wallYLocation === passageYinWall) {
					wallYLocation++;
					continue;
				}
				maze.grid[wallYLocation][wallXLocation].createWallAt('E');
				if (wallXLocation+1 < maze.width){
					maze.grid[wallYLocation][wallXLocation+1].createWallAt('W');
				}
				wallYLocation++;
			}
		}

		// Find next recursion
		var nextX = currXPosition;
		var nextY = currYPosition;
		var nextWidth = currWidth;
		var nextHeight = currHeight;
		if (currOrientation === 'H') {
			nextHeight = wallYLocation - currYPosition+1;
		} else {
			nextWidth = wallXLocation - currXPosition+1;
		}
		mazeGenerator(nextX, nextY, nextWidth, nextHeight, determineOrientation(nextWidth, nextHeight));

		if (currOrientation === 'H') {
			nextY = wallYLocation + 1;
		} else {
			nextX = wallXLocation + 1;
		}
		if (currOrientation === 'H') {
			nextHeight = currYPosition + currHeight - wallYLocation - 1;
		} else {
			nextWidth = currXPosition + currWidth - wallXLocation - 1;
		}
		mazeGenerator(nextX, nextY, nextWidth, nextHeight, determineOrientation(nextWidth, nextHeight));
	}

	function determineOrientation(currWidth, currHeight) {
		if (currWidth < currHeight) {
			return 'H';
		} else if (currWidth > currHeight) {
			return 'V';
		} else {
			if (Math.floor(Math.random() * 2) == 0) {
				return 'H';
			} else {
				return 'V';
			}
		}
	}

	function mazeNode(data) {
		/*
		var data = {
			traversed: false,
			northWall: false, southWall: false, eastWall: false, westWall: false,
			southWallColor: '', eastWallColor: ''
		};
		*/
		var that = {};

		that.hasBeenTraversed = function() {
			return data.traversed;
		};
		that.setTraversed = function() {
			data.traversed = true;
		}
		that.hasNorthWall = function() {
			return data.northWall;
		};
		that.hasSouthWall = function() {
			return data.southWall;
		};
		that.hasEastWall = function() {
			return data.eastWall;
		};
		that.hasWestWall = function() {
			return data.westWall;
		};
		that.createWallAt = function(dir) {
			if (dir === 'N') {
				data.northWall = true;
			} else if (dir === 'S') {
				data.southWall = true;
			} else if (dir === 'E') {
				data.eastWall = true;
			} else if (dir === 'W') {
				data.westWall = true;
			} else {
				console.log('Error: unable to create wall at: ' + dir);
			}
		};
		that.getSouthWallColor = function() {
			return data.southWallColor;
		}
		that.getEastWallColor = function() {
			return data.eastWallColor;
		}
		that.setSouthWallColor = function(color) {
			data.southWallColor = color;
		}
		that.setEastWallColor = function(color) {
			data.eastWallColor = color;
		}

		return that;
	}

	function displayTerminalMaze() {
		console.log('-- Displaying Maze --');
		var topLine = '|'
		for (var x = 0; x < maze.height; x++) {
			topLine += '-';
			if ( x != maze.width-1) {
				topLine += ' ';
			}
		}
		topLine += '|'
		console.log(topLine);

		for (var y = 0; y < maze.height; y++) {
			var verLine = '|';
			var belowLine = '|';
			for (var x = 0; x < maze.width; x++) {
				// Side
				verLine += 'x';
				if (maze.grid[y][x].hasEastWall()) {
					verLine += '|';
				} else {
					verLine += 'x';
				}

				// Below
				if (maze.grid[y][x].hasSouthWall()) {
					belowLine += '-';
				} else {
					belowLine += 'x';
				}
				if (x != maze.width-1) {
					belowLine += '-';
				}
			}
			belowLine += '|'
			console.log(verLine);
			console.log(belowLine);
		}
	}

	function findShortestPath() {
		if (!maze.grid[0][0].hasSouthWall()) {
			helperFindShortestPath(0, 1, 0, 0);
		}
		if (!maze.grid[0][0].hasEastWall()) {
			helperFindShortestPath(1, 0, 0, 0);
		}
		maze.shortestPath.push({x: 0, y: 0});
		maze.startingDistance = maze.shortestPath.length
	}

	function helperFindShortestPath(x, y, parentX, parentY) {
		var correctPath = false;
		if (x === maze.width-1 && y === maze.height-1) {
			correctPath = true;
			return correctPath;
		} else {
			if (!maze.grid[y][x].hasNorthWall() && y-1 != parentY && !correctPath) {
				correctPath = helperFindShortestPath(x, y-1, x, y)
			}
			if (!maze.grid[y][x].hasSouthWall() && y+1 != parentY && !correctPath) {
				correctPath = helperFindShortestPath(x, y+1, x, y);
			}
			if (!maze.grid[y][x].hasEastWall() && x+1 != parentX && !correctPath) {
				correctPath = helperFindShortestPath(x+1, y, x, y);
			}
			if (!maze.grid[y][x].hasWestWall() && x-1 != parentX && !correctPath) {
				correctPath = helperFindShortestPath(x-1, y, x, y);
			}
		}
		if (correctPath) {
			maze.shortestPath.push({x: x, y: y});
		}
		return correctPath;
	}

	function update(currTime) {
		if (maze.shortestPath.length >= Math.floor(maze.startingDistance*1.5)) {
			maze.wallColorIntervalSize = 2500;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance*1.25)) {
			maze.wallColorIntervalSize = 2200;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance*1)) {
			maze.wallColorIntervalSize = 2000;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/1.15)) {
			maze.wallColorIntervalSize = 1800;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/1.30)) {
			maze.wallColorIntervalSize = 1600;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/1.45)) {
			maze.wallColorIntervalSize = 1400;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/1.60)) {
			maze.wallColorIntervalSize = 1200;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/1.75)) {
			maze.wallColorIntervalSize = 1000;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/1.90)) {
			maze.wallColorIntervalSize = 850;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/2.05)) {
			maze.wallColorIntervalSize = 750;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/2.5)) {
			maze.wallColorIntervalSize = 650;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/3)) {
			maze.wallColorIntervalSize = 450;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/3.5)) {
			maze.wallColorIntervalSize = 350;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/4.5)) {
			maze.wallColorIntervalSize = 250;
		} else if (maze.shortestPath.length >= Math.floor(maze.startingDistance/5)) {
			maze.wallColorIntervalSize = 200;
		}
		if (maze.shortestPath.length === 0) {
			maze.wallColorIntervalSize = 100;
		}
		maze.wallColorInterval += currTime;
		if (maze.wallColorInterval >= maze.wallColorIntervalSize) {
			maze.wallColorInterval = 0;
			maze.changeWallColor = true;
		}
		timer.currInterval += currTime;
		if (timer.currInterval >= 1000) {
			timer.currInterval = 0;
			if (timer.mazeTimer > 0 && !maze.solved) {
				timer.mazeTimer -= 1;
			}
		}
	}

	function updateLabels() {
		document.getElementById('curr-time').textContent = timer.mazeTimer;
		if (maze.displayScore) {
			document.getElementById('curr-score').textContent = currScore;
		} else {
			document.getElementById('curr-score').textContent = '?';
		}
	}

	function render() {
		drawCanvasMaze();
		updateLabels();
	}

	function gameLoop(currTime) {
		if (!prevTime) {
			prevTime = currTime;
		}
		var timeDifference = currTime - prevTime;
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
		initialize : initialize,
		run : run
	};
}(MazeScreens.game));
