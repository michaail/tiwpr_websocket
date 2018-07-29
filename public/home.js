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
const gameBoard = document.getElementById('game-board');

gameBoard.style.display = "none";

function showGameBoard()
{
    controls.style.display = "none"; // wyłączenie kontroli
    gameBoard.style.display = "block";
}

// Create room button event listener
const bCreate = document.getElementById('create');
bCreate.addEventListener('click', function(e) {
    var createValue = document.getElementById('create-value').value;
    
    socket.emit('create-room', createValue);

    game(1);
    
    console.log('create button clicked ' + createValue);
    checkRoomList();
});

// Join room button event listener
const bJoin = document.getElementById('join');
bJoin.addEventListener('click', function(e) {
    //var selectedVal = document.getElementById('join-value');
    var t = sSelect.options[ sSelect.selectedIndex ].text;
    
    socket.emit('join-room', t);
    
    game(2);

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

// Get room-list from server
socket.on('get-rooms', (rooms) => {
    for (var i = sSelect.options.length -1; i >= 0; i--)
    {
        sSelect.remove(i);
    }

    for (i = 0; i < rooms.length; i++)
    {
        var room = new Option(rooms[i], i);
        sSelect.options.add(room);
    }
    console.log(rooms);
});

var inGame = true; //change to false


// GAME per se

var lineColor = "#ddd";

var canvas = document.getElementById('tic-tac-toe-board');
var context = canvas.getContext('2d');
var canvasSize = 500;
var sectionSize = canvasSize / 3;

function game(p)
{
    var player = p;
    var myMove;
    
    showGameBoard();

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    context.translate(0.5, 0.5);

    var board = getInitialBoard(0); // empty board 0 = empty; 1 = X; 2 = O;
    console.log(board);

    drawLines(10, lineColor);

    canvas.addEventListener('mouseup', function (event) {
        var moveDone = false;
    
        var canvasMousePosition = getCanvasMousePosition(event, canvas);
        moveDone = addPlayingPiece(canvasMousePosition, player, board);
        drawLines(10, lineColor);

        if (moveDone)
        {
            if (player === 1) 
            {
                // pass game state to the server and indicate that is p2 move
                player = 2;
            } 
            else 
            {
                // pass game state to the server and indicate that is p1 move
                player = 1;
            }
        }
    });
}




// creates game board
function getInitialBoard (defaultValue) 
{
    var board = [];

    for (var x = 0;x < 3; x++) 
    {
        board.push([]);

        for (var y = 0; y < 3; y++) 
        {
        board[x].push(defaultValue);
        }
    }

    return board;
}


// gets coordinates of mouse click
function getCanvasMousePosition (event, canva) 
{
    var rect = canva.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}


function addPlayingPiece (mouse, player, board) 
{
    var xCordinate;
    var yCordinate;

    for (var x = 0; x < 3; x++) 
    {
        for (var y = 0; y < 3; y++) 
        {
            xCordinate = x * sectionSize;
            yCordinate = y * sectionSize;

            if (mouse.x >= xCordinate && mouse.x <= xCordinate + sectionSize &&
                mouse.y >= yCordinate && mouse.y <= yCordinate + sectionSize) 
            {
                //clearPlayingArea(xCordinate, yCordinate);

                if (board[x][y] != 0)
                {
                    return false;
                }

                if (player === 1) 
                {
                    board[x][y] = 1;
                    console.log(board);
                    drawX(xCordinate, yCordinate);
                } 
                else 
                {
                    board[x][y] = 2;
                    console.log(board);
                    drawO(xCordinate, yCordinate);
                }
                return true;
            }
        }
    }
}

// draw board lines
function drawLines (lineWidth, strokeStyle) 
{
    var lineStart = 4;
    var lineLenght = canvasSize - 5;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.strokeStyle = strokeStyle;
    context.beginPath();


    // Horizontal lines 
    for (var y = 1;y <= 2;y++) 
    {  
        context.moveTo(lineStart, y * sectionSize);
        context.lineTo(lineLenght, y * sectionSize);
    }

    // Vertical lines 
    for (var x = 1;x <= 2;x++) 
    {
        context.moveTo(x * sectionSize, lineStart);
        context.lineTo(x * sectionSize, lineLenght);
    }

    context.stroke();
}

// Draws an O
function drawO (xCordinate, yCordinate) 
{
  var halfSectionSize = (0.5 * sectionSize);
  var centerX = xCordinate + halfSectionSize;
  var centerY = yCordinate + halfSectionSize;
  var radius = (sectionSize - 100) / 2;
  var startAngle = 0 * Math.PI; 
  var endAngle = 2 * Math.PI;

  context.lineWidth = 10;
  context.strokeStyle = "#01bBC2";
  context.beginPath();
  context.arc(centerX, centerY, radius, startAngle, endAngle);
  context.stroke();
}

// Draws a X
function drawX (xCordinate, yCordinate) 
{
  context.strokeStyle = "#f1be32";

  context.beginPath();
  
  var offset = 50;
  context.moveTo(xCordinate + offset, yCordinate + offset);
  context.lineTo(xCordinate + sectionSize - offset, yCordinate + sectionSize - offset);

  context.moveTo(xCordinate + offset, yCordinate + sectionSize - offset);
  context.lineTo(xCordinate + sectionSize - offset, yCordinate + offset);

  context.stroke();
}
