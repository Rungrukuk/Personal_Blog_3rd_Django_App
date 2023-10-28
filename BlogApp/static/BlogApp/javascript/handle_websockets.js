document.addEventListener("DOMContentLoaded", function() {
    
    const senderUsername = document.getElementById("current_username").textContent;
    const receiverUsername = document.getElementById("receiver_infos").dataset.receiverUsername;
    const receiverPic = document.getElementById("receiver_infos").dataset.receiverPicture;
    const wsStart = (window.location.protocol === "https:") ? 'wss://' : 'ws://';
    const messageInputDom = document.querySelector('.chat-input-area input');
    const chatSocket = new WebSocket(
        wsStart + window.location.host +
        '/ws/chat/' + senderUsername + '/' + receiverUsername + '/'
    );
    

    chatSocket.onopen = function(e) {
        console.log('WebSocket connection opened:', e);
    };
    
    chatSocket.onerror = function(error) {
        console.error('WebSocket Error:', error);
    };
    
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const messageId = data['messageId'];
        const messageType = data['type'];
        
        if (messageType === 'sent' || messageType === 'confirmation') {
            const sentMessage = document.querySelector(`[data-message-id="${messageId}"]`);
            if (sentMessage) {
                sentMessage.classList.remove('pending');
                const statusSpan = sentMessage.querySelector('.message-status');
                if (statusSpan) {
                    statusSpan.textContent = 'Sent';
                }
            }
        } else if (messageType === 'received') {
            const message = data['message'];
            appendReceivedMessage(message, receiverPic);
        }
    };
    
    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('.chat-input-area button').addEventListener('click', function() {
        sendMessage();
    });

    messageInputDom.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInputDom.value;
        const messageId = Date.now();
        chatSocket.send(JSON.stringify({
            'message': message,
            'type': 'sent',
            'messageId': messageId
        }));
        appendSentMessage(message, messageId);
        messageInputDom.value = '';
    }
    
    function appendSentMessage(message, messageId) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sent', 'pending');
        messageDiv.textContent = message;
        messageDiv.dataset.messageId = messageId;
    
        const statusSpan = document.createElement('span');
        statusSpan.classList.add('message-status');
        statusSpan.textContent = 'Pending';
        messageDiv.appendChild(statusSpan);
    
        document.querySelector('.chat-messages .chat-container').appendChild(messageDiv);
    }
    
    

    function appendReceivedMessage(message, picSrc) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('received-message-container');
        
        const img = document.createElement('img');
        img.src = picSrc;
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
