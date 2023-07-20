var app = angular.module('myApp', []);

app.component('navbar', {
    templateUrl: 'html/navbar.html',
    controller: 'NavbarController'
});

app.controller('aboutController', ($scope) => {

    // To get digital id from sesion storage. If not present, go to login page
    if (!sessionStorage.getItem('digitalId')) {
        location.href = "login";
    }

    // To scroll to top of the page
    $scope.smoothScroll = function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Function to calculate and update scroll progress
    const calcScrollValue = () => {
        const scrollProgress = document.getElementById("progress");
        const pos = document.documentElement.scrollTop;

        // Calculate the height of the scrollable content
        const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // Calculate the scroll value as a percentage
        const scrollValue = Math.round((pos * 100) / calcHeight);

        // Update the background of the progress element
        scrollProgress.style.background = `conic-gradient(#03cc65 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
    };

    // Attach the calcScrollValue function to scroll and load events
    window.addEventListener("scroll", calcScrollValue);
    window.addEventListener("load", calcScrollValue);

});