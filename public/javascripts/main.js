/**
 * Created by numash on 08.07.2016.
 */

"use strict";

$().ready( function(){
    var mainField = document.getElementById('mainField');
    mainField.scrollTop = mainField.scrollHeight;
} );

$("#messageForm").submit(function( event ) {

    event.preventDefault();
    var message = event.currentTarget[0].value;
    var user = $('#messageForm :input')[1].value;
    $("#message").val("");
    
    socket.emit('chat message',user, message);
    return false;
});

socket.on("message received", function(message){

    //console.log("Message received: " + message.message);

    $("#messagesField").append($('<li class="list-group-item">').text(message.author + ': ' + message.message));

    var mainField = document.getElementById('mainField');
    mainField.scrollTop = mainField.scrollHeight;
});

