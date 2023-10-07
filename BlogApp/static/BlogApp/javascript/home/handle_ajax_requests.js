document.addEventListener("DOMContentLoaded", function () {
    const createVomitButton = document.getElementById("create-vomit-button");

    createVomitButton.addEventListener('click', function () {
        const createVomitForm = document.getElementById('create-vomit-form');
        const titleTextarea = document.getElementById('vomit-textarea');
        const vomitContainer = document.querySelector('.vomits');
    
        const formData = new FormData(createVomitForm);
        formData.append('title', titleTextarea.value);
    
        const csrfToken = createVomitForm.querySelector('[name=csrfmiddlewaretoken]').value;
    
        fetch('create_vomit', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.statusText);
            }
            return response.json();
        })
        .then(blog => {
            createVomitForm.reset();
    
            const newVomit = `
                <div class="vomit">
                    <p>${blog.title}</p>
                    <div class="vomit-image">
                        <img src="${blog.blog_image_url}" alt="vomit Image 2">
                    </div>
                    <div class="comments" style="display: none"></div>
                    <div class="button-container" data-blog-id="${blog.id}">
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
            vomitContainer.insertAdjacentHTML('afterbegin', newVomit);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
    });
    


    document.body.addEventListener("click", function(event) {
        if (event.target.closest(".like-button")) {
            const button = event.target.closest(".like-button");
            const blogId = button.closest('.button-container').dataset.blogId;
            console.log('Post ID:', blogId);
            
        }
    });

});