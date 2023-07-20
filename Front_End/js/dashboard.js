app = angular.module('myApp', []);

// Navbar Component is included here
app.component('navbar', {
    templateUrl: 'html/navbar.html',
    controller: 'NavbarController'
});



app.controller('dashboardController', ($scope, $http, $q) => {

    // To get digital id from sesion storage. If not present, go to login page
    if (!sessionStorage.getItem('digitalId')) {
        location.href = "login";
    }
    $scope.digitalid = sessionStorage.getItem('digitalId');

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
            // console.log($scope.student);

            // Assign Cat Marks and Attendance to variables
            $scope.cat1_marks = $scope.student.cat1.marks;
            $scope.cat2_marks = $scope.student.cat2.marks;
            $scope.cat3_marks = $scope.student.cat3.marks;

            $scope.cat1_attendance = $scope.student.cat1.attendance;
            $scope.cat2_attendance = $scope.student.cat2.attendance;
            $scope.cat3_attendance = $scope.student.cat3.attendance;

            // By defualt, display CAT-1 marks and attendance
            $scope.marks = $scope.cat1_marks;
            $scope.attendance = $scope.cat1_marks;

            // The value to display in circular progress bar. Avg Marks & Attendance
            $scope.progressEndValue1 = $scope.student.cgpa.$numberDecimal;
            $scope.progressEndValue2 = $scope.student.overall_avg_attendance.$numberDecimal;


            // This code runs only after the student data is recieved from backend
            $q.when()
                .then(() => {
                    $http.get('/getSubjects')
                        .then(response => {
                            $scope.subjects = response.data[$scope.student.semester];
                            $scope.theory_subs = response.data.theory_count[$scope.theory[$scope.student.semester] - 1];
                            $scope.sem_credits = response.data.sem_credits;
                            $scope.calcaulateAverage();
                        })
                        .catch(error => {
                            // console.error('Error:', error);
                            showErrorToast(error.data);
                        });
                });
        })
        .catch(error => {
            // console.error('Error:', error);
            showErrorToast(error.data);
        });

    // Function to calculate average
    $scope.calcaulateAverage = () => {

        if ($scope.cat1_marks && $scope.cat2_marks && $scope.cat3_marks) {

            // To check even if 1 subject mark in non-zero for a CAT. It means that CAT has been finished
            var present1 = $scope.cat1_marks.some(item => item !== 0);
            var present2 = $scope.cat2_marks.some(item => item !== 0);
            var present3 = $scope.cat3_marks.some(item => item !== 0);

            $scope.catDone = 1;
            if (present1) {
                $scope.catDone = 1;
            }
            if (present2) {
                $scope.catDone = 2;
            }
            if (present3) {
                $scope.catDone = 3;
            }
        } else {
            showErrorToast("CAT Marks are undefined");
        }

        // Calculate overall average
        var overall_avg = 0;

        for (var i = 0; i < $scope.theory_subs; i++) {

            var cat_temp = [$scope.cat1_marks[i], $scope.cat2_marks[i], $scope.cat3_marks[i]];
            var att_temp = [$scope.cat1_attendance[i], $scope.cat2_attendance[i], $scope.cat3_attendance[i]];

            cat_temp.sort((a, b) => {
                return b - a;
            });

            // Sort the array and choose top 2 highest maerk for a subject & check how many exams are over
            var completed = (cat_temp[1] != 0 || cat_temp[2] != 0) ? 2 : 1;

            var avg1 = (cat_temp[0] + cat_temp[1]) / completed;
            var avg2 = (att_temp[0] + att_temp[1] + att_temp[2]) / $scope.catDone;

            // Update average of that subject and overall too
            $scope.student.avg_cat_marks[i] = avg1;
            $scope.student.avg_attendance[i] = avg2;
            overall_avg += avg2;
        }

        $scope.student.overall_avg_attendance = overall_avg / $scope.theory_subs;

        // Calculate Total CGPA
        $scope.sum = 0;
        $scope.totalcredits = 0;

        // For all 8 semesters, get GPA and credits for that semester
        for (let i = 0; i < 8; i++) {
            if ($scope.student.sem_gpa[i] != 0) {
                $scope.sum += ($scope.student.sem_gpa[i] * $scope.sem_credits[i]);
                $scope.totalcredits += $scope.sem_credits[i];
            }
        }
        // If Even 1 semester is completed. Update CGPA, else make it 0
        if ($scope.totalcredits != 0) {
            $scope.cgpa_result = parseFloat($scope.sum / $scope.totalcredits).toFixed(2);
            $scope.student.cgpa = $scope.cgpa_result;
        }
        else {
            $scope.student.cgpa = 0;
        }

        $http.post('/updateAverage', { digitalid: $scope.digitalid, avg1: $scope.student.avg_cat_marks, avg2: $scope.student.avg_attendance, avg3: $scope.student.overall_avg_attendance, avg4: $scope.student.cgpa })
            .then(response => {
                // Update circular progress values
                $scope.progressEndValue1 = $scope.student.cgpa;
                $scope.progressEndValue2 = $scope.student.overall_avg_attendance;
            })
            .catch(error => {
                // console.error('Error:', error);
                showErrorToast(error.data);
            });
    };

    // Handle logic for displaying CAT Details (Subject-Wise)
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
                    $scope.progressStartValue1 += 0.02;

                    progressValue[0].textContent = `${$scope.progressStartValue1.toFixed(2)}`;
                    circularProgress[0].style.background = `conic-gradient(#1164d8 ${$scope.progressStartValue1 * 360 / 10}deg, #ededed 0deg)`;

                    if ($scope.progressStartValue1 >= $scope.progressEndValue1) {
                        progressValue[0].textContent = `${$scope.progressStartValue1.toFixed(2) - 0.01}`;
                        clearInterval(progress1);
                    }
                }, speed1);


                let progress2 = setInterval(() => {
                    $scope.progressStartValue2 += 0.2;

                    progressValue[1].textContent = `${$scope.progressStartValue2.toFixed(1)}%`;
                    circularProgress[1].style.background = `conic-gradient(#1164d8 ${$scope.progressStartValue2 * 360 / 100}deg, #ededed 0deg)`;

                    if ($scope.progressStartValue2 >= $scope.progressEndValue2) {
                        progressValue[1].textContent = `${$scope.progressStartValue2.toFixed(1) - 0.2}%`;
                        clearInterval(progress2);
                    }
                }, speed2);
                bol = true;
            }
        });
    }, { threshold: 0.75 });

    observer.observe(document.getElementsByClassName("graphs")[0]);


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



