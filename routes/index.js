var express = require('express');
var http = require('http');
var app = express();
var server = app.listen(8080);
var io = require('socket.io').listen(server);

var dbManager = require("../lib/db/dbManager");

app.get('/', function(req, res){
    res.redirect('/chat');
});

app.get('/chat', function(req, res){

    // dbManager.removeAllMessages(function(err){
    //     console.log(err);
    //     throw err;
    // });

    dbManager.getLastMessages(function(err){
    //dbManager.getAllMessages(function(err){
        console.log(err);
        throw err;
    },
    function(data) {
        //console.log(JSON.stringify(data));
        res.render('index', { title: 'SS', messages: data});
    });
});

io.on('connection', function(socket){

    socket.on('chat message', function(author, msg){
        dbManager.insertIntoDB(author, msg, function(err){
            console.log(err);
            throw err;
        }, function(){
            io.emit('message inserted into DB', author, msg);
        });
    });

    socket.on('message inserted into DB', function(author, msg){
        var messages;
        dbManager.getLastMessages(function(err){
        //dbManager.getAllMessages(function(err){
            console.log(err);
            throw err;
        },
        function (data) {
            messages = data;
        });
    });
});

server.listen("8080", function(){
    console.log('listening on *: ' + "8080");
});

module.exports = app;