// import Room from "game"
console.log("Uruchomiony home.js");

var socket = io();
var player;

socket.on('err', (errMsg) => {
  console.log(errMsg);
});

// update list of rooms
function checkRoomList() {
  socket.emit('get-rooms', ""); 

}
checkRoomList();

const controls = document.getElementById('room-controls');
const gameContainer = document.getElementById('game-board');

gameContainer.style.display = "none";

function showGameBoard()
{
  controls.style.display = "none"; // wyłączenie kontroli
  gameContainer.style.display = "block";
}

const turnInfo = document.getElementById('move-info');
//const player
//moveInfo.textContent = 'dupa';
// Create room button event listener
const bCreate = document.getElementById('create');
bCreate.addEventListener('click', function(e) {
  var createValue = document.getElementById('create-value').value;
  player = 1;
  socket.emit('create-room', createValue);
  
  console.log('create button clicked ' + createValue);
  checkRoomList();
});

// Join room button event listener
const bJoin = document.getElementById('join');
bJoin.addEventListener('click', function(e) {
  //var selectedVal = document.getElementById('join-value');
  var t = sSelect.options[ sSelect.selectedIndex ].text;
  player = 2;
  socket.emit('join-room', t);
    
  console.log('join button clicked ' + t);
    
  checkRoomList();
});

// Delete room button event listener
const bDelete = document.getElementById('delete');
bDelete.addEventListener('click', function(e) {
  //var selectedVal = document.getElementById('join-value');
  var t = sSelect.options[ sSelect.selectedIndex ].text;
    
  socket.emit('delete-room', t);
    
  console.log('delete button clicked ' + t);
  checkRoomList();
});

// Delete room button event listener
const bUpdate = document.getElementById('update');
bUpdate.addEventListener('click', function(e) {
    
  checkRoomList();
});

// Drop-down rooms list event listener
const sSelect = document.getElementById('join-value');
sSelect.addEventListener('click', function(e) {
    //checkRoomList();
     
});


/*
 *  ***** CONTROLS COMMUNICATION *****
 */

// Get room-list from server
socket.on('get-rooms', (rooms) => {
  for (var i = sSelect.options.length -1; i >= 0; i--)
  {
    sSelect.remove(i);
  }

  for (i = 0; i < rooms.length; i++)
  {
    var roomValue = new Option(rooms[i].roomName, i);
    sSelect.options.add(roomValue);
  }
  //console.log(rooms);
});


// ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### #####
// ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### #####
// ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### #####

/*
 *  ***** GAME COMMUNICATION *****
 */

var gameBoard;
var room;
var uncoveredTile = -1;
var uncoveredTileCoordinates = {column: -1, row: -1};
var areBothUncovered = false;
var gameState;
var playersPts;


socket.on('game-board', (roomData) => {
  room = roomData.roomName;
  showGameBoard();
  gameBoard = roomData.gameBoard;
  gameState = {gameBoard};
  console.log(gameBoard);
  game();
})

socket.on('reverse-tile', (coordinates) => {
  reverseTile(coordinates.column, coordinates.row);
});



/*
 *
 */

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
//var board = generateBoard();

/*
 *  ***** GAME *****
 */

function game () {
  canvas.width = canvaWidth;
  canvas.height = canvaHeight;  

  const ima = new Image();

  drawBlankTiles(1);

  console.log('game');
    
}


/*
 *  ***** DRAW *****
 */

function drawBlankTiles (fileNo) {
  
  const source = {
    blank:  './blank/' + fileNo + '.png'
  };

  loadImages (source, (image)  => {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        if (gameBoard[x][y] === -1) {
          clearTile(x, y);
        } else {
          context.drawImage(image.blank, x * sectionSize, y * sectionSize, sectionSize-4, sectionSize-4);
        }  
      }
    }
  });
}

function drawTile (column, row, img) {
  loadImages({tile: img}, (image) => {
    context.drawImage(image.tile, column * sectionSize, row * sectionSize, sectionSize-4, sectionSize-4);
  });
}

function reverseTile (column, row) 
{
  console.log(`column: ${column}, row: ${row}`);
  clearTile(column, row);
  const source = './animals_c/' + gameBoard[column][row] + '.png';
  const blankSource = './blank/1.png'
  
  drawTile(column, row, source);
  if (uncoveredTile == -1 ) {
    uncoveredTile = gameBoard[column][row];
    uncoveredTileCoordinates = {column, row};
  } else {  // when 2 are uncovered
    areBothUncovered = true;
    
    if (uncoveredTile == gameBoard[column][row]) {  // if 2 match
      gameBoard[column][row] = -1;
      gameBoard[uncoveredTileCoordinates.column][uncoveredTileCoordinates.row] = -1;
      console.log(gameBoard);
      console.log('well done!');
      setTimeout(() => {
        clearTile(column, row);
        clearTile(uncoveredTileCoordinates.column, uncoveredTileCoordinates.row);
        uncoveredTile = -1;
        uncoveredTileCoordinates = {column: -1, row: -1};
        areBothUncovered = false;
      }, 3000);
      // score point & transfer gamestate & new try
      
    } else { 
      setTimeout(() => {
        drawTile(uncoveredTileCoordinates.column, uncoveredTileCoordinates.row, blankSource);
        drawTile(column, row, blankSource);
        uncoveredTile = -1;
        uncoveredTileCoordinates = {column: -1, row: -1};
        areBothUncovered = false;
      }, 3000);
      // pass the turn and game state

      console.log('try again');

    }
  }
}

function getCoordinates (mouse) {
  let xCordinate;
  let yCordinate;
  for (let x = 0; x < columns; x++) 
  {
    for (let y = 0; y < rows; y++) 
    {
      xCordinate = x * sectionSize;
      yCordinate = y * sectionSize;
      if (mouse.x >= xCordinate && mouse.x <= xCordinate + sectionSize &&
          mouse.y >= yCordinate && mouse.y <= yCordinate + sectionSize) {
        return {
          column: x,
          row:    y
        }

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
    images[src].onerror = (msg, url, lineNom, culumnNo, error) => {
      console.log('cant load image: ' + msg);
    }
    images[src].src = sources[src];
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
  const coordinates = getCoordinates(canvasMousePosition);
  
  if (areBothUncovered) {
    return;
  }
  if (gameBoard[coordinates.column][coordinates.row] !== ' ' || 
      (coordinates.column === uncoveredTileCoordinates.column &&
        coordinates.row === uncoveredTileCoordinates.row)) {

    socket.emit('reverse-tile', { coordinates, room });
  } else {
    return;
  }

});



