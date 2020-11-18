// track whose turn it is
let activePlayer = 'X';
// store moves in an array
let selectedSquares = [];

// function for placing an X or O
function placeXOrO(squareIndex) {
	// for fun, so you can see the program's choices if you want
	console.log("your oppenent chose: " + squareIndex);

	// if a square has been clicked on, it'll be added to `selectedSquares`
	// first we check if the square just clicked is in `selectedSquares` already
	if (!selectedSquares.some(element => element.includes(squareIndex))) {
		// gets the square clicked
		let select = document.getElementById(squareIndex);
		// place an 'x' or 'o' depending on whose turn it is
		if (activePlayer === 'X') {
			select.style.backgroundImage = 'url("images/x.png")';
		} else {
			select.style.backgroundImage = 'url("images/o.png")';
		}
		// `squareNumber` and `activePlayer` are concatenated and added to `selectedSquares`
		selectedSquares.push(squareIndex + activePlayer);
		checkWinConditions(); // check for winner

		// switch active player
		if (activePlayer === 'X') {
			activePlayer = 'O';
		} else {
			activePlayer = 'X';
		}
		// plays placement sound
		audio('media/place.mp3');

		if (activePlayer === 'O') {
			disableClick(); // ensures player can't act during computer's turn
			setTimeout(function () { computersTurn(); }, 1000);
		}

		return true;
	}

	// function picks a random square to place an 'O'
	function computersTurn() {
		let success = false;
		let pickSquare;
		while(!success) {
			pickSquare = String(Math.floor(Math.random() * 9));
				if (placeXOrO(pickSquare)) {
				placeXOrO(pickSquare);
				success = true;
			}
		}
	}
}

/* // alt function?
function computersTurn() {
	let pickSquare = String(Math.floor(Math.random() * 9));
	placeXOrO(pickSquare);
} */

function checkWinConditions() {
		 if (arrayIncludes('0X', '1X', '2X')) { drawWinLine(50, 100, 558, 100); } 
	else if (arrayIncludes('3X', '4X', '5X')) { drawWinLine(50, 304, 558, 304); }
	else if (arrayIncludes('6X', '7X', '8X')) { drawWinLine(50, 508, 558, 508); }
	else if (arrayIncludes('0X', '3X', '6X')) { drawWinLine(100, 50, 100, 558); }
	else if (arrayIncludes('1X', '4X', '7X')) { drawWinLine(304, 50, 304, 558); }
	else if (arrayIncludes('2X', '5X', '8X')) { drawWinLine(508, 50, 508, 558); }
	else if (arrayIncludes('6X', '4X', '2X')) { drawWinLine(100, 508, 510, 90); }
	else if (arrayIncludes('0X', '4X', '8X')) { drawWinLine(100, 100, 520, 520); }
	else if (arrayIncludes('0O', '1O', '2O')) { drawWinLine(50, 100, 558, 100); }
	else if (arrayIncludes('3O', '4O', '5O')) { drawWinLine(50, 304, 558, 304); }
	else if (arrayIncludes('6O', '7O', '8O')) { drawWinLine(50, 508, 558, 508); }
	else if (arrayIncludes('0O', '3O', '6O')) { drawWinLine(100, 50, 100, 558); }
	else if (arrayIncludes('1O', '4O', '7O')) { drawWinLine(304, 50, 304, 558); }
	else if (arrayIncludes('2O', '5O', '8O')) { drawWinLine(508, 50, 508, 558); }
	else if (arrayIncludes('6O', '4O', '2O')) { drawWinLine(100, 508, 510, 90); }
	else if (arrayIncludes('0O', '4O', '8O')) { drawWinLine(100, 100, 520, 520); }
	// or, if the game is a tie:
	else if (selectedSquares.length >= 9) {
		audio('media/tie.mp3');
		setTimeout(function () {resetGame(); }, 1000);
	}
}

// checks the provided solutions in `checkWinConditions` against the contents of `selectedSquares`
function arrayIncludes(squareA, squareB, squareC) {
	const a = selectedSquares.includes(squareA);
	const b = selectedSquares.includes(squareB);
	const c = selectedSquares.includes(squareC);

	if (a === true && b === true && c === true) {
		return true;
	}
}

// temporarily makes body element unclickable
function disableClick() {
	body.style.pointerEvents = 'none';
	setTimeout(function() {body.style.pointerEvents = 'auto';}, 1000);
}

function audio(audioURL) {
	let audio = new Audio(audioURL); // create new object, passing path as parameter
	audio.play(); // play method plays audio
}

function drawWinLine(coordX1, coordY1, coordX2, coordY2) {
	const canvas = document.getElementById('win-lines');
	const c = canvas.getContext('2d');
	let x1 = coordX1, y1 = coordY1, x2 = coordX2, y2 = coordY2, x = x1, y = y1;

	function animateLineDrawing() {
		const animationLoop = requestAnimationFrame(animateLineDrawing);
		// clears recatangle from last loop iteration
		c.clearRect(0, 0, 608, 608);
		// starts a new path
		c.beginPath();
		// moves to starting point
		c.moveTo(x1, y1);
		// indicates end point
		c.lineTo(x, y);
		// sets width
		c.lineWidth = 10;
		// sets color
		c.strokeStyle = 'rgba(70, 255, 33, .8)';
		// draws using above parameters
		c.stroke();

		// checks if we've reached endpoint
		if (x1 <= x2 && y1 <= y2) {
			// adds 10 to previous end x point
			if (x < x2) { x += 10; }
			// adds 10 to previous end y point
			if (y < y2) { y += 10; }
			// cancels animation loop if it reaches the end points
			if (x >= x2 && y >= y2) { cancelAnimationFrame(animationLoop); }
		}
		// following statement adds functionality for 6-4-2 win condition
		if (x1 <= x2 && y1 >= y2) {
			if (x < x2) { x += 10; }
			if (y > y2) { y -= 10; }
			if (x >= x2 && y <= y2) { cancelAnimationFrame(animationLoop); }
		}
	}

	// clears canvas once line is drawn
	function clear() {
		const animationLoop = requestAnimationFrame(clear);
		c.clearRect(0, 0, 608, 608);
		cancelAnimationFrame(animationLoop);
	}
	// disables clicking while win sound is playing
	disableClick();
	// plays win sounds
	audio('media/winGame.mp3');

	animateLineDrawing();

	setTimeout(function () { clear(); resetGame(); }, 1000);
}

function resetGame() {
	for (let i = 0; i < 9; i++) {
		let square = document.getElementById(String(i));
		// removes backgroundImage elements
		square.style.backgroundImage = '';
	}
	// empties the array of unavailable options so we can start over
	selectedSquares = [];
}