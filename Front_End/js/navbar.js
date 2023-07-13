app.controller('NavbarController', function ($scope, $location, $window) {

    // Get the current URL path from the browser's location object
    var url = $window.location.pathname;

    $scope.isSidebarOpen = false;
    $scope.page = getPageFromUrl($location.path());

    $scope.toggleSidebar = function () {
        $scope.isSidebarOpen = !$scope.isSidebarOpen;
    };

    $scope.$on('$locationChangeSuccess', function () {
        $scope.page = getPageFromUrl(url);
    });

    function getPageFromUrl(url) {
        // Extract the page name from the URL
        var page = url.substring(url.lastIndexOf('/') + 1);
        if (page === 'account' || page === 'academic' || page === 'password')
            page = 'settings';
        return page || 'dashboard';   // Set a default page if none is provided
    }

    $scope.resetSession = function () {
        sessionStorage.removeItem('digitalId');
    }
});
