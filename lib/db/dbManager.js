var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:12345/test';
//var url = 'mongodb://localhost:27017/test';

var dbManager = new Object();

dbManager.insertIntoDB = function(author, msg, rejected, succeed){
    MongoClient.connect(url, function(err, db) {
        //console.log("Connected correctly to server.");
        if(err){
            rejected(err);
        }
        else{
            insertMessage(db, author, msg, function(err){
                console.error(err);
                db.close();
            },
            function(data) {
                db.close();
                succeed();
            });
        }
    });
};

var insertMessage = function(db, author, msg, rejected, succeed) {

    db.collection('messages').insertOne( {
        "date" : new Date().getTime(),
        "author": author,
        "message": msg
    }, function(err, result) {
        if (err){
            rejected(err);
        } else{
            succeed(result);
        }
    });
};

dbManager.getLastMessage = function(rejected, succeed) {
    findLastMessage(function(err){
            rejected(err);
        },
        function(message) {
            succeed(message);
        });
};

var findLastMessage = function (errorCallback, successCallback) {

    MongoClient.connect(url, function(err, db) {

        if (err) {
            errorCallback(err);
        }

        db.collection('messages').find().sort({date:-1}).limit(1).next(function(err, data){
            successCallback(data);
        });
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

        var cursor = db.collection('messages').find().sort({date:1});

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