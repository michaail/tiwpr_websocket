var canvas = document.querySelector('#memo-board');
var context = canvas.getContext('2d');
var sectionSize = 150;
var rows = 5;
var columns = 8;
var canvaHeight = rows * sectionSize;
var canvaWidth = columns * sectionSize;

var tiles = rows * columns;




function game(playerID) {
  canvas.width = canvaWidth;
  canvas.height = canvaHeight;  

  const ima = new Image();

  generateBoard();

  drawReverse(0);

  console.log('game');
    
}
game();



function loadImages(sources, callback) {
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

function drawReverse(fileNo) {
  
  const source = {
    blank:  '../assets/blank/' + fileNo + '.png'
  };

  loadImages(source, (image) => {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        context.drawImage(image.blank, x * sectionSize, y * sectionSize, sectionSize, sectionSize);
      }
    }
  });
}


function generateBoard() {
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
}

function getTilesSources() {
  let sources = [];
  while (sources.length < tiles / 2) {
    var randomNumber = Math.floor(Math.random()*100);
    if(sources.indexOf(randomNumber) > -1) continue;
    sources.push(randomNumber);
  }
  return sources;
}

function shuffleTiles(tiles) {
  for(let i= tiles.length - 1; i > 0; i--) {
    const swap = Math.floor(Math.random()*i);
    const tmp = tiles[i];
    tiles[i] = tiles[swap];
    tiles[swap] = tmp;
  }
}


/*
 *  CONTROLS
 */

function revertTile(mouse) 
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
        
      }
    }
  }
}

function clearTile(column, row) {
  context.beginPath();
  context.rect( column*sectionSize, row*sectionSize, 
                sectionSize, sectionSize);
  context.fillStyle = "white"
  context.fill();
}

function showTile(params) {
  
}


 // gets coordinates of mouse click
function getCanvasMousePosition (event) 
{
  var rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

canvas.addEventListener('mouseup', function (event) {
  

  const canvasMousePosition = getCanvasMousePosition(event);
  // revert corresponding tile
  
  revertTile(canvasMousePosition);
  
});