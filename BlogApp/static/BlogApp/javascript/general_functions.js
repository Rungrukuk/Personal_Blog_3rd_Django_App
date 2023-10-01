document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (e) {
        const allFriendActions = document.querySelectorAll(".friend-actions");
        allFriendActions.forEach(fa => fa.style.display = 'none');
        
        let friend = e.target.closest('.friend');
        if (friend) {
            const friendActions = friend.nextElementSibling;
            friendActions.style.display = 'block';

            const rect = friend.getBoundingClientRect();
            friendActions.style.left = (rect.right + 10) + 'px'; 
            friendActions.style.top = rect.top + 'px'; 
        }
    });
});
