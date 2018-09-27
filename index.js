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

function deleteIfRoomEmpty(roomName) {
  for (let i = 0; i < roomList.length; i++) {
    if (roomList[i].roomName === roomName) {
      roomList[i].playersCount--;
      if (roomList[i].playersCount == 0) {
        roomList.splice(i, 1);
        console.log('room: ' + roomName + ' deleted');
      } 
    }
  }
}


io.on('connection', (socket) => {
  console.log('connected: ' + socket.id);
  users.push(socket.id);
  // socket.emit('news', "from server");

  socket.on('create-room', (newRoom) => {

 
    //let newRoom = JSON.parse(roomBuf.toString('utf8'));
    if ( roomList.filter( (room) => (room.roomName === newRoom.roomName) ).length < 1) {
      let currRoom = {
        roomName:     newRoom.roomName,
        playersCount: 1,
        maxPlayers:   2,
        gameState:    {
          players:      { },
          gameBoard:    game.generateBoard(5, 4),
          whoseTurn:    1
        }
      };
      currRoom.gameState.players[newRoom.userName] = 0;
      roomList.push(currRoom);
      socket.room = newRoom.roomName;
      socket.join(newRoom.roomName);
      socket.emit('room-created', currRoom);

      console.log("Create:\t" + newRoom.roomName);
    }
    else {
      socket.emit('err', "room name already exists");
      console.log(newRoom.roomName + " already exists");
    }
    console.log(roomList);      
  });

  socket.on('join-room', (room) => {
    if (isRoomCreated(roomList, room.roomName)) {

      for (let i = 0; i < roomList.length; i++) {
        if (roomList[i].roomName === room.roomName) {
          
          if (roomList[i].playersCount < roomList[i].maxPlayers) {
            roomList[i].playersCount++;
            
            roomList[i].gameState.players[room.userName] = 0;
            socket.room = room.roomName;
            socket.join(room.roomName);
            socket.emit('room-joined', roomList[i]);
            io.to(room.roomName).emit('get-game-state', roomList[i].gameState);
            
            console.log("Join:\t" + room.roomName);
          } else {
            console.log('max players count reached');
          }
        }
      }
      
    }
    else {
      socket.emit('err', "no such room name exists");
      console.log(room.roomName + " no such room name");
    }
  });

  socket.on('delete-room', (roomName) => {
    if (isRoomCreated(roomList, roomName)) {
      for(let i=0; i<roomList.length; i++)
      {
        if (roomList[i].roomName === roomName) {
          roomList.splice(i, 1);
          console.log("Delete:\t" + roomName);
        }
      }
      
      console.log(roomList);
    }
    else {
      socket.emit('err', "no such room name exists");
      console.log(roomName + " no such room name");
    }
  });

  socket.on('get-rooms', (msg) => {
    socket.emit('get-rooms', roomList)
    socket.broadcast.emit('get-rooms', roomList);
  });

  socket.on('disconnect', () => {
    var index = users.indexOf(socket.id);
    if (index > -1) {
      users.splice(index, 1);
      
      deleteIfRoomEmpty(socket.room);
    }
  });

  socket.on('new-game', (recvObj) => {
    for (let i = 0; i < roomList.length; i++) {
      if (roomList[i].roomName === recvObj.roomName) {
        roomList[i].gameState.gameBoard = game.generateBoard(8, 5);
        roomList[i].gameState.whoseTurn = 1;
        
        io.to(recvObj.roomName).emit('get-new-game', roomList[i]);
      }
    }
  });

  socket.on('reverse-tile', (recvObj) => {
    console.log(`room: ${recvObj.roomName} | mouse: ${recvObj.coordinates.column} ${recvObj.coordinates.row}`);
    io.to(recvObj.roomName).emit('reverse-tile', recvObj.coordinates);
  });

  socket.on('pass-turn', (recvObj) => {
    for (let i = 0; i < roomList.length; i++) {
      if (roomList[i].roomName === recvObj.roomName) {
        roomList[i].gameState = recvObj.gameState;
      }
    }
    console.log(recvObj.gameState);
    io.to(recvObj.roomName).emit('get-turn', recvObj);
  });

  socket.on('game-state', (recvObj) => {
    for (let i = 0; i < roomList.length; i++) {
      if (roomList[i].roomName === recvObj.roomName) {
        roomList[i].gameState = recvObj.gameState;
      }
    }
    
    io.to(recvObj.roomName).emit('get-game-state', recvObj.gameState);
  })



});


http.listen(3001, () => {
    console.log("listening on 3001");
});


