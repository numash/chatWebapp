var express = require('express');
var http = require('http');
var router = express.Router();
var app = express();
var server = app.listen(8080);
var io = require('socket.io').listen(server);

app.get('/', function(req, res){
    res.render('index', { title: 'SS' });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });
});

server.listen(app.get('port'), function(){
    console.log('listening on *: ' + app.get('port'));
});

module.exports = app;
