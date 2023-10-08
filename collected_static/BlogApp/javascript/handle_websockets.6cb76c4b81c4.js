document.addEventListener("DOMContentLoaded", function () {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/infos/');

    socket.onopen = function (event) {
        console.log('WebSocket is connected.');
    };

    // document.querySelectorAll('.like-button').forEach(button => {
    //     button.addEventListener('click', function () {
    //         const post_id = this.dataset.postId;
    //         const user_id = document.getElementById("current_username").dataset.userId;

    //         const message = {
    //             action_type: 'like',
    //             post_id: post_id,
    //             user_id: user_id
    //         };

    //         socket.send(JSON.stringify(message));
    //     });
    // });
});