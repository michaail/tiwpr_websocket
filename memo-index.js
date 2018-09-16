const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//const socket = sio.listen(server);

// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/public/home.html');
// });

app.use(express.static(__dirname + '/memo'));


// app.post("/", (req, res) => {
//     res.sendStatus(200);
//     console.log("received from front");
// })

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
        if ( roomList.filter( (room) => (room.roomName === roomName) ).length < 1)
        {
            let currRoom = {
                roomName,
                players: 1,
                gameState: []
            };
            roomList.push(currRoom);
            console.log("Create:\t" + roomName);
        }
        else
        {
            socket.emit('err', "room name already exists");
            console.log(roomName + " already exists");
        }
        console.log(roomList);
        
    });

    socket.on('join-room', (roomName) => {
        if (isRoomCreated(roomList, roomName))
        {
            socket.room = roomName;
            
            socket.join(roomName);

            console.log("Join:\t" + roomName);
        }
        else
        {
            socket.emit('err', "no such room name exists");
            console.log(roomName + " no such room name");
        }
    });

    socket.on('delete-room', (roomName) => {
        if (isRoomCreated(roomList, roomName))
        {
            var index = roomList.indexOf(roomName);
            if (index > -1) 
            {
                roomList.splice(index, 1);
                console.log("Delete:\t" + roomName);
            }
            console.log(roomList);
        }
        else
        {
            socket.emit('err', "no such room name exists");
            console.log(roomName + " no such room name");
        }
    });

    socket.on('get-rooms', (msg) => {
        socket.emit('get-rooms', roomList);
    });

    socket.on('disconnect', () => {
        var index = users.indexOf(socket.id);
        if (index > -1) 
        {
            users.splice(index, 1);
            console.log("Disconnect:\t" + socket.id);
        }
    });
});



http.listen(3001, () => {
    console.log("listening on 3001");
});

// to do innego serwera
// obsługa rysowań
// var line_history = [];

// var room_list = [];


// socket.on('connection', function (socket) {
//     for (var i in line_history) {
//         socket.emit('draw_line', {line: line_history[i]});
//     }

//     socket.on('draw_line', function (data) {
//         line_history.push(data.line);
//         socket.emit('draw_line', {line: data.line});
//     });
// });

