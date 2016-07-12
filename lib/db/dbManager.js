var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:12345/test';

var dbManager = new Object();

dbManager.insertIntoDB = function(author, msg, rejected, succeed){
    MongoClient.connect(url, function(err, db) {
        //console.log("Connected correctly to server.");
        if(err){
            rejected(err);
        }
        else{
            insertMessage(db, author, msg, function() {
                db.close();
            });
            succeed();
        }
    });
};

var insertMessage = function(db, author, msg) {
    db.collection('messages').insertOne( {
        "date" : new Date("2015-03-25T12:00:00"),
        "author": author,
        "text": msg
    }, function(err) {
        assert.equal(err, null);
        //console.log("A message '" + msg + "' from " + author + " has been inserted into the messages history.");
        //callback();
    });
};

dbManager.getAllMessages = function(rejected, succeed) {
    findAllMessages(function(err){
        rejected(err);
    },
        function(messages) {
        succeed(messages);
    });
};

var findAllMessages = function (errorCallback, successCallback) {

    MongoClient.connect(url, function(err, db) {

        if (err) {
            errorCallback(err);
        }

        var cursor = db.collection('messages').find();

        var data = [];

        cursor.each(function (err, doc) {
            if (doc != null) {
                data.push(doc);
            }
        });

        successCallback(data);
        db.close();
    });
};

dbManager.getLastMessages = function(rejected, succeed) {
    findLastMessages(function(err){
            rejected(err);
        },
        function(messages) {
            succeed(messages);
        });
};

var findLastMessages = function (errorCallback, successCallback) {

    MongoClient.connect(url, function(err, db) {

        if (err) {
            errorCallback(err);
        }

        var cursor = db.collection('messages').find().sort({_id:1}).limit(20);

        var data = [];

        cursor.each(function (err, doc) {
            if (doc != null) {
                data.push(doc);
            }
        });

        successCallback(data);
        db.close();
    });
};

dbManager.removeAllMessages = function(rejected) {
    MongoClient.connect(url, function (err, db) {
        if (err){
            rejected(err);
        }

        removeMessages(db, function () {
            db.close();
        });
    });
};

var removeMessages = function(db, callback) {
    db.collection('messages').deleteMany({}, function(err, results) {
        console.log(results);
        callback();
    });
};

module.exports = dbManager;