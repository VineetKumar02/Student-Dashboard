var app = angular.module('myApp', []);

// Navbar Component is included here
app.component('navbar', {
    templateUrl: 'html/navbar.html',
    controller: 'NavbarController'
});

app.controller('calculatorController', ($scope, $http, $q) => {

    // To get digital id from sesion storage. If not present, go to login page
    if (!sessionStorage.getItem('digitalId')) {
        location.href = "login";
    }
    $scope.digitalid = sessionStorage.getItem('digitalId');

    // Set default values
    $scope.grade = [];
    $scope.semCredits = [];


    $scope.showGPAResult = false;
    $scope.showCGPAResult = false;

    $scope.isPopup1_Open = false;
    $scope.isPopup2_Open = false;

    $scope.showGpa = true;
    $scope.showCgpa = false;

    // Functions to switch layout between GPA & CGPA
    $scope.showGpaLayout = () => {
        $scope.showGpa = true;
        $scope.showCgpa = false;
    };

    $scope.showCgpaLayout = () => {
        $scope.showGpa = false;
        $scope.showCgpa = true;
    };

    // For mapping semester from string to number
    $scope.theory = {
        "I": 1,
        "II": 2,
        "III": 3,
        "IV": 4,
        "V": 5,
        "VI": 6,
        "VII": 7,
        "VIII": 8
    };


    $http.post('/getAccount', { digitalid: $scope.digitalid })
        .then(response => {
            $scope.student = response.data;
            $scope.semester = $scope.student.semester;
            $scope.semdone = $scope.theory[$scope.semester];

            // Run code after data is fetched
            $q.when()
                .then(() => {
                    $scope.updateSubjects();
                });
        })
        .catch(error => {
            // console.error(error);
            showErrorToast(error.data);
        });


    $scope.updateSubjects = () => {
        $http.get('/getSubjects')
            .then(response => {
                $scope.subjects = response.data[$scope.semester];
                $scope.sem_credits = response.data.sem_credits;
            })
            .catch(error => {
                // console.error('Error:', error);
                showErrorToast(error.data);
            });
    };


    $scope.calculateGPA = () => {
        $scope.creditsum = 0;
        $scope.value = 0;

        for (let i = 0; i < $scope.subjects.length; i++) {
            $scope.value += ($scope.grade[i] * $scope.subjects[i].credits);
            $scope.creditsum += $scope.subjects[i].credits;
        }

        $scope.gpa_result = parseFloat($scope.value / $scope.creditsum).toFixed(2);
        $scope.showGPAResult = true;
        $scope.isPopup1_Open = true;
    };

    $scope.closePopup1 = () => {
        $scope.isPopup1_Open = false;
    };


    $scope.updateGPA = () => {
        $scope.student.sem_gpa[$scope.theory[$scope.semester] - 1] = parseFloat($scope.gpa_result);

        $http.post('/updateGPA', { digitalid: $scope.digitalid, sem_gpa: $scope.student.sem_gpa })
            .then(response => {
                // console.log(response.data);
                showSuccessToast(response.data);
                $scope.closePopup1();
            })
            .catch(error => {
                // console.error('Error:', error);
                showErrorToast(error.data);
            });
    };


    $scope.calculateCGPA = () => {
        $scope.sum = 0;
        $scope.totalcredits = 0;
        for (let i = 0; i < $scope.semdone; i++) {
            $scope.sum += ($scope.student.sem_gpa[i] * $scope.sem_credits[i]);
            $scope.totalcredits += $scope.sem_credits[i];
        }
        $scope.cgpa_result = parseFloat($scope.sum / $scope.totalcredits).toFixed(2);

        $scope.showCGPAResult = true;
        $scope.isPopup2_Open = true;
    };

    $scope.closePopup2 = () => {
        $scope.isPopup2_Open = false;
    };


    $scope.updateCGPA = () => {
        $scope.student.cgpa = $scope.cgpa_result;
        
        $http.post('/updateCGPA', { digitalid: $scope.digitalid, sem_gpa: $scope.student.sem_gpa, cgpa: $scope.student.cgpa })
            .then(response => {
                // console.log(response.data);
                showSuccessToast(response.data);
                $scope.closePopup2();
            })
            .catch(error => {
                // console.error('Error:', error);
                showErrorToast(error.data);
            });
    };


    $scope.reset = () => {
        $scope.showGPAResult = false;
        $scope.showCGPAResult = false;
        $scope.isPopup1_Open = false;
        $scope.isPopup2_Open = false;
        $scope.grade = [];
        $scope.semCredits = [];
    };
});

