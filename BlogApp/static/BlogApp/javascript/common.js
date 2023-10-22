
let hideMessageTimeout;

function showMessage(message, color) {
    clearTimeout(hideMessageTimeout);
    const messageBox = document.getElementById("alert-box");
    const messageContent = document.getElementById("alert-content");
    messageBox.style.backgroundColor = color;
    messageContent.innerText = message;
    messageBox.classList.add("show-alert");
    messageBox.classList.remove("hidden-alert");

    hideMessageTimeout = setTimeout(function () {
        messageBox.style.opacity = 0;
        setTimeout(function () {
            messageContent.innerText = "";
            messageBox.style.opacity = 1;
            messageBox.classList.add("hidden-alert");
            messageBox.classList.remove("show-alert");
        }, 300);
    }, 3000);


}


function refresh_button_style(button, textContent, backgroundColor) {
    setTimeout(() => {
        button.textContent = textContent;
        button.style.backgroundColor = backgroundColor;
    }, 3000);
}