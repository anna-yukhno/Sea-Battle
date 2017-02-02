function rand(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
//constructor of the cells
function Cell() {
	this.ship= false;
	this.opened= false;
	this.msg= "missed!";
}
//constructor of the game
function SeaBattle(size) {
var self = this;
//initialization of the game area
	this.field=(function(size) {
		var field = [];
		for (var i = 0; i < size; i++) {
			field[i] = [];
			for (var j = 0; j < size; j++) {
				var str = '' + i + ',' + j;
				var div = document.createElement('div');
				document.getElementById("field").appendChild(div);
				div.className = "cell";
				//div.textContent = str;
				div.setAttribute("id", str);
				field[i][j] = new Cell();
		//onClick handler for each cells
				div.onclick = function () {
					var coordinates = this.getAttribute('id').split(',');
					shoot(coordinates[0], coordinates[1]);
				}
			}
		}
		return field;
	})(size);

//simulate a shot by coordinates
	var shoot= function(x, y) {
		if (!validate(x, y)) {
			alert('Not existing coordinates');
		} else {
			var cell = self.field[x][y];
			if (cell.opened) {
				console.info("Already opened, +1 shot: " + x + ' - ' + y);//if the cell's opened add 1 shot
				//timer++;  //only for selfPlay game
			} else {
				cell.opened = true;
				console.info(cell.msg+ ': ' + x + ' - ' + y);
				cell.ship? document.getElementById('' + x +','+ y).style.backgroundColor= 'red' : //check the ship
				document.getElementById('' + x +','+ y).style.backgroundColor= 'white';
//is the ship killed
				for (var i = 0; i < armada.length; i++) {
					if(armada[i].indexOf(cell) != -1) {
						if(armada[i].every( function (cell) {
				return (cell.opened);
			} )) {
				 alert(armada[i].decks + " палубный сдох");
			break;
			}
					}
				}
			}
		}
	};
//prevents the escape of bounds
	var	validate= function(x, y) {
			return ((x < size) &&(x >= 0)) && ((y < size) &&(y >= 0));
	};
//check the square around the point
	var isBorderFree= function (x, y, field) {
		var result = false;
		var border = [
			[-1, -1, -1, 0, 0, 1, 1, 1], //x of the border square
			[-1, 0, 1, -1, 1, -1, 0, 1] //y of the border square; coordinates have the same indexes
		];
		var row = 0;
		var col = 0;

		if (validate(x, y)) {
			for (var i = 0; i < border[0].length; i++) {
				row = x + border[0][i]; //add border item(coeff) to the coordinates
				col = y + border[1][i];
				if (validate(row, col) && field[row][col].ship) {
					return result;
				}
			}
		result = true;
		}
		return result;
	}
//recursive method for each deck from first point to the end
	var isFree= function (field, x, y, direction, board) {
		if (board < 1) {
		return true;
		}
		return (isBorderFree(x, y, field) && (!field[x][y].ship)&&
			isFree(field, (direction ? x + 1 : x), (!direction ? y + 1 : y), direction, --board));
	}

//set and draw the ships
	var setShips= function (field, board) {

		var flag = false;
		var counter = 0; //prevent the endless loop
		var direction = rand(0, 2); //vertical: 1; horizontal: 0

		do {
			x = rand(0, size - board);
			y = rand(0, size - board); // set the first point
			if (isFree(field, x, y, direction, board)) { // check the entire ship
				flag = true;
			}
		} while (!flag && counter++ < 150);

		var kreisser = [];
		kreisser.decks = board;

		for (var i = 0; i < board; i++) {
			r = direction ? x + i : x;
			c =!direction ? y + i : y;
			//document.getElementById(''+ r +','+ c).style.backgroundColor= 'grey';
			field[r][c].ship = true;
			field[r][c].msg = "drowned:(";
			kreisser.push(field[r][c]);
		}
		armada.push(kreisser); //put the ship in aramada
		console.log(armada);
	};

//set the number of ships and decks in each of them, random placement of the ships
	this.putShips= function (field) {
		for (var i = 4; i >= 1; i--) {
			for (var j = 1; j <= 5 - i; j++) {
				setShips(field, i);
			}
		}
	}
// an array with all of ships
var armada = [];

//check the rest of the ships
	this.hasShip= function() {
		var str = "You drowned them all";

		for (var i = 0; i < this.field.length; i++) {
			if(this.field[i].some( function (cell) {
				return (cell.ship && (!cell.opened) );
			} )) {
				 str = "Ships still sail";
			break;
			}
		}
	return str;
	};
}

var sb = new SeaBattle(10);
sb.putShips(sb.field);



//---------------------------------the selfPlayGame--------------------------
// var timer = 25;
// function selfPlay() {
// 	--timer;
// 	sb.shoot(rand(0, 9), rand(0, 9));
// 	if (timer === 0) {
// 		console.log('Game Over');
// 		console.log(sb.hasShip());
// 		clearInterval(timerId);
// 	}
// }
// var timerId = setInterval(selfPlay, 1000);
