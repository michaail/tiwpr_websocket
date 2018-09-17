const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const game = require('./game');

//const socket = sio.listen(server);

// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/public/home.html');
// });

app.use(express.static(__dirname + '/public'));


// app.post("/", (req, res) => {
//     res.sendStatus(200);
//     console.log("received from front");
// })

var users = [];
var roomList = [];
var createdRooms = [];

io.on('connection', (socket) => {
  console.log("Witam");

  users.push(socket.id);
  console.log(users.length);
  // socket.emit('news', "from server");

  socket.on('create-room', (roomName) => {
    if (roomList.filter( (room) => (room.roomName === roomName) ).length < 1) {
      let currRoom = {
        roomName,
        players: 1,
        gameBoard: game.generateBoard(8, 5),
        gameState: []
      };
      roomList.push(currRoom);
      socket.join(roomName);
      
      console.log("Created and joined:\t" + roomName);
    } 
    else {
      socket.emit('err', "room name already exists");
      console.log(roomName + " already exists");
    }
    console.log(roomList);    
  });

  socket.on('join-room', (roomName) => {
    if (roomList.filter( (room) => (room.roomName === roomName) ).length > 0) {
      socket.room = roomName;
      const currRoom = roomList.filter((room) => room.roomName === roomName);
      
      socket.join(roomName);
      
      socket.to(roomName).emit('game-board', '');

      console.log("Joined:\t" + roomName);
    }
    else {
      socket.emit('err', "no such room name exists");
      console.log(roomName + " no such room name");
    }
  });

  socket.on('delete-room', (roomName) => {
    if ( roomList.filter( (room) => (room.roomName === roomName) ).length > 0) {
      var index = roomList.indexOf(roomName);
      
      if (index > -1) {
        roomList.splice(index, 1);
        console.log("Delete:\t" + roomName);
      }
      console.log(roomList);
    }
    else {
      socket.emit('err', "no such room name exists");
      console.log(roomName + " no such room name");
    }
  });

  socket.on('get-rooms', (msg) => {
    socket.emit('get-rooms', roomList);
  });

  socket.on('disconnect', () => {
    var index = users.indexOf(socket.id);
    if (index > -1) {
      users.splice(index, 1);
      console.log("Disconnect:\t" + socket.id);
    }
  });
});



http.listen(3000, () => {
    console.log("listening on 3000");
});

