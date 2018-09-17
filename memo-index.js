const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const game = require('./game');

app.use(express.static(__dirname + '/memo'));
app.use(express.static(__dirname + '/assets'));


// checks if room 
function isRoomCreated(rooms, name) {
  let exist = false;
  rooms.forEach(room => {
    if (room.roomName == name) { exist = true; }
  });
  return exist;
}

var users = [];
var roomList = [];
var createdRooms = [];

io.on('connection', (socket) => {
  console.log("Witam");

  users.push(socket.id);
  console.log(users.length);
  // socket.emit('news', "from server");

  socket.on('create-room', (roomName) => {
    if ( roomList.filter( (room) => (room.roomName === roomName) ).length < 1) {
      let currRoom = {
        roomName,
        players:    1,
        gameBoard:  game.generateBoard(8, 5),
        gameState:  []
      };
      roomList.push(currRoom);

      socket.join(roomName);
      io.in(roomName).emit('game-board', currRoom);

      console.log("Create:\t" + roomName);
    }
    else {
      socket.emit('err', "room name already exists");
      console.log(roomName + " already exists");
    }
    console.log(roomList);      
  });

  socket.on('join-room', (roomName) => {
    if (isRoomCreated(roomList, roomName)) {
      socket.room = roomName;
            
      socket.join(roomName);
      let currentRoom = {};
      for (let room in roomList) {
        if (roomList.roomName === roomName) {
          currentRoom = room;
          break;
        }
      }

      io.in(roomName).emit('game-board', currentRoom);

      console.log("Join:\t" + roomName);
    }
    else {
      socket.emit('err', "no such room name exists");
      console.log(roomName + " no such room name");
    }
  });

  socket.on('delete-room', (roomName) => {
    if (isRoomCreated(roomList, roomName)) {
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

  socket.on('reverse-tile', (mousePosition, room) => {
    io.in(room).emit('reverse-tile', )
  });



});


http.listen(3001, () => {
    console.log("listening on 3001");
});


