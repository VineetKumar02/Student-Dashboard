app.controller('NavbarController', function ($scope, $location, $window) {
    // Initialize the sidebar state
    $scope.isSidebarOpen = false;

    // Get the current URL path from the browser's location object
    var url = $window.location.pathname;

    // Set the active page based on the URL
    $scope.page = getPageFromUrl($location.path());

    // Toggle the sidebar state
    $scope.toggleSidebar = function () {
        $scope.isSidebarOpen = !$scope.isSidebarOpen;
    };

    // Listen for location change event to update the active page
    $scope.$on('$locationChangeSuccess', function () {
        $scope.page = getPageFromUrl(url);
    });

    // Function to extract the page name from the URL
    function getPageFromUrl(url) {
        var page = url.substring(url.lastIndexOf('/') + 1);

        // Map specific pages to the 'settings' page
        if (page === 'account' || page === 'academic' || page === 'password') {
            page = 'settings';
        }

        // Set a default page if none is provided
        return page || 'dashboard';
    }

    // Function to reset the session
    $scope.resetSession = function () {
        sessionStorage.removeItem('digitalId');
    };
});
