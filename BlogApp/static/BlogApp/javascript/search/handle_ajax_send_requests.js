document.addEventListener("DOMContentLoaded", function () {
    const friendRequestButtons = document.querySelectorAll(".friend-request-button");
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
                if (data.success) {
                    button.textContent = "Sent";
                    button.style.backgroundColor = "green";
                    showMessage(data.success,"green");
                    refresh_button_style(button,"Add Friend","#1DA1F2")
                } else if (data.error) {
                    button.textContent = "Error";
                    button.style.backgroundColor = "red";
                    showMessage(data.error,"red");
                    refresh_button_style(button,"Add Friend","#1DA1F2")
                }
            })
            .catch(error => {
                showMessage(`There has been a problem with connection`, "red");
                console.log(error);
                button.textContent = "Error";
                button.style.backgroundColor = "red";
                refresh_button_style(button,"Add Friend","#1DA1F2")
            });
        });
    });

});


