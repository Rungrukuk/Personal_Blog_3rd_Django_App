document.addEventListener("DOMContentLoaded", function () {
    const friendRequestButtons = document.querySelectorAll(".friend-request-button");
    const messageBox = document.getElementById("message-box");
    const messageContent = document.getElementById("message-content");

    friendRequestButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const username = button.getAttribute("data-username");
            const csrftoken = $("[name=csrfmiddlewaretoken]").val();
            const headers = {
                "X-CSRFToken": csrftoken,
            };

            $.ajax({
                type: 'POST',
                url: 'accept_friend_request',
                headers: headers,
                data: { username: username },
                dataType: 'json',
                success: function (data) {
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
                        <a href="#">
                            <div class="friend">
                                <div class="texts">
                                    ${data.FriendInfo.username}
                                </div>
                                <img src="${data.FriendInfo.picture_path}" alt="${data.FriendInfo.username} profile">
                            </div>
                        </a>
                        `;
                    
                        friendsContainer.insertAdjacentHTML("afterbegin", newFriend);
                    }
                },
                error: function () {
                    button.textContent = "Error";
                    button.style.backgroundColor = "red";
                }
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
