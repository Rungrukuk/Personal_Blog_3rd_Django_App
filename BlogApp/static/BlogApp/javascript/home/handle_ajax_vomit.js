document.addEventListener("DOMContentLoaded", function () {
    const createVomitButton = document.getElementById("create-vomit-button");

    createVomitButton.addEventListener('click', function () {
        const createVomitForm = document.getElementById('create-vomit-form');
        const titleTextarea = document.getElementById('vomit-textarea');
        const vomitContainer = document.querySelector('.vomits');
        const formData = new FormData(createVomitForm);
        formData.append('title', titleTextarea.value);
    
        const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    
        fetch('/add_blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken,
            },
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            createVomitForm.reset();
            if(data.success){
                const newVomit = `
                    <div class="vomit">
                        <p>${data.blog_title}</p>
                        <div class="vomit-image">
                            <img src="${data.blog_image_url}" alt="vomit Image 2">
                        </div>
                        <div class="comments" style="display: none"></div>
                        <div class="button-container" data-blog-id="${data.blog_id}">
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
                createVomitButton.textContent = "Success";
                createVomitButton.style.backgroundColor = "green";
                showMessage(data.success,"green");
                refresh_button_style(createVomitButton,"Submit","#1DA1F2");
            }
            else{
                createVomitButton.textContent = "Error";
                createVomitButton.style.backgroundColor = "red";
                showMessage(data.error,"red");
                refresh_button_style(createVomitButton,"Submit","#1DA1F2");
            }

        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
    });
});

