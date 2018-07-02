import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-blog-post-2',
  templateUrl: './post2.component.html',
})
export class BlogPost2Component {

  ngAfterViewInit() {
    $(".ui.sticky.page.navigation").sticky({
      context: "#blog"
    });
  }

  registerRest = `<?php
require_once (__DIR__ . '/OpenQollo_1_register_insert.php');

// parse the input data to a JSON object
$request = json_decode(file_get_contents("php://input"));

$email = trim($request->email);
$password = trim($request->password);

// call the registration logic
$response = register($email, $password);

// send the response as encoded JSON
echo ")]}',\n" . json_encode($response);
?>`;

  registerInsert = `<?php
require_once (__DIR__ . '/register_verify.php');

/**
 * Validates user input, then registers the user. The returned response displays either success or failure information about the registration.
 */
function register($email, $password) {
  $response = array();
  $response['errors']['email'] = checkEmail($email);
  $response['errors']['password'] = checkPassword($password);
  
  // if an error was not found, attempt to register the user
  if (count(array_filter($response['errors'])) == 0) {
    $response['success'] = registerUser($email, $number, $password);
    
    if (empty($response['success'])) {
      $response['errors']['other'] = "The server failed to register user";
    }
  }
  return $response;
}

/**
 * Generates an initialization vector to be used as a salt.
 */
function generateSalt() {
  return mcrypt_create_iv(64, MCRYPT_DEV_URANDOM);
}

/**
 * Returns a digested plaintext string with the given initialization vector.
 */
function digest($plaintext, $salt) {
  // use the tried and tested bcrypt build into PHP 5.5+
  return password_hash($plaintext, PASSWORD_BCRYPT, array("salt" => $salt));
}

/**
 * Registers user info that has already been validated. Returns true if the user was inserted.
 */
function registerUser($email, $password) {
  $digestedEmail = digest($email, EMAIL_SALT);
  $salt = generateSalt();
  $digestedPassword = digest($password, $salt);
  
  $conn = new PDO("mysql:host=localhost;dbname=DB_ALIAS", "DB_USERNAME", "DB_PASSWORD");
  $sql = "INSERT INTO users " . //
    "(email, password, salt) " . //
    "VALUES(:digestedEmail, :digestedPassword, :salt)";
  $stmt = $conn -> prepare($sql);
  $stmt -> bindParam(":digestedEmail", $digestedEmail, PDO::PARAM_STR);
  $stmt -> bindParam(":salt", $salt, PDO::PARAM_STR);
  $stmt -> bindParam(":digestedPassword", $digestedPassword, PDO::PARAM_STR);
  
  $success = $stmt -> execute();
  $conn = null;
  $stmt = null;
  
  return $success;
}
?>`;

  registerVerify = `<?php
define('EMAIL_SALT', 'abcdefghijklmnopqrstuvwxyz1234567890');
define('PASSWORD_MIN_CHARS', 8);
define('PASSWORD_MIN_NUMBERS', 1);
define('PASSWORD_MIN_SYMBOLS', 0);
define('PASSWORD_MIXED_CASE', false);

/**
 * Validates email input. Returns null if the email meets all requirements.
 */
function checkEmail($email) {
  // email must be a valid address
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    return "Please enter a valid email address.";
  }
  // email must be unique
  else if (!checkEmailUnique($email)) {
    return "That email has already been taken.";
  }
  return null;
}

/**
 * Validates email input is unique. Returns true if the email is unique.
 */
function checkEmailUnique($email) {
  $digestedEmail = digest($email, EMAIL_SALT);
  
  $conn = new PDO("mysql:host=localhost;dbname=DB_ALIAS", "DB_USERNAME", "DB_PASSWORD");
  $sql = "SELECT email FROM users WHERE email = :digestedEmail";
  $stmt = $conn -> prepare($sql);
  $stmt -> bindParam(":digestedEmail", $digestedEmail, PDO::PARAM_STR);
  
  $isUnique = false;
  if ($stmt -> execute()) {
    if ($stmt -> rowCount() == 0) {
      $isUnique = true;
    }
  }
  $conn = null;
  $stmt = null;
  return $isUnique;
}

/**
 * Validates password input. Returns null if the password meets all requirements.
 */
function checkPassword($password) {
  $conditionsMet = true;
  // password must contain no spaces
  $conditionsMet &= !preg_match('/\s/', $password);
  // password must have a minimum number of characters
  $conditionsMet &= strlen($password) >= PASSWORD_MIN_CHARS;
  // password may need to have mixed case (if preferred)
  $conditionsMet &= (preg_match('/(?=.*[a-z])(?=.*[A-Z])/', $password) || !PASSWORD_MIXED_CASE);
  // password must have a minimum number of numbers
  $conditionsMet &= preg_match_all('/\d/', $password, $matches) >= PASSWORD_MIN_NUMBERS;
  // password must have a minimum number of symbols
  $conditionsMet &= preg_match_all("/[-!$%^&*(){}<>[\]'" . '"|#@:;.,?+=_\/\~]/', $password, $matches) >= PASSWORD_MIN_SYMBOLS;
  
  // if conditions were not met, build a error message dictating the password requirements
  if (!$conditionsMet) {
    $requirements = array();
    if (PASSWORD_MIN_NUMBERS == 1) {
      $requirements[] = "1 number";
    } else if (PASSWORD_MIN_NUMBERS > 1) {
      $requirements[] = PASSWORD_MIN_NUMBERS . " numbers";
    }
    
    if (PASSWORD_MIN_SYMBOLS == 1) {
      $requirements[] = "1 symbol";
    } else if (PASSWORD_MIN_SYMBOLS > 1) {
      $requirements[] = PASSWORD_MIN_SYMBOLS . " symbols";
    }
    
    if (PASSWORD_MIXED_CASE) {
      $requirements[] = "have mixed case";
    }
    $message = "Must contain " . PASSWORD_MIN_CHARS . " characters including ";
    for ($i = 0; $i < count($requirements); $i++) {
      if ($i == count($requirements) - 1 && $i == 0) {
        $message .= " $requirements[$i].";
      } else if ($i == count($reqs) - 1) {
        $message .= " $requirements[$i] and no spaces.";
      } else {
        $message .= "$requirements[$i], ";
      }
    }
    return $message;
  }
  return null;
}

/**
 * Validates user input, then registers the user. The returned response displays either success or failure information about the registration.
 */
function register($email, $password) {
  $response = array();
  $response['errors']['email'] = checkEmail($email);
  $response['errors']['password'] = checkPassword($password);
  
  if (count(array_filter($response['errors'])) == 0) {
    $response['success'] = registerUser($email, $password);
    
    if (empty($response['success'])) {
      $response['errors']['server'] = "The server failed to register user";
    }
  }
  return $response;
}

?>`;

  loginRest = `<?php
require_once (__DIR__ . '/login_database.php');

// parse the input data to a JSON object
$request = json_decode(file_get_contents("php://input"));

$email = trim($request->email);
$password = trim($request->password);

// call the login logic
$response = login($email, $password);

// send the response as encoded JSON
echo ")]}',\n" . json_encode($response);
?>`;

  loginDatabase = `<?php
include_once(__DIR__ . '/register_insert.php');
include_once(__DIR__ . '/register_verify.php');

/**
 * Retrieves the user associated with the given email address.
 */
function getUserByEmail($email) {
  $digestedEmail = digest($email, EMAIL_SALT);
  
  $conn = new PDO("mysql:host=localhost;dbname=DB_ALIAS", "DB_USERNAME", "DB_PASSWORD");
  $sql = "SELECT * FROM users WHERE email = :digestedEmail LIMIT 1";
  $stmt = $conn -> prepare($sql);
  $stmt -> bindParam(":digestedEmail", $digestedEmail, PDO::PARAM_STR);
  
  $user = null;
  if ($stmt -> execute()) {
    if ($stmt -> rowCount()) {
      $user = $stmt -> fetch(PDO::FETCH_ASSOC);
    }
  }
  $conn = null;
  $stmt = null;
  
  return $user;
}

/**
 * Validates user login credentials. The returned response displays either success or failure information about the login.
 */
function login($email, $password) {
  $response = array();
  if (empty($email)) {
    $response['errors']['email'] = "Please enter your email";
  } else if (empty($password)) {
    $response['errors']['password'] = "Please enter your password";
  } else {
    $user = getUserByEmail($email);
    
    if (!empty($user)) {
      $storedSalt = $user["salt"];
      $storedDigestedPassword = $user["password"];
      $inputDigestedPassword = digest($password, $storedSalt);
      
      if ($inputDigestedPassword == $storedDigestedPassword) {
        $response['success']['userId'] = $user["userId"];
      } else {
        $response['errors']['password'] = "That password is incorrect";
      }
    } else {
      $response['errors']['email'] = "No account associated with that email";
    }
  }
  return $response;
}

?>`;

  mvcIndex = `<!DOCTYPE html>
<html>
  <head>
    <script src="https://code.angularjs.org/1.3.5/angular.js"></script>
    <script src="http://angular-ui.github.io/ui-router/release/angular-ui-router.js"></script>
    <script src="http://alanbuttars.com/docs/OpenQollo_1_app.js"></script>
    <script src="http://alanbuttars.com/docs/OpenQollo_1_controllers.js"></script>
    <script src="http://alanbuttars.com/docs/OpenQollo_1_services.js"></script>
  </head>
  
  <body ng-app="entryApp">
    <div ui-view></div>
  </body>
</html>`;

  mvcLogin = `<div ng-controller="LoginCtrl">
  <p class="error" ng-show="errors.server">{{errors.server}}</p>
  
  <ul style="list-style-type: none">
    <li>
      <label>
        <input type="text" ng-model="user.email" placeholder="Email" required maxlength="64" />
        <span ng-show="errors.email">{{errors.email}}</span>
      </label>
    </li>
    
    <li>
      <label>
        <input type="password" ng-model="user.password" placeholder="Password" required	maxlength="64" />
        <span ng-show="errors.password">{{errors.password}}</span>
      </label>
    </li>

    <li>
      <button ng-click="login()">Login</button>
    </li>
  </ul>
</div>`;

  mvcApp = `'use strict';

// angular.module allows you to create modules, or your own collections of
// controllers and services. 
var entryApp = angular.module('entryApp', [ 'ui.router', 'entryControllers' ]);

entryApp.config(function($stateProvider, $urlRouterProvider) {
  // We'll go over $stateProvider and $urlRouterProvider later. For now,
  // just know that they come from a sibling project, angular-ui-router, 
  // and they control navigation between HTML pages and states.
  $stateProvider
    .state('login', {
      url : '/login',
      templateUrl : 'OpenQollo_1_login.html'
    });
    
  $urlRouterProvider.otherwise('/login');
});`;

  mvcControllers = `'use strict';

var entryControllers = angular.module('entryControllers', []);

// The module.controller method allows the creation of Angular controllers,
// which are bound to a specific view. This one is bound to the login page
// and intermediates actions between the view and the services (in this case,
// the AuthService).
entryControllers.controller('LoginCtrl', ['AuthService', '$scope', '$state',
  function(AuthService, $scope, $state) {
    // variables bound to the view
    $scope.user = {};
    $scope.errors = {};
    
    // function bound to the button click on the view
    $scope.login = function() {
      $scope.errors = {};
      
      AuthService.login($scope.user).then(
        function(data) {
          var successInfo = data["success"];
          var errorInfo = data["errors"];
          
          if (successInfo != null) {
            // We'll talk about this later
            window.localStorage.setItem("userId", successInfo["userId"]);
            
            $state.go('app');
          }
          else if (errorInfo != null) {
            $scope.errors = errorInfo;
          }
          else {
            $scope.errors["server"] = "The server failed to log you in. Please retry.";
          }
        },
        function(error) {
          $scope.errors["server"] = "The server failed to log you in. Please retry.";
        }
      );
    };
}]);`;

  mvcServices = `// Angular has all sorts of built-in services, but if you really want powerful 
// business logic, you'll define your own via the module.factory method. Here, 
// we create an AuthService and inject other service dependencies ($http and $q).
entryApp.factory('AuthService', function($http, $q) {
  var login = function(user) {
    // $q allows you to run asynchronous functions and handle the results
    // when they are done processing
    var deferred = $q.defer();

    // $http is a simple service for HTTP communication
    $http({
      method  : 'POST',
      url     : 'http://qollo.alanbuttars.com/server/rest/login.php',
      data    : user,
      headers : { 'content-type':'application/json' }
    })
    .success(function(data) {
      console.log("login success: ", JSON.stringify(data));
      deferred.resolve(data);
    })
    .error(function(error) {
      console.log("login error: ", JSON.stringify(error));
      deferred.reject(error);
    });
    
    return deferred.promise;
  };
  
  return {
    login: login,
  }

});`;

}
