document.addEventListener("DOMContentLoaded", function () {

    const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    document.body.addEventListener("click", function(event) {
        if (event.target.closest(".like-button")) {
            const button = event.target.closest(".like-button");
            const blogId = button.closest('.vomit').dataset.blogId;
            console.log(blogId);
            let liked = button.classList.contains("liked");
            liked = !liked;
            button.classList.toggle("liked", liked);
            const likesCount = button.querySelector(".likes-count");
            if(liked){
                likesCount.textContent = parseInt(likesCount.textContent) + 1;
                fetch('/add_blog_like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrftoken,
                    },
                    body: `blog_id=${blogId}`,
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        showMessage(data.success,"green");
                    } else if (data.error) {
                        showMessage(data.error,"red");
                    }
                })
                .catch(error => {
                    showMessage(`There has been a problem with connection`, "red");
                    console.log(error);
                });
                    
            }
            else{
                likesCount.textContent = parseInt(likesCount.textContent) - 1;
                
                fetch('/remove_blog_like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrftoken,
                    },
                    body: `blog_id=${blogId}`,
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        showMessage(data.success,"green");
                    } else if (data.error) {
                        showMessage(data.error,"red");
                    }
                })
                .catch(error => {
                    showMessage(`There has been a problem with connection`, "red");
                    console.log(error);
                });

            }
        }
    });
    

    document.body.addEventListener("click", function(event) {
        if (event.target.closest(".comment-button")) {
            const button = event.target.closest(".comment-button");
            const commentBox = button.closest(".vomit").querySelector(".comment-box");
            let isCommentBoxVisible = commentBox.style.display === "block";
            isCommentBoxVisible = !isCommentBoxVisible;
            commentBox.style.maxHeight = isCommentBoxVisible ? "200px" : "0";
            commentBox.style.display = isCommentBoxVisible ? "block" : "none";
        }
    });

    document.body.addEventListener("click",function(event){
        if(event.target.closest(".comment-submit")){
            button = event.target.closest(".comment-submit")
            const commentContent = button.parentElement.querySelector(".comment-submit-content");
            const blogId = button.closest('.vomit').dataset.blogId;

            fetch('/add_comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrftoken,
                },
                body: `blog_id=${blogId}&comment_content=${commentContent.value ? `${encodeURIComponent(commentContent.value)}` : ''}`,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showMessage(data.success,"green");
                    commentsContainer = button.closest(".vomit").querySelector(".comments");
                    commentsContainer.style.display = "block";
                    commentContent.value="";
                    const newComment = `
                        <div class="comment">
                            <img src="${data.comment_user_picture_path}" alt="User Name">
                            <div class="comment-content">
                                <div class="comment-span">
                                    <span class="comment-username">${data.comment_username}</span>
                                    <!--<span class="reply-to"> replies to <span class="replied-username">Another User</span></span>-->
                                </div>
                                
                                <div class="comment-text">${data.comment_content}</div>
                                <button class="like-button-comment">
                                    <div class="like-circle">
                                        <div class="like-image"></div>
                                    </div>
                                    <span class="likes-count">0</span>
                                </button>
                            </div>
                        </div>
                    `
                    commentsContainer.insertAdjacentHTML('beforeend', newComment);
                } else if (data.error) {
                    showMessage(data.error,"red");
                }
            })
            .catch(error => {
                showMessage(`There has been a problem with connection`, "red");
                console.log(error);
            });
        }

    });


});