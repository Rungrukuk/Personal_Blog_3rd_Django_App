document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function(event) {
        if (event.target.closest(".like-button")) {
            const button = event.target.closest(".like-button");
            let liked = button.classList.contains("liked");
            liked = !liked;
            button.classList.toggle("liked", liked);
            const likesCount = button.querySelector(".likes-count");
            likesCount.textContent = liked
                ? parseInt(likesCount.textContent) + 1
                : parseInt(likesCount.textContent) - 1;
    
            const likeImage = button.querySelector(".like-image");
            likeImage.style.backgroundImage = liked
                ? 'url("{% static "BlogApp/images/like.png" %}")'
                : 'url("{% static "BlogApp/images/unlike.png" %}")';
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
