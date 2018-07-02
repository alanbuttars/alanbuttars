import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-blog-post-8',
  templateUrl: './post8.component.html',
})
export class BlogPost8Component {

  ngAfterViewInit() {
    $(".ui.sticky.page.navigation").sticky({
      context: "#blog"
    });
  }

  download = `<?php
require_once (__DIR__ . '/../auth/auth-filter.php');
require_once (__DIR__ . '/../images/images.php');

// define a directory outside the webroot where image files will be written
define('TMP_DIR', __DIR__ . '/../../../../tmp/');

$imageId = $_GET["imageId"];
/* 1. Get the stored base64 image and decode it */
$encodedImage = getImage($userId, $imageId);
$decodedImage = base64_decode($encodedImage);

/* 2. Write the file to a temporary file */
$filename = TMP_DIR . uniqid($userId . "_") . ".jpg";
$filehandle = fopen($filename, 'w');
fwrite($filehandle, $decodedImage);

/* 3. Read the file to a stream */
header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
header("Cache-Control: public"); // needed for i.e.
header("Content-Type: image/jpeg");
header("Content-Transfer-Encoding: Binary");
header("Content-Length:".filesize($filename));
header("Content-Disposition: attachment; filename=" . basename($filename));
readfile($filename);

die();        

?>`;

  transfer = `var getImage = function(imageId) {
  var deferred = $q.defer();
  
  var remotePath = encodeURI("http://qollo.alanbuttars.com/server/rest/image-download.php?imageId=" + imageId);
  var localPath = imageId + ".jpg";
  
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    function(fileSystem) {
      fileSystem.root.getFile(
        localPath,
        {create : true, exclusive : false},
        function(fileEntry) {
          /* 1. Attempt to grab the file locally, if it exists */
          var getLocalFile = function(localFilePath) {
            console.log("[INFO] getImage(" + imageId + ") local attempt");
            var reader = new FileReader();
            reader.onloadend = function(event) {
              if (exists(event)) {
                if (exists(event.target)) {
                  if (exists(event.target.result)) {
                    if (event.target.result != "data:image/jpeg;base64,") {
                      console.log("[SUCCESS] getImage(" + imageId + ") local success");
                      deferred.resolve(event.target.result);
                      return;
                    }
                  }
                }
              }
              console.log("[ERROR] getImage(" + imageId + ") local failed");
              getRemoteFile();
            };
            reader.readAsDataURL(localFilePath);
          };

          /* 2. If the file doesn't exist locally, download it from the remote server */
          var getRemoteFile = function() {
            log("[INFO] getImage(" + imageId + ") remote attempt");
            var localPathUrl = fileEntry.toURL();
            if (device.platform === "Android" && localPathUrl.indexOf("file://") === 0) {
              localPathUrl = localPath.substring(7);
            }
            
            // attach your headers/authentication here
            var options = {
              header: getHttpHeaders()
            };
            
            var fileTransfer = new FileTransfer();
            fileTransfer.download(
              remotePath,
              localPathUrl,
              function(entry) {
                log("[SUCCESS] getImage(" + imageId + ") remote success");
                getLocalFile(localPath);
              },
              function(error) {
                log("[ERROR] getImage(" + imageId + ") remote failed");
                deferred.reject(error);
              },
              false, options);
            };
            
            var getFileError = function(error) {
              console.log("[ERROR] getImage(" + imageId + ") " + JSON.stringify(error));
              deferred.reject(error);
            };
            
            fileEntry.file(getLocalFile, getRemoteFile, getFileError);
          }
        );
      }
    );
    
    return deferred.promise;
}`;
}
