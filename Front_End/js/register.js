app = angular.module('myApp', []);


app.controller('registerController', ($scope, $http, messageService) => {

    // To get digital id from sesion storage. If not present, go to login page
    if (!sessionStorage.getItem('digitalId')) {
        location.href = "login";
    }
    $scope.digitalid = sessionStorage.getItem('digitalId');
    $scope.message = messageService.getMessage();


    regno_RGEX = /^\d{9}$/;
    digitalid_RGEX = /^\d{7}$/;

    $scope.validateForm = () => {
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


    $scope.submitForm = () => {
        if ($scope.validateForm()) {
            // console.log("Form is valid");

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
            $http.post('/register', data)
                .then(response => {
                    // console.log(response.data);
                    showSuccessToast(response.data);

                    setTimeout(() => {
                        location.href = `dashboard`;
                    }, 3000);

                })
                .catch(error => {
                    // console.log(error);
                    showErrorToast(error.data);
                });
        }
    }
});



// To implement the simple message service
app.service('messageService', function () {
    var message = "**Enter your gender";
    return {
        getMessage: () => {
            return message;
        }
    };
});
