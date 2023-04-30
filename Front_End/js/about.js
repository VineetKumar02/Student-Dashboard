
var app = angular.module('myApp', []);

app.controller('aboutController', function ($scope) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    $scope.digitalid = urlParams.get('digitalid');
});

app.controller("videoController", function ($scope) {
    $scope.videoSrc = "https://res.cloudinary.com/codelife/video/upload/v1637805738/intro_l5ul1k.mp4";
});

app.controller('textEditorController', function ($scope) {
    $scope.bold = function () {
        document.execCommand('bold', false, null);
    };

    $scope.italic = function () {
        document.execCommand('italic', false, null);
    };

    $scope.underline = function () {
        document.execCommand('underline', false, null);
    };
});



var show_hide_btn = document.getElementById('show-hide-btn');
var additional_container = document.querySelector('.additional-container');

show_hide_btn.addEventListener('click', function () {
    additional_container.classList.toggle('active');
    if (additional_container.classList.contains('active')) {
        show_hide_btn.innerHTML = 'Hide Additional Details';
    }
    else {
        show_hide_btn.innerHTML = 'Show Additional Details';
    }
});


var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var imageObj = new Image();

imageObj.onload = function () {
    context.drawImage(imageObj, 20, 10);
};
imageObj.src = '../images/ssn-logo.png';


var x = document.getElementById("loc");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    x.innerHTML = "<b>Latitude: </b>" + position.coords.latitude +
        "<br> <b>Longitude: </b>" + position.coords.longitude;
}



let calcScrollValue = () => {
    let scrollProgress = document.getElementById("progress");
    let pos = document.documentElement.scrollTop;
    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);

    scrollProgress.style.background = `conic-gradient(#03cc65 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;