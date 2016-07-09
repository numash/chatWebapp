/**
 * Created by numash on 08.07.2016.
 */
"use strict";

var userName = "Lalka";


function sendMessage(event) {
    var message = event.currentTarget.form[0].value;
    //alert(message);
    var socket = new WebSocket("ws://localhost:8081");

    socket.onopen = function() {
        alert("Соединение установлено.");
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            alert('Соединение закрыто чисто');
        } else {
            alert('Обрыв соединения'); // например, "убит" процесс сервера
        }
        alert('Код: ' + event.code + ' причина: ' + event.reason);
    };

    socket.onmessage = function(event) {
        alert("Получены данные " + event.data);
    };

    socket.onerror = function(error) {
        alert("Ошибка " + error.message);
    };

    socket.send(message);
    return false;
}

