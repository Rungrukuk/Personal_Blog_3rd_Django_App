document.addEventListener("DOMContentLoaded", function () {
    const friendRequestForms = document.querySelectorAll(".friend-request-form");

    friendRequestForms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = form.getAttribute("data-username");
            const csrftoken = $("[name=csrfmiddlewaretoken]").val();
            const headers = {
                "X-CSRFToken": csrftoken,
            };

            $.ajax({
                type: 'POST',
                url: 'send_friend_request/' + username + '/',
                headers: headers,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.message) {
                        console.log(data.message);
                    } else if (data.error) {
                        console.log(data.error);
                    }
                },
                error: function () {
                    console.log('An error occurred while sending the request.');
                }
            });
        });
    });
});
