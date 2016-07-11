var express = require('express');
var http = require('http');
var app = express();
var server = app.listen(8080);
var io = require('socket.io').listen(server);

//--------------------------
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:12345/test';
//-----------------------------------------

app.get('/', function(req, res){
    res.render('index', { title: 'SS' });
});

io.on('connection', function(socket){

    socket.on('chat message', function(msg){
        //io.emit('chat message', msg);
        //console.log('message: ' + msg);

        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            //console.log("Connected correctly to server.");

            insertDocument(db, msg, function() {
                io.emit('message inserted into DB', msg);
                db.close();
            });
        });

        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            findMessages(db, function() {
                db.close();
            });
        });
    });
});

var insertDocument = function(db, msg, callback) {
    db.collection('messages').insertOne( {
        "date" : new Date("2015-03-25T12:00:00"),
        "author": "Masha",
        "text": msg
    }, function(err, result) {
        assert.equal(err, null);
        console.log("A message '" + msg + "' has been inserted into the messages history.");
        callback();
    });
};

var findMessages = function(db, callback) {
    var cursor = db.collection('messages').find( );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            //console.dir(doc);
            console.log(doc);
        } else {
            callback();
        }
    });
};

var removeMessages = function(db, callback) {
    db.collection('messages').deleteMany( {}, function(err, results) {
        console.log(results);
        callback();
    });
};

server.listen("8080", function(){
    console.log('listening on *: ' + "8080");
});

module.exports = app;