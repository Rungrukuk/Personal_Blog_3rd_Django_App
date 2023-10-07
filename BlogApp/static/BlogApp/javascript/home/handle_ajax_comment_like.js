document.addEventListener("DOMContentLoaded", function () {

    const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    
    document.body.addEventListener("click", function(event) {
        if (event.target.closest(".like-button")) {
            const button = event.target.closest(".like-button");
            let liked = button.classList.contains("liked");
            liked = !liked;
            button.classList.toggle("liked", liked);
            const likesCount = button.querySelector(".likes-count");
            const likeImage = button.querySelector(".like-image");
            const blogId = button.closest('.button-container').dataset.blogId;
            if(liked){
                likesCount.textContent = parseInt(likesCount.textContent) + 1;
                likeImage.style.backgroundImage = 'url("{% static "BlogApp/images/like.png" %}")';
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
                likeImage.style.backgroundImage = 'url("{% static "BlogApp/images/unlike.png" %}")';
                
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
            const commentBox = button.parentElement.parentElement.querySelector(".comment-box");
            let isCommentBoxVisible = commentBox.style.display === "block";
    
            isCommentBoxVisible = !isCommentBoxVisible;
            commentBox.style.maxHeight = isCommentBoxVisible ? "200px" : "0";
            commentBox.style.display = isCommentBoxVisible ? "block" : "none";
        }
    });



});