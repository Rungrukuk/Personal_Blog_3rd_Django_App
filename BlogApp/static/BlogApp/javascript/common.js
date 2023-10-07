
let hideMessageTimeout;

function showMessage(message, color) {
    console.log("showMessage called with:", message, color);
    clearTimeout(hideMessageTimeout);
    const messageBox = document.getElementById("message-box");
    const messageContent = document.getElementById("message-content");
    messageBox.style.backgroundColor = color;
    messageContent.innerText = message;
    messageBox.classList.add("show-message");
    messageBox.classList.remove("hidden-message");

    hideMessageTimeout = setTimeout(function () {
        messageBox.style.opacity = 0;
        setTimeout(function () {
            messageContent.innerText = "";
            messageBox.style.opacity = 1;
            messageBox.classList.add("hidden-message");
            messageBox.classList.remove("show-message");
        }, 300);
    }, 3000);


}


function refresh_button_style(button, textContent, backgroundColor) {
    setTimeout(() => {
        button.textContent = textContent;
        button.style.backgroundColor = backgroundColor;
    }, 3000);
}