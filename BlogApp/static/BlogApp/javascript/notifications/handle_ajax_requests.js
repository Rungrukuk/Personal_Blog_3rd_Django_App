document.addEventListener("DOMContentLoaded", function () {
    const friendRequestButtons = document.querySelectorAll(".friend-request-button");
    const messageBox = document.getElementById("message-box");
    const messageContent = document.getElementById("message-content");

    friendRequestButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const username = button.getAttribute("data-username");
            const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;

            fetch('accept_friend_request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrftoken,
                },
                body: `username=${username}`,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                
                if (data.message) {
                    button.textContent = "Accepted";
                    button.style.backgroundColor = "green";
                    showMessage(data.message);
                }  
                if (data.error) {
                    button.textContent = "Error";
                    button.style.backgroundColor = "red";
                    messageBox.style.backgroundColor = "red";
                    showMessage(data.error);
                }
                if (data.FriendInfo) {
                    const friendsContainer = document.querySelector(".friends");
                    const newFriend = `
                    <div class="friend-container">
                        <div class="friend">
                            <div class="texts">
                                ${data.FriendInfo.username}
                            </div>
                            <img src="${data.FriendInfo.picture_path}" alt="${data.FriendInfo.username} profile">
                        </div>
                        <div class="friend-actions">
                            <a href="user_profile/${data.FriendInfo.username}" class="friend-buttons" >Profile</a>
                            <button class="friend-buttons" >Chat</button>
                        </div>
                    </div>
                    `;
                
                    friendsContainer.insertAdjacentHTML("afterbegin", newFriend);
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                button.textContent = "Error";
                button.style.backgroundColor = "red";
            });
        });
    });

    function showMessage(message) {
        messageContent.innerText = message;
        messageBox.classList.remove("hidden-message");
        messageBox.classList.add("show-message");
        setTimeout(function () {
            messageBox.style.opacity = 0;
        }, 3000);
        setTimeout(function () {
            messageBox.classList.remove("show-message");
            messageBox.classList.add("hidden-message");
        }, 3300);
    }

});
