//Friend Actions
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (e) {
        
        let clickedFriend = e.target.closest('.friend');
        
        const allFriendActions = document.querySelectorAll(".friend-actions");
        
        allFriendActions.forEach(fa => {
            if(clickedFriend && fa === clickedFriend.nextElementSibling && fa.style.display === 'flex') {
                fa.style.display = 'none';
                clickedFriend = null; 
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
