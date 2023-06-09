app = angular.module('myApp', []);


app.component('navbar', {
    templateUrl: 'html/navbar.html',
    controller: 'NavbarController'
});



app.controller('dashboardController', ($scope, $http, $q) => {

    if (!sessionStorage.getItem('digitalId')) {
        location.href = "login";
    }
    $scope.digitalid = sessionStorage.getItem('digitalId');

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
                    $http.get('/getSubjects')
                        .then(response => {
                            $scope.subjects = response.data[$scope.student.semester];
                            $scope.theory_subs = response.data.theory_count[$scope.theory[$scope.student.semester] - 1];
                            $scope.sem_credits = response.data.sem_credits;
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


    $scope.calcaulateAverage = () => {

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

            cat_temp.sort((a, b) => {
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

        $scope.sum = 0;
        $scope.totalcredits = 0;
        for (let i = 0; i < 8; i++) {
            if ($scope.student.sem_gpa[i] != 0) {
                $scope.sum += ($scope.student.sem_gpa[i] * $scope.sem_credits[i]);
                $scope.totalcredits += $scope.sem_credits[i];
            }
        }
        if ($scope.totalcredits != 0) {
            $scope.cgpa_result = parseFloat($scope.sum / $scope.totalcredits).toFixed(2);
            $scope.student.cgpa = $scope.cgpa_result;
            // console.log($scope.cgpa_result);
        }
        else {
            $scope.student.cgpa = 0;
        }

        $http.post('/updateAverage', { digitalid: $scope.digitalid, avg1: $scope.student.avg_cat_marks, avg2: $scope.student.avg_attendance, avg3: $scope.student.overall_avg_attendance, avg4: $scope.student.cgpa })
            .then(response => {
                // console.log(response.data);
                $scope.progressEndValue1 = $scope.student.cgpa;
                $scope.progressEndValue2 = $scope.student.overall_avg_attendance;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };


    $scope.changeCatRight = () => {
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

    $scope.changeCatLeft = () => {
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
                        progressValue[0].textContent = `${$scope.progressStartValue1.toFixed(2) - 0.01}`;
                        clearInterval(progress1);
                    }
                }, speed1);


                let progress2 = setInterval(() => {
                    $scope.progressStartValue2 += 0.1;

                    progressValue[1].textContent = `${$scope.progressStartValue2.toFixed(1)}%`;
                    circularProgress[1].style.background = `conic-gradient(#1164d8 ${$scope.progressStartValue2 * 360 / 100}deg, #ededed 0deg)`;

                    if ($scope.progressStartValue2 >= $scope.progressEndValue2) {
                        progressValue[1].textContent = `${$scope.progressStartValue2.toFixed(1) - 0.01}%`;
                        clearInterval(progress2);
                    }
                }, speed2);
                bol = true;
            }
        });
    }, { threshold: 0 });

    observer.observe(document.getElementsByClassName("graphs")[0]);


    $scope.smoothScroll = function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
});



let calcScrollValue = () => {
    let scrollProgress = document.getElementById("progress");
    let pos = document.documentElement.scrollTop;
    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);

    scrollProgress.style.background = `conic-gradient(#03cc65 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;