document.addEventListener("DOMContentLoaded", function () {
    const friendRequestButtons = document.querySelectorAll(".friend-request-button");

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
                url: 'search',
                headers: headers,
                data: { username: username }, // Send the username as data
                dataType: 'json',
                success: function (data) {
                    if (data.message) {
                        // Update button text and color for success
                        button.textContent = "Sent";
                        button.style.backgroundColor = "green";
                        console.log(data.message);
                    } else if (data.error) {
                        // Update button text and color for error
                        button.textContent = "Error";
                        button.style.backgroundColor = "red";
                        console.log(data.error);
                    }
                },
                error: function () {
                    // Update button text and color for error
                    button.textContent = "Error";
                    button.style.backgroundColor = "red";
                    console.log('An error occurred while sending the request.');
                }
            });
        });
    });
});
