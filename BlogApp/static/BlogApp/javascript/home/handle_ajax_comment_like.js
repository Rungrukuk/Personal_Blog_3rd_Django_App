document.addEventListener("DOMContentLoaded", function () {

    const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    document.body.addEventListener("click", function(event) {
        if (event.target.closest(".like-button")) {
            const button = event.target.closest(".like-button");
            const blogId = button.closest('.vomit').dataset.blogId;
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
        if (event.target.closest(".like-button-comment")) {
            const button = event.target.closest(".like-button-comment");
            const commentId = button.closest('.comment').dataset.commentId;
            let liked = button.classList.contains("liked");
            liked = !liked;
            button.classList.toggle("liked", liked);
            const likesCount = button.querySelector(".likes-count");
            if(liked){
                likesCount.textContent = parseInt(likesCount.textContent) + 1;
                fetch('/add_comment_like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrftoken,
                    },
                    body: `comment_id=${commentId}`,
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
                
                fetch('/remove_comment_like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrftoken,
                    },
                    body: `comment_id=${commentId}`,
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
        if (event.target.closest(".comment-button")) {
            const button = event.target.closest(".comment-button");
            const commentBox = button.closest(".vomit").querySelector(".comment-box");
            const textArea = commentBox.querySelector(".comment-submit-content");
            textArea.innerText="";
            let isCommentBoxVisible = commentBox.style.display === "block";
            isCommentBoxVisible = !isCommentBoxVisible;
            commentBox.style.maxHeight = isCommentBoxVisible ? "200px" : "0";
            commentBox.style.display = isCommentBoxVisible ? "block" : "none";
        }
        if (event.target.closest(".comment-submit")) {
            button = event.target.closest(".comment-submit")
            const commentContent = button.parentElement.querySelector(".comment-submit-content");
            const blogId = button.closest('.vomit').dataset.blogId;
        
            fetch('/add_comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrftoken,
                },
                body: `blog_id=${blogId}&comment_content=${commentContent.value ? `${encodeURIComponent(commentContent.value)}` : ''}&comment_id=${commentContent.dataset.replyId}`,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showMessage(data.success, "green");
                    commentsContainer = button.closest(".vomit").querySelector(".comments");
                    commentsContainer.style.display = "block";
                    commentContent.value = "";
                    
                    let replyToHTML = '';
                    if (data.comment.is_reply) {
                        replyToHTML = `<span class="reply-to"> replies to <span class="replied-username">${data.comment.parent_username}</span></span>`;
                    }
                    const newComment = `
                        <div class="comment" data-comment-id="${data.comment.id}" data-username="${data.comment.username}">
                            <img src="${data.comment.profile_picture_path}" alt="${data.comment.username}">
                            <div class="comment-content">
                                <div class="comment-span">
                                    <span class="comment-username">${data.comment.username}</span>
                                    ${replyToHTML}
                                </div>
                                
                                <div class="comment-text">${data.comment.content}</div>
                                <div class="comment-button-container"> 
                                    <button class="like-button-comment">
                                        <div class="like-circle">
                                            <div class="like-image"></div>
                                        </div>
                                        <span class="likes-count">0</span>
                                    </button>
                                    <button class="reply-button">
                                        <div class="reply-circle">
                                            <div class="reply-image"></div>
                                        </div>
                                        <span class="reply-count">0</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    commentsContainer.insertAdjacentHTML('afterbegin', newComment);
                    //! need to add commented
                } else if (data.error) {
                    showMessage(data.error, "red");
                }
            })
            .catch(error => {
                showMessage(`There has been a problem with connection`, "red");
                console.log(error);
            });
        }

        if (event.target.closest(".reply-button")) {
            const button = event.target.closest(".reply-button");
            const commentBox = button.closest(".vomit").querySelector(".comment-box");
            const textArea = commentBox.querySelector(".comment-submit-content");
            commentElement = button.closest(".comment");
            

            const originalReplyText = `@${commentElement.dataset.username} `;
            textArea.dataset.originalReplyText = originalReplyText;
            

            if (!textArea.value || textArea.value !== textArea.dataset.originalReplyText) {
                textArea.value = textArea.dataset.originalReplyText;
            }
            
            textArea.dataset.replyId = commentElement.dataset.commentId;
            commentBox.style.maxHeight = "200px";
            commentBox.style.display = "block";
        }
         


    });
    
});