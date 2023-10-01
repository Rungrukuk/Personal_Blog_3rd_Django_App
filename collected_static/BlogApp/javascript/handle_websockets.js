document.addEventListener("DOMContentLoaded", function () {

    const socket = new WebSocket('ws://localhost:8000/ws/notifications/');

    socket.onopen = function (event) {
        console.log('WebSocket is connected.');

        socket.send(JSON.stringify({ message: 'Hello from client!' }));
    };

    socket.onmessage = function (event) {
        console.log('WebSocket message received:', event.data);
    };

    socket.onclose = function (event) {
        console.log('WebSocket is closed.');
    };

    socket.onerror = function (error) {
        console.error('WebSocket Error:', error);
    };
});