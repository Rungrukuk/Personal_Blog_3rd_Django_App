document.addEventListener("DOMContentLoaded", function () {
    const friendRequestButtons = document.querySelectorAll(".friend-request-button");
    const messageBox = document.getElementById("message-box");
    const messageContent = document.getElementById("message-content");

    friendRequestButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const username = button.getAttribute("data-username");
            const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;

            fetch('send_friend_request', {
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
                    button.textContent = "Sent";
                    button.style.backgroundColor = "green";
                    showMessage(data.message);
                } else if (data.error) {
                    button.textContent = "Error";
                    button.style.backgroundColor = "red";
                    messageBox.style.backgroundColor = "red";
                    showMessage(data.error);
                }
            })
            .catch((error) => {
                console.error('Fetch Error:', error);
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
