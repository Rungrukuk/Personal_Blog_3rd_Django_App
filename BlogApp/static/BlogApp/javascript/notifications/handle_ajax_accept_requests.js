document.addEventListener("DOMContentLoaded", function () {
    const friendRequestButtons = document.querySelectorAll(".friend-request-button");

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
                
                if (data.success) {
                    button.textContent = "Accepted";
                    button.style.backgroundColor = "green";
                    showMessage(data.success,"green");
                    refresh_button_style(button, "Accept", "#1DA1F2");
                }  
                if (data.error) {
                    button.textContent = "Error";
                    button.style.backgroundColor = "red";
                    showMessage(data.error,"red");
                    refresh_button_style(button, "Accept", "#1DA1F2");
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
                showMessage(`There has been a problem with connection`, "red");
                console.log(error);
                button.textContent = "Error";
                button.style.backgroundColor = "red";
                refresh_button_style(button, "Accept", "#1DA1F2");
            });
        });

    });

});
