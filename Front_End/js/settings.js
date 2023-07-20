var app = angular.module("myApp", ["ngRoute"]);

// Navbar Component is included here
app.component('navbar', {
    templateUrl: 'html/navbar.html',
    controller: 'NavbarController'
});

// Code for internal client-side routing
app.config(($routeProvider) => {
    $routeProvider
        .when("/account", {
            templateUrl: "/html/account.html",
            controller: "accountController",
        })
        .when("/academic", {
            templateUrl: "/html/academic.html",
            controller: "academicController",
        })
        .when("/password", {
            templateUrl: "/html/password.html",
            controller: "passwordController",
        })
        .otherwise({ redirectTo: "/account" });
});




app.controller("settingsController", ($scope, $http) => {

    // To get digital id from sesion storage. If not present, go to login page
    if (!sessionStorage.getItem('digitalId')) {
        location.href = "login";
    }
    $scope.digitalid = sessionStorage.getItem('digitalId');
    $scope.message = "";

    $http.post('/getAccount', { digitalid: $scope.digitalid })
        .then(response => {
            $scope.student = response.data;
        })
        .catch(error => {
            // console.error('Error:', error);
            showErrorToast(error.data);
        });
});

// For updating active class on the tab links
app.controller('navController', ($scope, $location) => {
    $scope.isActive = function (route) {
        return route === $location.path();
    }
});



app.controller("accountController", function ($scope, $http) {

    $scope.submitAccountForm = function () {
        $http.put('/updateAccount', $scope.student)
            .then(response => {
                // console.log(response.data);
                showSuccessToast("Account updated successfully!");
            })
            .catch(error => {
                // console.error('Error:', error);
                showErrorToast(error.data);
                // showErrorToast("Error updating account!");
            });
    };


    $scope.cancel = function () {
        location.reload();
    };


});



app.controller('academicController', function ($scope, $http, $q) {

    $http.post('/getAccount', { digitalid: $scope.digitalid })
        .then(response => {
            $scope.student = response.data;

            // Assign CAT Marks & Attendance
            $scope.cat1_marks = $scope.student.cat1.marks;
            $scope.cat2_marks = $scope.student.cat2.marks;
            $scope.cat3_marks = $scope.student.cat3.marks;

            $scope.cat1_attendance = $scope.student.cat1.attendance;
            $scope.cat2_attendance = $scope.student.cat2.attendance;
            $scope.cat3_attendance = $scope.student.cat3.attendance;

            // Set Default values to CAT-1
            $scope.marks = $scope.cat1_marks;
            $scope.attendance = $scope.cat1_attendance;
            $scope.sem = $scope.student.sem_gpa;

            $scope.select_exam = "cat1";
            $scope.sem_view = false;
            $scope.cat_view = true;


            // Code to be run after data is fetched
            $q.when()
                .then(() => {
                    $http.get('/getSubjects')
                        .then(response => {
                            $scope.subjects = response.data[$scope.student.semester];
                        })
                        .catch(error => {
                            // console.error('Error:', error);
                            showErrorToast(error);
                        });
                });

        })
        .catch(error => {
            // console.error('Error:', error);
            showErrorToast(error.data);
        });


    $scope.examChange = function () {
        if ($scope.select_exam == "cat1") {
            $scope.marks = $scope.cat1_marks;
            $scope.attendance = $scope.cat1_attendance;
            $scope.cat_view = true;
            $scope.sem_view = false;
        }
        else if ($scope.select_exam == "cat2") {
            $scope.marks = $scope.cat2_marks;
            $scope.attendance = $scope.cat2_attendance;
            $scope.cat_view = true;
            $scope.sem_view = false;
        }
        else if ($scope.select_exam == "cat3") {
            $scope.marks = $scope.cat3_marks;
            $scope.attendance = $scope.cat3_attendance;
            $scope.cat_view = true;
            $scope.sem_view = false;
        }
        else if ($scope.select_exam == "sem") {
            $scope.sem_view = true;
            $scope.cat_view = false;
        }
    };


    $scope.submitAcademicForm = function (event) {

        // To prevent page from reloading
        event.preventDefault();

        $http.put('/updateAcademic', $scope.student)
            .then(response => {
                // console.log(response.data);
                showSuccessToast("Marks updated successfully!");
            })
            .catch(error => {
                // console.error('Error:', error);
                showErrorToast(error.data);
            });
    };


    $scope.cancel = function () {
        location.reload();
    };
});



app.controller('passwordController', function ($scope, $http) {

    $scope.submitPasswordForm = function () {

        var data = { digitalid: $scope.digitalid, oldpass: $scope.oldpass, newpass: $scope.newpass, confirmnewpass: $scope.confirmnewpass };

        $http.post('/updatePassword', data)
            .then(response => {
                // console.log(response.data);
                showSuccessToast(response.data);
                $scope.oldpass = "";
                $scope.newpass = "";
                $scope.confirmnewpass = "";
            })
            .catch(error => {
                // console.error("Error:-\n", error);
                showErrorToast(error.data);
            });
    };


    $scope.cancel = function () {
        location.reload();
    };
});

