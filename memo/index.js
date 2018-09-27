// import Room from "game"
//todo game ended handler
//todo wait for other player to start
//var Buffer = require('buffer/').Buffer
console.log("Uruchomiony home.js");

var socket = io();
var player;
var gameStarted = false;
var myTurn = false;

socket.on('err', (errMsg) => {
  alert("pokój o tej nazwie już istnieje");
  console.log(errMsg);
});

// update list of rooms
function checkRoomList() {
  socket.emit('get-rooms', ""); 
  
}
checkRoomList();

const controls      = document.getElementById('room-controls');
const gameContainer = document.getElementById('game-board');

const playerValue   = document.getElementById('player-value');
const createValue   = document.getElementById('create-value')
const createButton  = document.getElementById('create');
const selectBox     = document.getElementById('join-value');
const joinButton    = document.getElementById('join');
const updateButton  = document.getElementById('update');
const deleteButton  = document.getElementById('delete');

const turnInfo      = document.getElementById('move-info');
const gameInfo      = document.getElementById('game-info');
const userInfo      = document.getElementById('user-info');

var userName;
gameContainer.style.display = "none";

function showGameBoard()
{
  controls.style.display = "none"; // wyłączenie kontroli
  gameContainer.style.display = "block";
}



createButton.addEventListener('click', function(e) {
  let roomName = createValue.value;
  userName = playerValue.value;
  userInfo.textContent = userName;
  //player = 1;
  let obj = {roomName, userName};
  //let bTmp = Buffer.from(JSON.stringify(obj));
  //console.log(bTmp);

  //socket.emit('create-room', bTmp);
  socket.emit('create-room', obj);
  turnInfo.textContent = 'twój ruch!';
  console.log('create button clicked ' + roomName + " " + userName);
  checkRoomList();
});

// Join room button event listener

joinButton.addEventListener('click', function(e) {
  let roomName = selectBox.options[ selectBox.selectedIndex ].text;
  userName = playerValue.value;
  userInfo.textContent = userName;
  //player = 2;
  socket.emit('join-room', {roomName, userName});
    
  console.log('join button clicked ' + roomName + " " + userName);
  turnInfo.textContent = 'czekaj na swój ruch...';
  checkRoomList();
});

// Delete room button event listener
deleteButton.addEventListener('click', function(e) {
  var t = selectBox.options[ selectBox.selectedIndex ].text;
    
  socket.emit('delete-room', t);
    
  console.log('delete button clicked ' + t);
  checkRoomList();
});

// Update room list button event listener
updateButton.addEventListener('click', function(e) {
  checkRoomList();
});



/*
 *  ***** CONTROLS COMMUNICATION *****
 */

// Get room-list from server
socket.on('get-rooms', (rooms) => {
  for (var i = selectBox.options.length -1; i >= 0; i--)
  {
    selectBox.remove(i);
  }

  for (i = 0; i < rooms.length; i++)
  {
    var roomValue = new Option(rooms[i].roomName, i);
    selectBox.options.add(roomValue);
  }
});


// ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### #####
// ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### #####
// ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### ##### #####

/*
 *  ***** GAME COMMUNICATION *****
 */



var room;
var uncoveredTile = -1;
var uncoveredTileCoordinates = {column: -1, row: -1};
var areBothUncovered = false;
var gameState;
var playersPts;
//var roomName;

socket.on('room-created', roomData => {
  room = roomData;
  showGameBoard();

  player = roomData.playersCount;
  console.log(room.gameState.gameBoard);
  myTurn = true;
  console.log(player);
  let gameInfoText;
  let users = Object.keys(room.gameState.players)
  if (users.length < 2) {
    gameInfoText = "Czekaj na drugiego gracza";
  } else {
    gameInfoText = "Wynik: " + users[0] + " - " + room.gameState.players[users[0]] + " | " +
                    users[1] + " - " + room.gameState.players[users[1]];
  
  }
  gameInfo.textContent = gameInfoText;
  game();
});

socket.on('room-joined', roomData => {
  room = roomData;
  showGameBoard();

  player = roomData.playersCount;
  console.log(room.gameState.gameBoard);
  console.log(player);
  let users = Object.keys(room.gameState.players)
  let gameInfoText;
  if (users.length < 2) {
    gameInfoText = "Czekaj na drugiego gracza";
  } else {
    gameInfoText = "Wynik: " + users[0] + " - " + room.gameState.players[users[0]] + " | " +
                    users[1] + " - " + room.gameState.players[users[1]];
  
  }
  gameStarted = true;
  gameInfo.textContent = gameInfoText;
  game();
});


socket.on('reverse-tile', coordinates => {
  reverseTile(coordinates.column, coordinates.row);
});

socket.on('get-turn', roomData => {
  room = roomData

  console.log('turn passed');
  if (player == roomData.gameState.whoseTurn) {
    turnInfo.textContent = 'twój ruch!';
    myTurn = true;
    console.log('my turn');
  }
  let users = Object.keys(room.gameState.players)
  let gameInfoText;
  if (users.length < 2) {
    gameInfoText = "Czekaj na drugiego gracza";
  } else {
    gameInfoText = "Wynik: " + users[0] + " - " + room.gameState.players[users[0]] + " | " +
                    users[1] + " - " + room.gameState.players[users[1]];
  
  }
  gameInfo.textContent = gameInfoText;
});

socket.on('get-game-state', gameStateData => {
  room.gameState = gameStateData;
  let users = Object.keys(room.gameState.players)
  let gameInfoText;
  if (users.length < 2) {
    gameInfoText = "Czekaj na drugiego gracza";
  } else {
    gameInfoText = "Wynik: " + users[0] + " - " + room.gameState.players[users[0]] + " | " +
                    users[1] + " - " + room.gameState.players[users[1]];
  
  }

  if (!gameStarted) {
    gameStarted = true;
  }
  gameInfo.textContent = gameInfoText;
});

socket.on('get-new-game', roomData => {
  room = roomData;
})


/*
 *
 */

var canvas = document.querySelector('#memo-board');
var context = canvas.getContext('2d');

var sectionSize = 150;
var rows = 4;
var columns = 5;
var canvaHeight = rows * sectionSize;
var canvaWidth = columns * sectionSize;


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

function emitGameState () {
  socket.emit('game-state', room);
}

function hasGameEnded() {
  let result = true;
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      if (room.gameState.gameBoard[x][y] !== -1) {
        result = false;
      }
    }
  }
  return result;
}

function gameEndedHandler() {
  
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
        if (room.gameState.gameBoard[x][y] === -1) {
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
    context.drawImage(image.tile, column * sectionSize, row * sectionSize, 
                      sectionSize-4, sectionSize-4);
  });
}

function ifTwoMatch (column, row) {
  room.gameState.gameBoard[column][row] = -1;
  room.gameState.gameBoard[uncoveredTileCoordinates.column][uncoveredTileCoordinates.row] = -1;
  console.log(room.gameState.gameBoard);
  console.log('well done!');
  setTimeout(() => {
    clearTile(column, row);
    clearTile(uncoveredTileCoordinates.column, uncoveredTileCoordinates.row);
    uncoveredTile = -1;
    if (myTurn) {
      room.gameState.players[userName]++;
      console.log(room.gameState.players);
      emitGameState();
    }
    uncoveredTileCoordinates = {column: -1, row: -1};
    areBothUncovered = false;
  }, 2000);
  // todo game score
}

function ifTwoDontMatch (column, row) {
  setTimeout(() => {
    drawTile(uncoveredTileCoordinates.column, uncoveredTileCoordinates.row, blankSource);
    drawTile(column, row, blankSource);
    uncoveredTile = -1;
    uncoveredTileCoordinates = {column: -1, row: -1};
    areBothUncovered = false;
    
    if (myTurn) {
      if (player == 1) {
        room.gameState.whoseTurn = 2;
      } else {
        room.gameState.whoseTurn = 1;
      }

      myTurn = false;
      socket.emit('pass-turn', room);
      turnInfo.textContent = 'czekaj na swój ruch...';
      
    }
  }, 2000);

  console.log('try again');
}


var blankSource = './blank/1.png'

function reverseTile (column, row) 
{
  console.log(`column: ${column}, row: ${row}`);
  clearTile(column, row);
  const source = './animals_c/' + room.gameState.gameBoard[column][row] + '.png';
  
  
  drawTile(column, row, source);
  if (uncoveredTile == -1 ) {
    uncoveredTile = room.gameState.gameBoard[column][row];
    uncoveredTileCoordinates = {column, row};

  } else {
    areBothUncovered = true;
    
    if (uncoveredTile == room.gameState.gameBoard[column][row]) {
      ifTwoMatch(column, row)
      
    } else { 
      ifTwoDontMatch(column, row);

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


// draws blank rectangle instead of tiles
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
  if (gameStarted) {
  
    if (myTurn)
    {
      const canvasMousePosition = getCanvasMousePosition(event);
      const coordinates = getCoordinates(canvasMousePosition);
  
      if (areBothUncovered) {
        return;
      }
      if (room.gameState.gameBoard[coordinates.column][coordinates.row] !== -1 && 
          !(coordinates.column === uncoveredTileCoordinates.column &&
            coordinates.row === uncoveredTileCoordinates.row)) {

        socket.emit('reverse-tile', { coordinates, roomName: room.roomName });
      } else {
        return;
      }
    } else {
      console.log('wait for your turn');
    }
  }
});



