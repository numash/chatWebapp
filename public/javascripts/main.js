/**
 * Created by numash on 08.07.2016.
 */

"use strict";

var author = "numash";

$().ready( function(){
    var mainField = document.getElementById('mainField');
    mainField.scrollTop = mainField.scrollHeight;
} );

$("#messageForm").submit(function( event ) {
    event.preventDefault();
    var message = event.currentTarget[0].value;
    //console.log("Message to send: " + message);

    $("#message").val("");

    socket.emit('chat message', author, message);
    return false;
});

socket.on("message inserted into DB", function(author, msg){
    console.log("Message received: " + msg);
    $("#messagesField").append($('<li class="list-group-item">').text(author + ': ' + msg));

    var mainField = document.getElementById('mainField');
    mainField.scrollTop = mainField.scrollHeight;
});

