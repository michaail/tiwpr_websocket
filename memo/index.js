// import Room from "game"
console.log("Uruchomiony home.js");

var socket = io();

socket.on('err', (errMsg) => {
  console.log(errMsg);
});

// socket.on('news', (data) => {
//     console.log(data);
// });

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

// Create room button event listener
const bCreate = document.getElementById('create');
bCreate.addEventListener('click', function(e) {
  var createValue = document.getElementById('create-value').value;
    
  socket.emit('create-room', createValue);
      
  console.log('create button clicked ' + createValue);
  checkRoomList();
});

// Join room button event listener
const bJoin = document.getElementById('join');
bJoin.addEventListener('click', function(e) {
  //var selectedVal = document.getElementById('join-value');
  var t = sSelect.options[ sSelect.selectedIndex ].text;
    
  socket.emit('join-room', t);
    
  // game(2);

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


/*
 *  ***** GAME COMMUNICATION *****
 */




var gameBoard;
var room;
socket.on('game-board', (roomData) => {
  room = roomData.roomName;
  showGameBoard();
  gameBoard = roomData.gameBoard;
  console.log(gameBoard);
  game();
})

socket.on('reverse-tile', (mousePosition) => {
  reverseTile(mousePosition);
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

function game (playerID) {
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

function reverseTile (mouse) 
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

        const source = './animals_c/' + gameBoard[x][y] + '.png';

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
  
  socket.emit('reverse-tile', {canvasMousePosition, room});
  //reverseTile(canvasMousePosition, gameBoard);
});

