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

  //game(1);
    
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
    var room = new Option(rooms[i].roomName, i);
    sSelect.options.add(room);
  }
  console.log(rooms);
});


/***** GAME *****/
var rows = 5;
var canvas = document.querySelector('#memo-board');
var context = canvas.getContext('2d');
var canvaSize = 800;
var sectionSize = canvaSize / rows;


function game(playerID) {
  
  const lineColor = "#ddd";
  const ima = new Image();
  ima.onload = () => {
    context.drawImage(ima,0,0);
  }


  
  
  console.log('game');
  // canvas.width = canvaSize;
  // canvas.height = canvaSize;

  context.fillStyle = "#FF0000";
  //drawLines(10, lineColor);

  
  // ima.addEventListener('load', () => {
  //   context.drawImage(ima,0,0,250,250);

  // });

  
  ima.src = './0.png';
  
    
}

game();

// function drawLines (lineWidth, strokeStyle) 
// {
//   var lineStart = 4;
//   var lineLenght = canvaSize - 5;
//   context.lineWidth = lineWidth;
//   context.lineCap = 'round';
//   context.strokeStyle = strokeStyle;
//   context.beginPath();


//   // Horizontal lines 
//   for (var y = 1;y <= 2;y++) 
//   {  
//     context.moveTo(lineStart, y * sectionSize);
//     context.lineTo(lineLenght, y * sectionSize);
//   }

//   // Vertical lines 
//   for (var x = 1;x <= 2;x++) 
//   {
//     context.moveTo(x * sectionSize, lineStart);
//     context.lineTo(x * sectionSize, lineLenght);
//   }

//   var img = new Image();
//   //
//     console.log('image loaded');
//     context.drawImage(img, 0, 0);
//   //}
//   img.src = '0.png';

//   context.stroke();
// }