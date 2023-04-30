app = angular.module('myApp', ['ngMessages']);


app.controller('registerController', function ($scope, $http, messageService) {
    $scope.message = messageService.getMessage();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    $scope.digitalid = urlParams.get('digitalid');

    // console.log($scope.digitalid);     // this will log the digitalid value passed from the previous page

    regno_RGEX = /^\d{9}$/;
    digitalid_RGEX = /^\d{7}$/;

    $scope.validateForm = function () {
        var formValid = true;
        var regno_Result = regno_RGEX.test($scope.regNo);
        var digitalid_Result = digitalid_RGEX.test($scope.digitalid);

        if (!regno_Result) {
            alert("Reg No must contain 9 digits.");
            return;
        }

        if (!digitalid_Result) {
            alert("Digital ID must contain 7 digits.");
            return;
        }

        return formValid;
    };

    
    $scope.submitForm = function () {
        if ($scope.validateForm()) {
            console.log("Form is valid");

            // Create a data object to send to the server
            var data = {
                name: $scope.name,
                email: $scope.email,
                regNo: $scope.regNo,
                digitalid: $scope.digitalid,
                dept: $scope.dept,
                semester: $scope.semester,
                gender: $scope.gender
            };

            // Send a POST request to the server to add data to the database
            $http.post('http://localhost:4000/register', data)
                .then(response => {
                    // console.log("Data added to MongoDB:", response);
                    showSuccessToast(response.data);

                    setTimeout(() => {
                        location.href = `dashboard.html?digitalid=${$scope.digitalid}`;
                    }, 3000);

                })
                .catch(err => {
                    console.log("Error adding data to MongoDB:", err);
                    showErrorToast(err.data);
                });
        }
    }
});



// To implement the simple message service
app.service('messageService', function () {
    var message = "**Enter your gender";
    return {
        getMessage: function () {
            return message;
        }
    };
});
