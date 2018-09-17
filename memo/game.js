var canvas = document.querySelector('#memo-board');
var context = canvas.getContext('2d');

var sectionSize = 150;
var rows = 5;
var columns = 8;
var canvaHeight = rows * sectionSize;
var canvaWidth = columns * sectionSize;

//context.translate(0.5, 0.5);
//context.imageSmoothingEnabled = true;

var tiles = rows * columns;
var board = generateBoard();

/*
 *  ***** GAME *****
 */

function game (playerID) {
  canvas.width = canvaWidth;
  canvas.height = canvaHeight;  

  const ima = new Image();

  drawBlankTiles(2);

  console.log('game');
    
}
game();



/*
 *  ***** DRAW *****
 */

function drawBlankTiles (fileNo) {
  
  const source = {
    blank:  '../assets/blank/' + fileNo + '.png'
  };

  loadImages (source, (image) => {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        context.drawImage(image.blank, x * sectionSize, y * sectionSize, sectionSize-4, sectionSize-4);
      }
    }
  });
}

function drawTile (column, row, img) {
  loadImages({tile: img}, (image) => {
    context.drawImage(image.tile, column * sectionSize, row * sectionSize, sectionSize-4, sectionSize-4);
  });
}

function reverseTile (mouse, board) 
{
  var xCordinate;
  var yCordinate;

  for (var x = 0; x < columns; x++) 
  {
    for (var y = 0; y < rows; y++) 
    {
      xCordinate = x * sectionSize;
      yCordinate = y * sectionSize;

      if (mouse.x >= xCordinate && mouse.x <= xCordinate + sectionSize &&
          mouse.y >= yCordinate && mouse.y <= yCordinate + sectionSize) 
      {
        console.log(`row: ${y}, column: ${x}`);
        clearTile(x, y);

        const source = '../assets/animals_c/' + board[x][y] + '.png';

        drawTile(x, y, source);
      }
    }
  }
}

function clearTile (column, row) {
  context.beginPath();
  context.rect( column*sectionSize, row*sectionSize, 
                sectionSize, sectionSize);
  context.fillStyle = "white"
  context.fill();
}


/*
 *  ***** LOAD IMAGES *****
 */

function loadImages (sources, callback) {
  const images = {};
  let loadedImages = 0;
  let numImages = 0;

  for (const src in sources) {
    numImages++;
  }
  for (const src in sources) {
    images[src] = new Image();
    images[src].onload = () => {
      if (++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}


/*
 *  ***** Prepare game *****
 */

function generateBoard () { // generates board array and shuffles it
  const board = []
  const sources = getTilesSources().map((item) => {
    return [item, item];
  }).reduce((a, b) => {
    return a.concat(b);
  });

  shuffleTiles(sources);

  for (let x = 0; x < columns; x++) {
    board.push([]);
    for (let y = 0; y < rows; y++) {
      board[x].push(sources.pop());
    }
  }

  console.log(board);
  return board;
}

function getTilesSources () { // gets file numbers 
  let sources = [];
  while (sources.length < tiles / 2) {
    var randomNumber = Math.floor(Math.random()*100);
    if (sources.indexOf(randomNumber) > -1) continue;
    sources.push(randomNumber);
  }
  return sources;
}

function shuffleTiles (tiles) { // shuffles tiles
  for (let i= tiles.length - 1; i > 0; i--) {
    const swap = Math.floor(Math.random()*i);
    const tmp = tiles[i];
    tiles[i] = tiles[swap];
    tiles[swap] = tmp;
  }
}


/*
 *  ***** CONTROLS ******
 */

// gets coordinates of mouse click
function getCanvasMousePosition (event) {
  var rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

// on mouse button release event
canvas.addEventListener ('mouseup', function (event) {
  const canvasMousePosition = getCanvasMousePosition(event);
  
  reverseTile(canvasMousePosition, board);
});


/*
 *  ***** SCALE ******
 */

// const scaleDown = function(image, targetScale) {
// 	let currentScale = 1;

// 	while ((currentScale * stepScale) > targetScale) {
// 		currentScale *= stepScale;
// 		image = stepDown(image);
// 	}

// 	return { image , remainingScale: targetScale / currentScale};
// };

// var stepDown = function(image) {
// 	const temp = {};
// 	temp.canvas = document.createElement('canvas');
// 	temp.ctx = temp.canvas.getContext('2d');

// 	// Size canvas and image to stepScale
// 	temp.canvas.width = (image.width * stepScale) + 1;
// 	temp.canvas.height = (image.height * stepScale) + 1;
// 	temp.ctx.scale(stepScale, stepScale);
// 	temp.ctx.drawImage(image, 0, 0);

// 	// 0.5 size'd canvas!
// 	return temp.canvas;
// };