/**
 * Created by numash on 08.07.2016.
 */

"use strict";

$("#messageForm").submit(function( event ) {
    event.preventDefault();
    var message = event.currentTarget[0].value;
    //console.log("Message to send: " + message);

    $("#message").val("");

    socket.emit('chat message', message);
    return false;
});

// socket.on('chat message', function(msg){
//     console.log("Message received: " + msg);
//     $("#messagesField").append("<li>").text(msg);
// });

socket.on("message inserted into DB", function(msg){
    console.log("Message received: " + msg);
    $("#messagesField").append("<li>").text(msg);
});

