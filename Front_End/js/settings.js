var app = angular.module("myApp", ["ngRoute"]);

app.component('navbar', {
    templateUrl: 'html/navbar.html',
    controller: 'NavbarController'
});

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

    if (!sessionStorage.getItem('digitalId')) {
        location.href = "login";
    }
    $scope.digitalid = sessionStorage.getItem('digitalId');

    $scope.message = "";

    $http.post('/getAccount', { digitalid: $scope.digitalid })
        .then(response => {
            $scope.student = response.data;
            // console.log($scope.student);
        })
        .catch(error => {
            // console.error('Error:', error);
            showErrorToast(error.data);
        });
});


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



app.controller('academicController', function ($scope, $http) {

    $http.get('/getSubjects')
        .then(response => {
            $scope.subjects = response.data[$scope.student.semester];
            // console.log($scope.subjects);
        })
        .catch(error => {
            // console.error('Error:', error);
            showErrorToast(error.data);
        });

    $http.post('/getAccount', { digitalid: $scope.digitalid })
        .then(response => {
            $scope.student = response.data;
            // console.log($scope.student);

            $scope.cat1_marks = $scope.student.cat1.marks;
            $scope.cat2_marks = $scope.student.cat2.marks;
            $scope.cat3_marks = $scope.student.cat3.marks;

            $scope.cat1_attendance = $scope.student.cat1.attendance;
            $scope.cat2_attendance = $scope.student.cat2.attendance;
            $scope.cat3_attendance = $scope.student.cat3.attendance;

            $scope.marks = $scope.cat1_marks;
            $scope.attendance = $scope.cat1_attendance;
            $scope.sem = $scope.student.sem_gpa;

            $scope.select_exam = "cat1";
            $scope.sem_view = false;
            $scope.cat_view = true;

        })
        .catch(error => {
            // console.error('Error:', error);
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
                showSuccessToast("Password updated successfully!");
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

