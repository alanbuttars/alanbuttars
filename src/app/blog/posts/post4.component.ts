import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-blog-post-4',
  templateUrl: './post4.component.html',
})
export class BlogPost4Component {

  ngAfterViewInit() {
    $(".ui.sticky.page.navigation").sticky({
      context: "#blog"
    });
  }

  includePhp = `<html>
  <body>
    <div id="header"></div>
    <div>
      <h1>I am some content.</h1>
    </div>
  <div id="footer"></div>
  </body>
  
  <script type="text/javascript">
    $("#header").load('templates/header.html');
    $("#footer").load('templates/footer.html');
  </script>
</html>`;

  includeJavascript = `<html>
  <body>
    <?php include('templates/header.html'); ?>
    <h1>I am some content.</h1>
    <?php include('templates/footer.html'); ?>
  </body>
</html>`;

  index = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title>OpenQollo</title>
  </head>
  <body>
    <!-- The ui-view attribute serves as the placeholder for other templates -->
    <div ui-view></div>

    <!-- cordova.js only needed if this is a PhoneGap app -->
    <script src="cordova.js"></script>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="js/app.js"></script>
    <script src="js/controllers.js"></script>
    <script src="js/services.js"></script>
    <script src="js/interceptors.js"></script>
    <script type="text/javascript" charset="utf-8">
      // When the Cordova API has loaded, a 'deviceready' event is thrown.
      document.addEventListener("deviceready", onDeviceReady, false);
      
      // When we hear this event, we will bootstrap the body with the qolloApp
      // module. If we try to do this beforehand (i.e., <body ng-app='qolloApp'>),
      // we run the risk of calling the Cordova API before it has loaded.
      function onDeviceReady() {
        angular.bootstrap(document.body, ['qolloApp']);
      }
      
      // If you want to just deploy this as a web application, remove the above
      // lines and uncomment out the below line:
      // angular.bootstrap(document.body, ['qolloApp']);
    </script>
  </body>
</html>`;

  app = `'use strict';

var qolloApp = angular.module('qolloApp', [ 'ui.router', 'qolloControllers' ]);

qolloApp.config(function($stateProvider, $urlRouterProvider) {

  /**
   * Notate your states with $stateProvider.state(name, stateConfig). When a
   * user hits the given $state URL, $stateProvider automatically loads the
   * given templateUrl into the <div ui-view> placeholder. We can also specify
   * a controller for that $state.
   */
  $stateProvider.state('splash', {
    url : '/splash',
    templateUrl : 'templates/splash.html',
    controller : 'SplashCtrl'
  }).state('login', {
    url : '/login',
    templateUrl : 'templates/login.html',
    controller : 'LoginCtrl'
  }).state('register', {
    url : '/register',
    templateUrl : 'templates/register.html',
    controller : 'RegisterCtrl'
  });
  
  /**
   * For any other URL, we redirect using $urlRouterProvider.otherwise(rule).
   * e.g. If someone tries to access http://domain.com/#/blah, they will be redirected
   * to http://domain.com/#/splash
   */
  $urlRouterProvider.otherwise('/splash');

});`;

  appNested = `'use strict';

var qolloApp = angular.module('qolloApp', [ 'ui.router', 'qolloControllers' ]);

qolloApp.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    // PageType1 parent state
    .state('app', {
      // an empty URL. If a user hits this, they will simply see the
      // header, so you may want to add your own redirection logic
      url : '/app',
      // contains the PageType1 header HTML
      templateUrl : 'templates/app.html',
      // notice that this state doesn't have a controller because
      // it doesn't need one (no data or actions exist in the app HTML
      // that can't already be taken care of by UI Router)
    })
    // PageType1 child state
    .state('app.notifications', {
      // located at http://domain.com/#/app/notifications
      url : '/notifications',
      // contains <h1>I am the notifications view</h1>
      templateUrl : 'templates/app-notifications.html'
    })
    // PageType1 child state
    .state('app.friends', {
      // located at http://domain.com/#/app/friends
      url : '/friends',
      // contains <h1>I am the friends view</h1>
      templateUrl : 'templates/app-friends.html'
    })
    
    // PageType2 parent state
    .state('menu', {
      url : '/menu',
      // contains the PageType2 header HTML
      templateUrl : 'templates/menu.html',
      controller : 'MenuCtrl'
    }).state('menu.profile', {
      url : '/profile',
      templateUrl : 'templates/menu-profile.html',
      controller : 'ProfileCtrl',
      title : 'Profile',
      icon : 'fi-torso'
    }).state('menu.account', {
      url : '/account',
      templateUrl : 'templates/menu-account.html',
      title : 'Account',
      icon : 'fi-widget'
    }).state('menu.info', {
      url : '/info',
      templateUrl : 'templates/menu-info.html',
      title : 'Info',
      icon : 'fi-info'
    })

});

var qolloControllers = angular.module('qolloControllers', []);

// For the sake of being thorough, the MenuCtrl shows how we can access
// config properties from the current $state
qolloControllers.controller('MenuCtrl', [ 'AuthService', '$scope', '$state', 
  '$window', function(AuthService, $scope, $state, $window) {
  
  $scope.getCurrentState = function() {
    return $state.current.title;
  };
  
  $scope.getCurrentStateIcon = function() {
    return $state.current.icon;
  };
  
  $scope.goBack = function() {
    $window.history.back();
  };
} ]);`;

    appHtml = `<!-- app.html -->
<nav class="tab-bar">
  <div class="left">
    <div class="logo logo-top">
      <span>Open</span>
      <span>Qollo</span>
    </div>
  </div>
  <div class="right">
    <div class="icon-bar four-up">
      <!-- 
        ui-sref => generates an href tag to a different $state
        ui-sref-active => adds the specified class to the element if 
        current $state matches the ui-sref attribute
      -->
      <a class="item" ui-sref="app.notifications" ui-sref-active="active">
        <i class="fi-results"></i>
      </a>
      <a class="item" ui-sref="camera">
        <i class="fi-camera"></i>
      </a>
      <a class="item" ui-sref="app.friends" ui-sref-active="active">
        <i class="fi-torsos-all"></i>
      </a>
      <a class="item right-off-canvas-toggle">
        <i class="fi-list"></i>
      </a>
    </div>
  </div>
</nav>

<div ui-view></div>`;

  menu = `<!-- menu.html -->
<nav class="tab-bar">
  <div class="left">
    <div class="qollo-menu">
      <div class="qollo-menu-bookmark">
        <i class="fi-bookmark"></i>
      </div>
      <div class="qollo-menu-icon">
        <i class="{{getCurrentStateIcon()}}"></i>
      </div>
      <h1 class="logo">{{getCurrentState()}}</h1>
    </div>
  </div>
  <div class="right">
    <div class="icon-bar one-up">
      <a class="item" ng-click="goBack()">Back</a>
    </div>
  </div>
</nav>

<div ui-view></div>`;
}
