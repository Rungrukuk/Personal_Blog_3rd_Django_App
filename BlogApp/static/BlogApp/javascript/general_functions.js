document.addEventListener("DOMContentLoaded", function () {
    // Hide all friend-actions when clicking outside any friend and show the friend-actions of the clicked friend
    document.addEventListener("click", function (e) {
        
        let clickedFriend = e.target.closest('.friend');
        
        const allFriendActions = document.querySelectorAll(".friend-actions");
        
        allFriendActions.forEach(fa => {
            // If the clicked friend's actions are already visible, hide them
            if(clickedFriend && fa === clickedFriend.nextElementSibling && fa.style.display === 'flex') {
                fa.style.display = 'none';
                clickedFriend = null; // Set to null so it doesn’t show the friend-actions in the next steps
            } else {
                fa.style.display = 'none';
            }
        });
        
        if (clickedFriend) {
            const friendActions = clickedFriend.nextElementSibling;
            friendActions.style.display = 'flex';
            
            const rect = clickedFriend.getBoundingClientRect();
            friendActions.style.left = (rect.right + 10) + 'px';
            friendActions.style.top = rect.top + 'px';
        }
    });
});
