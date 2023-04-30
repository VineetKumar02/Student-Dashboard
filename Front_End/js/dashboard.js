app = angular.module('myApp', []);

app.component('welcome', {
    templateUrl: 'welcome-compo.html',
    bindings: {
        name: '@'
    }
});


app.controller('dashboardController', function ($scope, $http, $q) {

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

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    $scope.digitalid = urlParams.get('digitalid');


    $http.post('http://localhost:4000/getAccount', { digitalid: $scope.digitalid })
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
            $scope.attendance = $scope.cat1_marks;

            $scope.progressEndValue1 = $scope.student.cgpa.$numberDecimal;
            $scope.progressEndValue2 = $scope.student.overall_avg_attendance.$numberDecimal;



            $q.when()
                .then(() => {
                    // Code to be run after data is fetched
                    $http.get('http://localhost:4000/getSubjects')
                        .then(response => {
                            $scope.subjects = response.data[$scope.student.semester];
                            $scope.theory_subs = response.data.theory_count[$scope.theory[$scope.student.semester] - 1];
                            // console.log($scope.theory_subs);
                            // console.log($scope.subjects);
                            $scope.calcaulateAverage();
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });


    $scope.calcaulateAverage = function () {

        if ($scope.cat1_marks && $scope.cat2_marks && $scope.cat3_marks) {
            var present1 = $scope.cat1_marks.some(item => item !== 0);
            var present2 = $scope.cat2_marks.some(item => item !== 0);
            var present3 = $scope.cat3_marks.some(item => item !== 0);

            $scope.catDone = 1;
            if (present1) {
                $scope.catDone = 1;
            }
            if (present2) {
                $scope.catDone++;
            }
            if (present3) {
                $scope.catDone++;
            }

            // console.log("CAT Finished: " + $scope.catDone);
        } else {
            console.log("CAT Marks are undefined");
        }

        var overall_avg = 0;

        for (var i = 0; i < $scope.theory_subs; i++) {

            var cat_temp = [$scope.cat1_marks[i], $scope.cat2_marks[i], $scope.cat3_marks[i]];
            var att_temp = [$scope.cat1_attendance[i], $scope.cat2_attendance[i], $scope.cat3_attendance[i]];

            cat_temp.sort(function (a, b) {
                return b - a;
            });

            var completed = (cat_temp[1] != 0 || cat_temp[2] != 0) ? 2 : 1;

            var avg1 = (cat_temp[0] + cat_temp[1]) / completed;
            var avg2 = (att_temp[0] + att_temp[1] + att_temp[2]) / $scope.catDone;
            $scope.student.avg_cat_marks[i] = avg1;
            $scope.student.avg_attendance[i] = avg2;
            overall_avg += avg2;
        }

        $scope.student.overall_avg_attendance = overall_avg / $scope.theory_subs;
        // console.log($scope.student.overall_avg_attendance);

        $http.post('http://localhost:4000/updateAverage', { digitalid: $scope.digitalid, avg1: $scope.student.avg_cat_marks, avg2: $scope.student.avg_attendance, avg3: $scope.student.overall_avg_attendance })
            .then(response => {
                console.log(response.data);
                $scope.progressEndValue2 = $scope.student.overall_avg_attendance;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };


    $scope.changeCatRight = function () {
        var cat = document.getElementById("cat-number").innerText;
        if (cat == "CAT-1") {
            document.getElementById("cat-number").innerText = "CAT-2";
            $scope.marks = $scope.cat2_marks;
            $scope.attendance = $scope.cat2_attendance;
        }
        else if (cat == "CAT-2") {
            document.getElementById("cat-number").innerText = "CAT-3";
            $scope.marks = $scope.cat3_marks;
            $scope.attendance = $scope.cat3_attendance;
        }
        else if (cat == "CAT-3") {
            document.getElementById("cat-number").innerText = "CAT-1";
            $scope.marks = $scope.cat1_marks;
            $scope.attendance = $scope.cat1_attendance;
        }
    }

    $scope.changeCatLeft = function () {
        var cat = document.getElementById("cat-number").innerText;
        if (cat == "CAT-1") {
            document.getElementById("cat-number").innerText = "CAT-3";
            $scope.marks = $scope.cat3_marks;
            $scope.attendance = $scope.cat3_attendance;
        }
        else if (cat == "CAT-2") {
            document.getElementById("cat-number").innerText = "CAT-1";
            $scope.marks = $scope.cat1_marks;
            $scope.attendance = $scope.cat1_attendance;
        }
        else if (cat == "CAT-3") {
            document.getElementById("cat-number").innerText = "CAT-2";
            $scope.marks = $scope.cat2_marks;
            $scope.attendance = $scope.cat2_attendance;
        }
    };

    // For Circular Progress Bar
    let circularProgress = document.querySelectorAll(".circular-progress"),
        progressValue = document.querySelectorAll(".progress-value");

    $scope.progressStartValue1 = 0;
    $scope.progressStartValue2 = 0;

    var speed1 = 1;
    var speed2 = 0.1;
    var bol = false;

    // To check if the element is in viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const intersecting = entry.isIntersecting;
            if (intersecting && bol == false) {

                let progress1 = setInterval(() => {
                    $scope.progressStartValue1 += 0.01;

                    progressValue[0].textContent = `${$scope.progressStartValue1.toFixed(2)}`;
                    circularProgress[0].style.background = `conic-gradient(#1164d8 ${$scope.progressStartValue1 * 360 / 10}deg, #ededed 0deg)`;

                    if ($scope.progressStartValue1 >= $scope.progressEndValue1) {
                        clearInterval(progress1);
                    }
                }, speed1);




                let progress2 = setInterval(() => {
                    $scope.progressStartValue2 += 0.1;

                    progressValue[1].textContent = `${$scope.progressStartValue2.toFixed(1)}%`;
                    circularProgress[1].style.background = `conic-gradient(#1164d8 ${$scope.progressStartValue2 * 360 / 100}deg, #ededed 0deg)`;

                    if ($scope.progressStartValue2 >= $scope.progressEndValue2) {
                        clearInterval(progress2);
                    }
                }, speed2);
                bol = true;
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.getElementsByClassName("graphs")[0]);
});
