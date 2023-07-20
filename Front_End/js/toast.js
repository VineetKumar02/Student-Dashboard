// Toast Notification
const toast = document.querySelectorAll(".toast");
const closeIcon = document.querySelectorAll(".close");
const progress = document.querySelectorAll(".progress");
const messageText = document.querySelectorAll(".text-2");

let timer;

function showSuccessToast(message) {
    hideAllToasts();
    toast[0].classList.add("active");
    progress[0].classList.add("active");
    messageText[0].innerText = message;

    timer = setTimeout(() => {
        closeToast(0);
    }, 4000); // 4 seconds
}

function showErrorToast(message) {
    hideAllToasts();
    toast[1].classList.add("active");
    progress[1].classList.add("active");
    messageText[1].innerText = message;

    timer = setTimeout(() => {
        closeToast(1);
    }, 4000); // 4 seconds
}

function closeToast(index) {
    toast[index].classList.remove("active");
    progress[index].classList.remove("active");
    clearTimeout(timer);
}

function hideAllToasts() {
    toast.forEach((toastItem, index) => {
        toastItem.classList.remove("active");
        progress[index].classList.remove("active");
    });
}

closeIcon[0].addEventListener("click", () => {
    closeToast(0)
});

closeIcon[1].addEventListener("click", () => {
    closeToast(1);
});
