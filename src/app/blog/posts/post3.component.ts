import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-blog-post-3',
  templateUrl: './post3.component.html',
})
export class BlogPost3Component {

  ngAfterViewInit() {
    $(".ui.sticky.page.navigation").sticky({
      context: "#blog"
    });
  }

  loginController = `qolloControllers.controller('LoginCtrl', ['AuthService', '$scope', '$state',
  function(AuthService, $scope, $state) {
    $scope.emailError = "";
    $scope.passwordError = "";
    $scope.otherError = "";
    
    $scope.login = function(user) {
      $scope.clearVariables();
      AuthService.login(user).then(
        function(data) {
          var successInfo = data["success"];
          var errorInfo = data["errors"];
          
          if (successInfo != null) {
            window.localStorage.setItem("tokenPublic", successInfo["tokenPublic"]);
            window.localStorage.setItem("tokenPrivate", successInfo["tokenPrivate"]);
            
            $state.go('app');
          }
          else if (errorInfo != null) {
            $scope.emailError = errorInfo["email"];
            $scope.passwordError = errorInfo["password"];
            $scope.otherError = errorInfo["other"];
          }
          else {
            $scope.otherError = "The server failed to log you in. Please retry.";
          }
        },
        function(error) {
          $scope.otherError = "The server failed to log you in. Please retry.";
        }
      );
    };
    
    $scope.clearVariables = function() {
      $scope.emailError = "";
      $scope.passwordError = "";
      $scope.otherError = "";
    };

}]);`;

  interceptor = `// create the interceptor
qolloApp.factory('qolloInterceptor', ['$rootScope', '$injector',
  function($rootScope, $injector) {

    var request = function($config) {
    // get the tokens from local storage
    var tokenPublic = window.localStorage.getItem('tokenPublic');
    var tokenPrivate = window.localStorage.getItem('tokenPrivate');
    // get the UTC timestamp
    var timestamp = Date.now();
    // generate the SHA-256 hash
    var hash = CryptoJS.SHA256(tokenPrivate + "" + timestamp).toString(CryptoJS.enc.Base64);

    // set the request headers
    $config.headers['Tokenpublic'] = tokenPublic;
    $config.headers['Hash'] = hash;
    $config.headers['Timestamp'] = timestamp;

    return $config;
  };

  var response = function(response) {
    if (response["filter"] != null) {
      // if the filter failed the request, we redirect to the login page
      console.log("Filter denied the request: ", JSON.stringify(response["filter"]));
      $injector.get('$state').go('login');
    }
    return response;
  }

  return {
    request : request,
    response : response
  };
}]);

// register the interceptor
qolloApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('qolloInterceptor');
}]);`;

  authenticateRest = `/**
 * Authenticates the current headers for this request.
 */
function authenticateRest() {
  $dateFormat = "m/j/Y H:i:s:u";
  
  // gather the headers
  $headers = getallheaders();
  $sentPublicToken = sanitizeObjectVar($headers, 'Tokenpublic', "");
  $sentHash = sanitizeObjectVar($headers, 'Hash', "");
  $sentTime = sanitizeObjectVar($headers, 'Timestamp', 0);
  
  // convert the sent timestamp from UTC => GMT
  $sentTimestamp = DateTime::createFromFormat($dateFormat, gmdate($dateFormat, ceil($sentTime / 1000.0))) -> getTimestamp();
  // convert the current timestamp from the server timezone => GMT (generously subtract 5 seconds to account for internal server clock issues)
  $currentTimestamp = DateTime::createFromFormat($dateFormat, gmdate($dateFormat)) -> getTimestamp() - 5;
  
  $response = array();
  if ($sentTimestamp >= $currentTimestamp) {

    // set the expiration timestamp to the current timestamp + 60 seconds
    $expirationTimestamp = $currentTimestamp + 60;
    if ($sentTimestamp <= $expirationTimestamp) {
      $expirationTime = date($dateFormat, $expirationTimestamp);
      
      // attempt to get the user info from the database by their public token
      $user = getUserByPublicToken($sentPublicToken);
      if ($user != null) {
        $privateToken = $user["tokenPrivate"];
        
        // replicate the client's SHA-256 hashing of the private token and timestamp
        $expectedHash = hash("sha256", "$privateToken$sentTime");
        if (strcasecmp($sentHash, $expectedHash) == 0) {
          $userId = $user["userId"];
          $response['success']['userId'] = $user["userId"];
        }
        else {
          $response['errors']['sentHash'] = "Sent hash $sentHash did not match expected hash $expectedHash.";
        }
      }
      else {
        $response['errors']['tokenPublic'] = "Sent public token $sentPublicToken did not correspond to a registered user.";
      }
    }
    else {
      $sentTime = date($dateFormat, $sentTimestamp);
      $expirationTime = date($dateFormat, $expirationTimestamp);
      
      $response['errors']['timestamp'] = "Sent timestamp $sentTime was past the expiration timestamp $expirationTime.";
    }
  }
  else {
    $sentTime = date($dateFormat, $sentTimestamp);
    $currentTime = date($dateFormat, $currentTimestamp);
    
    $response['errors']['timestamp'] = "Sent timestamp $sentTime was before the current timestamp $currentTime.";
  }
  return $response;
}

// if we pass authentication, we will set this ID to be used for subsequent action
$userId = null;

$authResult = authenticateRest();
if (isset($authResult['errors'])) {
  echo ")]}',\n" . json_encode(array("filter" => $authResult['errors']));
  exit;
}
else {
  $userId = $authResult['success']['userId'];
}

// continue with your REST logic;

}`;

}
