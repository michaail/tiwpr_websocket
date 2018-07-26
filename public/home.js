console.log("Uruchomiony home.js");

var socket = io();

socket.on('err', (errMsg) => {
    console.log(errMsg);
});

// socket.on('news', (data) => {
//     console.log(data);
// });

const bCreate = document.getElementById('create');
bCreate.addEventListener('click', function(e) {
    var createValue = document.getElementById('create-value').value;
    
    socket.emit('create-room', createValue);

    console.log('create button clicked ' + createValue);
});

const bJoin = document.getElementById('join');
bJoin.addEventListener('click', function(e) {
    var selectedVal = document.getElementById('join-value');
    var t = selectedVal.options[ selectedVal.selectedIndex ].text;
    
    socket.emit('join-room', t);
    
    console.log('join button clicked ' + t);
});

const bDelete = document.getElementById('delete');
bDelete.addEventListener('click', function(e) {
    var selectedVal = document.getElementById('join-value');
    var t = selectedVal.options[ selectedVal.selectedIndex ].text;
    
    socket.emit('delete-room', t);
    
    console.log('delete button clicked ' + t);
});

const sSelect = document.getElementById('join-value');
sSelect.addEventListener('click', function(e) {

    socket.emit('get-rooms', "");

    socket.on('get-rooms', (rooms) => {
        for (i = sSelect.options.length -1; i >= 0; i--)
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
});
