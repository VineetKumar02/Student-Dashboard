// Toast Notification
const toast = document.querySelectorAll(".toast"),
    closeIcon = document.querySelectorAll(".close"),
    progress = document.querySelectorAll(".progress"),
    message_text = document.querySelectorAll(".text-2");

let timer1, timer2;

function showSuccessToast(message) {
    toast[0].classList.add("active");
    progress[0].classList.add("active");
    message_text[0].innerText = message;

    timer1 = setTimeout(() => {
        toast[0].classList.remove("active");
    }, 4000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
        progress[0].classList.remove("active");
        // window.location.reload();
    }, 4300);
}

function showErrorToast(message) {
    toast[1].classList.add("active");
    progress[1].classList.add("active");
    message_text[1].innerText = message;

    timer1 = setTimeout(() => {
        toast[1].classList.remove("active");
    }, 4000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
        progress[1].classList.remove("active");
    }, 4300);
}


closeIcon[0].addEventListener("click", () => {
    toast[0].classList.remove("active");

    setTimeout(() => {
        progress[0].classList.remove("active");
    }, 300);

    clearTimeout(timer1);
    clearTimeout(timer2);
});

closeIcon[1].addEventListener("click", () => {
    toast[1].classList.remove("active");

    setTimeout(() => {
        progress[1].classList.remove("active");
    }, 300);

    clearTimeout(timer1);
    clearTimeout(timer2);
});