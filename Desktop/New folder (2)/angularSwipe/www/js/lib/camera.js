var HHCamera = {
  takePicture : function(questionNumber){
    if(!navigator.camera) {
      alert("Camera API is not supported", "Error");
      return;
    }
    var cameraOptions = {
      destinationType: 0,
      quality: 75,
      sourceType: 1,
      encodingType: 0,
      targetWidth: 1000,
      targetHeight: 625
    };

    var cameraSuccess = function(imageData){  
      var storageName = questionNumber + 'ImageArray'
      if(sessionStorage.getItem(storageName) === null){
        sessionStorage.setItem(storageName, '[]');
      }

      var imageArray = JSON.parse(sessionStorage.getItem(storageName));
      var imageString = "data:image/jpeg;base64," + imageData;
      var imageAreaID = questionNumber + "-image-area";
      var newImageTag = "<img src=" + imageString + " class='question-image'/>";
      var current = document.getElementById(imageAreaID).innerHTML;
      imageArray.push(imageString);
      sessionStorage.setItem(storageName, JSON.stringify(imageArray));
      document.getElementById(imageAreaID).innerHTML = current + newImageTag;
    };

    var cameraFailure = function(){
      alert("Error taking picture",  "Error");
    };
    navigator.camera.getPicture(cameraSuccess, cameraFailure, cameraOptions);
    return false;
  },
  addImageToPage : function(questionNumber, imageString){
    var imageAreaID = questionNumber + "-image-area";
    var newImageTag = "<img src=" + imageString + " class='question-image'/>";
    var current = document.getElementById(imageAreaID).innerHTML;
    document.getElementById(imageAreaID).innerHTML = current + newImageTag;
  },
  loadImages : function(questionNumber){
    var imageArray = JSON.parse(sessionStorage.getItem(questionNumber + "ImageArray"));
    if(imageArray){
      for(index in imageArray){
        this.addImageToPage(questionNumber, imageArray[index]);
      }
    }
  }

};
