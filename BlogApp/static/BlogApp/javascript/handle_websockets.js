document.addEventListener("DOMContentLoaded", function() {
    const chatSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/chat/' + senderId + '/' + receiverId + '/'
    );

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const message = data['message'];
        const messageType = data['type']; // 'sent' or 'received'
        
        if (messageType === 'sent') {
            appendSentMessage(message);
        } else {
            appendReceivedMessage(message);
        }
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('.chat-input-area button').addEventListener('click', function() {
        const messageInputDom = document.querySelector('.chat-input-area input');
        const message = messageInputDom.value;
        chatSocket.send(JSON.stringify({
            'message': message,
            'type': 'sent'
        }));
        appendSentMessage(message);
        messageInputDom.value = '';
    });

    function appendSentMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sent');
        messageDiv.textContent = message;
        document.querySelector('.chat-messages .chat-container').appendChild(messageDiv);
    }

    function appendReceivedMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('received-message-container');
        
        const img = document.createElement('img');
        img.src = "/media/profile_images/default.png"; // Update this to the sender's profile picture
        img.alt = "Profile Picture";
        img.classList.add('profile-pic');
        messageContainer.appendChild(img);
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'received');
        messageDiv.textContent = message;
        messageContainer.appendChild(messageDiv);
        
        document.querySelector('.chat-messages .chat-container').appendChild(messageContainer);
    }
});
