document.addEventListener("DOMContentLoaded", function () {
    // Hide all friend-actions when clicking outside any friend and show the friend-actions of the clicked friend
    document.addEventListener("click", function (e) {
        const allFriendActions = document.querySelectorAll(".friend-actions");
        allFriendActions.forEach(fa => fa.style.display = 'none');
        
        let friend = e.target.closest('.friend');
        if (friend) {
            const friendActions = friend.nextElementSibling;
            friendActions.style.display = 'block';

            const rect = friend.getBoundingClientRect();
            friendActions.style.left = (rect.right + 10) + 'px'; // corrected
            friendActions.style.top = rect.top + 'px'; // corrected
        }
    });
});
