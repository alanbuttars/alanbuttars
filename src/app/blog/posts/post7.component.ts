import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-blog-post-7',
  templateUrl: './post7.component.html',
})
export class BlogPost7Component {

  ngAfterViewInit() {
    $(".ui.sticky.page.navigation").sticky({
      context: "#blog"
    });
  }

  cameraView = `<!DOCTYPE html>
<html>
  <body>
    <div>
      <div ng-controller="ImageCtrl">
        <img ng-show="image" ng-src="{{image}}" />
        <button ng-click="goToCamera()">Camera</button>
        <button ng-click="goToAlbum()">Album</button>
      </div>
    </div>
    
    <script src="https://code.angularjs.org/1.3.5/angular.js"></script>
    <script src="http://alanbuttars.com/docs/OpenQollo_6_controller.js"></script>
    <script src="http://alanbuttars.com/docs/OpenQollo_6_model.js"></script>
    <script type="text/javascript">
      angular.bootstrap(document.body, ['demo']);
    </script>
  </body>
</html>`;

  cameraController = `/* 1. Create the app module */
var demo = angular.module('demo', ['controllers']);

/* 2. White-list the content and file protocols so that Android doesn't block your images */
demo.config(function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file):/);
});

/* 3. Create your controllers module */
var controllers = angular.module('controllers', []);

/* 4. Add an ImageCtrl to allow users to request the camera and photo album */
controllers.controller('ImageCtrl', function($scope, ImageService) {
  $scope.image = null;
  
  $scope.goToCamera = function() {
    ImageService.getCamera().then(
      function(imageUri) {
        $scope.image = imageUri;
      },
      function(error) {
        console.log("A camera error occurred: " + error);
      }
    );
  };

  $scope.goToAlbum = function() {
    ImageService.getAlbum().then(
      function(imageUrl) {
        $scope.image = imageUrl;
      },
      function(error) {
        console.log("An album error occurred: " + error);
      }
    );
  };
});`;

  cameraModel = `demo.factory('ImageService', function() {
  
/**
 * Opens the local device's camera, then returns the URI.
 */
var getCamera = function() {
  var deferred = $q.defer();
  
  var cameraOptions = {
    sourceType : Camera.PictureSourceType.CAMERA,
    destinationType : Camera.DestinationType.FILE_URI,
    encodingType: Camera.EncodingType.JPEG,
    allowEdit : false,
    saveToPhotoAlbum : false,
    quality: 25
  };

  navigator.camera.getPicture(
    function(imageUri) {
      deferred.resolve(imageUri);
    },
    function(message) {
      deferred.reject(message);
    },
    cameraOptions);

    return deferred.promise;
  };

  /**
   * Opens the local device's photo library, then returns the URL
   */
  var getAlbum = function() {
    var deferred = $q.defer();

    var albumOptions = {
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType : Camera.DestinationType.FILE_URL,
      encodingType: Camera.EncodingType.JPEG,
      allowEdit : false,
      saveToPhotoAlbum : false,
      quality: 25,
      mediaType : Camera.MediaType.ALLMEDIA
    };
    
    navigator.camera.getPicture(
      function(imageUri) {
        deferred.resolve(imageUri);
      },
      function(message) {
        deferred.reject(message);
      },
      albumOptions);
      
    return deferred.promise;
  };
	
  return {
    getCamera : getCamera,
    getAlbum : getAlbum
  };
});`;

  sendImage = `/**
 * Sends the currently-stored image to the given user IDs in REST.
 */
var sendImage = function(userIds) {
  var deferred = $q.defer();
  
  /* 1. Specify your upload options */
  var options = {
    fileKey : 'file',
    fileName : 'file.jpg',
    mimeType : 'image/jpeg',
    chunkedMode : false,
    params : {
      // add some other params if the situation calls for it
      'userIds' : [1, 2, 3, 4]
    },
    headers : {
      // add some headers for authentication (see PhoneGap Part 2)
      'Tokenpublic' : tokenPublic,
      'Hash' : hash,
      'Timestamp' : timestamp
    }
  }
  
  var fileTransfer = new FileTransfer();
  
  fileTransfer.upload(
    image,
    "http://qollo.alanbuttars.com/server/rest/image-upload.php",
    function(data) {
      if (exists(data.response)) {
        var response = JSON.parse(data.response);
        deferred.resolve(response);
      }
      else {
        deferred.reject(data);
      }
    },
    function(error) {
      deferred.reject(error);
    },
    options
  );

  return deferred.promise;
};
`;

  uploadImage = `<?php
// retrieve the image from the request and open it
$image = $_FILES["file"];
$imageName = $image["tmp_name"];
$imageSize = filesize($imageName);
$imageFile = fopen($imageName, "r");
$imageBinary = fread($imageFile, $imageSize);

$encodedImage = base64_encode($imageBinary);

// do something with the encoded image, like store it in a database or in a file

echo json_encode(
  array(
    "success" => true
  )
);

?>`;
}
