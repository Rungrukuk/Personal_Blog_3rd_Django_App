document.addEventListener("DOMContentLoaded", function () {
    const createVomitButton = document.getElementById("create-vomit-button");

    createVomitButton.addEventListener("click", function () {
        const csrftoken = $("[name=csrfmiddlewaretoken]").val();
        const title = $("#vomit-textarea").val();
        const formData = new FormData($("#create-vomit-form")[0]);
        formData.append("title", title);
        const headers = {
            "X-CSRFToken": csrftoken,
        };

        $.ajax({
            type: "POST",
            url: 'create_vomit',
            headers: headers,
            data: formData,
            processData: false,
            contentType: false,
            success: function (blog) {
                $("#create-vomit-form")[0].reset();
            
                const vomitContainer = document.querySelector(".vomits");
                const newVomit = `
                <div class="vomit">
                    <p>${blog.title}</p>
                    <div class="vomit-image">
                        <img src="${blog.blog_image_url}" alt="vomit Image 2">
                    </div>


                    <div class="button-container">
                        <button id="commentButton" class="comment-button">
                            <div class="comment-circle">
                                <div class="comment-image"></div>
                            </div>
                            <span class="comment-count">0</span>
                        </button>

                        <button id="likeButton" class="like-button">
                            <div class="like-circle">
                                <div class="like-image"></div>
                            </div>
                            <span class="likes-count">0</span>
                        </button>
                    </div>


                    <div id="comment-box" class="comment-box">
                        <div class="text-area-container">
                            <textarea rows="1" placeholder="Write your comment here..."></textarea>
                            <button class="comment-submit">Submit</button>
                        </div>
                    </div>
                </div>
                `;
            
                // Insert the new vomit at the beginning of the vomit container
                vomitContainer.insertAdjacentHTML("afterbegin", newVomit);
            },
            error: function (error) {
                console.error(error);
            },
        });
    });
});