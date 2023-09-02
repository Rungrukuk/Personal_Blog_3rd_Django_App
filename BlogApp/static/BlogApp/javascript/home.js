document.addEventListener("DOMContentLoaded", function() {
  const likeButtons = document.querySelectorAll(".like-button");

  likeButtons.forEach(button => {
      let liked = false;
      button.addEventListener("click", function() {
          liked = !liked;
          button.classList.toggle("liked", liked);
          const likesCount = button.querySelector(".likes-count");
          likesCount.textContent = liked ? parseInt(likesCount.textContent) + 1 : parseInt(likesCount.textContent) - 1;

          // Update the like image background based on the liked status
          const likeImage = button.querySelector(".like-image");
          likeImage.style.backgroundImage = liked ? 'url("{% static "BlogApp/images/like.png" %}")' : 'url("{% static "BlogApp/images/unlike.png" %}")';
      });
  });

  const commentButtons = document.querySelectorAll(".comment-button");

  commentButtons.forEach(button => {
      const commentBox = button.parentElement.parentElement.querySelector(".comment-box");
      let isCommentBoxVisible = false;
      
      button.addEventListener("click", function() {
          isCommentBoxVisible = !isCommentBoxVisible;
          commentBox.style.maxHeight = isCommentBoxVisible ? "200px" : "0";
          commentBox.style.display = isCommentBoxVisible ? "block" : "none";
      });
  });
});

$(document).ready(function() {
    // Handle Create Vomit form submission
    $("#create-vomit-button").click(function() {
        $.ajax({
            type: "POST",
            url: "{% url 'create_vomit' %}",
            data: $("#create-vomit-form").serialize(),
            success: function(response) {
                // Handle the response from the server (e.g., display a success message)
                console.log(response);
            }
        });
    });

    // // Handle Submit Comment form submission
    // $("#submit-comment-button").click(function() {
    //     $.ajax({
    //         type: "POST",
    //         url: "{% url 'submit_comment' %}",
    //         data: $("#submit-comment-form").serialize(),
    //         success: function(response) {
    //             // Handle the response from the server (e.g., display a success message)
    //             console.log(response);
    //         }
    //     });
    // });
});