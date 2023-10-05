document.addEventListener("DOMContentLoaded", function () {
    const socket = new WebSocket('ws://your_domain/ws/infos/');

    socket.onopen = function (event) {
        console.log('WebSocket is connected.');
    };

    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', function () {
            const post_id = this.dataset.postId;
            const username = document.getElementById("current_username").innerHTML;

            const message = {
                post_id: post_id,
                username: username
            };

            socket.send(JSON.stringify(message));
        });
    });
});