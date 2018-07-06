const express = require('express');
const http = require('http');
const sio = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = sio.listen(server);
server.listen(8080);

// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/public/home.html');
// });

app.use(express.static(__dirname + '/public'));
console.log("Server on 8080");


// obsługa rysowań
var line_history = [];

var room_list = [];


io.on('connection', function (socket) {
    for (var i in line_history) {
        socket.emit('draw_line', {line: line_history[i]});
    }

    socket.on('draw_line', function (data) {
        line_history.push(data.line);
        io.emit('draw_line', {line: data.line});
    });
});

