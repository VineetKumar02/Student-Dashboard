
app = angular.module('myApp', []);


// To validate the Sign In form
app.controller("signInController", ($scope, $http) => {

  // Default values to login (Only for Demo Version) - Remove for Production purpose
  $scope.digitalid = 2010502;
  $scope.pass1 = 12345678;


  $scope.formSubmitted = false;

  $scope.submitSignInForm = () => {

    if ($scope.signInForm.$valid) {

      // Form is valid, do something with the data
      var data = { digitalid: $scope.digitalid, password: $scope.pass1 };

      $http.post('/login', data)
        .then(response => {
          // console.log(response.data);
          showSuccessToast(response.data);

          // Add Digital Id to Session Storage to access it in any page
          sessionStorage.setItem('digitalId', $scope.digitalid);

          setTimeout(() => {
            location.href = `dashboard`;
          }, 2500);
        })
        .catch(error => {
          // console.error("Error:-\n", error);
          showErrorToast(error.data);
        });
    } else {

      // Form is invalid, show error messages
      $scope.formSubmitted = true;
    }
  };
});


// To validate the Sign Up form
app.controller("signUpController", ($scope, $http) => {

  $scope.formSubmitted = false;

  $scope.submitSignUpForm = () => {
    if ($scope.signUpForm.$valid) {

      $http.post('/signup', { digitalid: $scope.digitalid, password: $scope.pass2 })
        .then(response => {
          // console.log(response.data);
          showSuccessToast(response.data);

          // Add Digital Id to Session Storage to access it in any page
          sessionStorage.setItem('digitalId', $scope.digitalid);

          setTimeout(() => {
            location.href = `register`;
          }, 2500);

        })
        .catch(error => {
          // console.error("Error:-\n", error);
          showErrorToast(error.data);
        });


    } else {

      // Form is invalid, show error messages
      $scope.formSubmitted = true;
    }
  };
});


app.directive("compareTo", function () {
  return {
    require: "ngModel",
    scope:
    {
      confirmPassword: "=compareTo"
    },
    link: (scope, element, attributes, modelVal) => {
      modelVal.$validators.compareTo = (val) => {
        return val == scope.confirmPassword;
      };
      scope.$watch("confirmPassword", () => {
        modelVal.$validate();
      });
    }
  };
});



// To change b/w login and sigup page
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});


const inputs = document.querySelectorAll("input");

function addcl() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function remcl() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach(input => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});



// To toggle password view
const pass = document.getElementById("pass1");
const confirm_pass1 = document.getElementById("pass2");
const confirm_pass2 = document.getElementById("pass3");
const pass_toggle = document.getElementById("pass-toggle1");
const confirm_pass_toggle1 = document.getElementById("pass-toggle2");
const confirm_pass_toggle2 = document.getElementById("pass-toggle3");


pass_toggle.addEventListener("click", () => {
  if (pass.type === "password") {
    pass.type = "text";
    pass_toggle.style.color = "#0d4ba0";
  } else {
    pass.type = "password";
    pass_toggle.style.color = "grey";
  }
  pass_toggle.classList.toggle("fa-eye");
})

confirm_pass_toggle1.addEventListener("click", () => {
  if (confirm_pass1.type === "password") {
    confirm_pass1.type = "text";
    confirm_pass_toggle1.style.color = "#0d4ba0";
  } else {
    confirm_pass1.type = "password";
    confirm_pass_toggle1.style.color = "grey";
  }
  confirm_pass_toggle1.classList.toggle("fa-eye");
})

confirm_pass_toggle2.addEventListener("click", () => {
  if (confirm_pass2.type === "password") {
    confirm_pass2.type = "text";
    confirm_pass_toggle2.style.color = "#0d4ba0";
  } else {
    confirm_pass2.type = "password";
    confirm_pass_toggle2.style.color = "grey";
  }
  confirm_pass_toggle2.classList.toggle("fa-eye");
})