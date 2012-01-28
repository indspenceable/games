// Asset loader is a funciton that takes a list of file names,
// and a callback. It loads up an asset object, and fires off
// the callback with that
var assetLoader = (function() {
  var fileStatus = []
  var allImagesReadyCallback;
  var assets = {}

  var imageReady = function(index) {
    fileStatus[index] = true
    for (var i = 0; i < fileStatus.length; i++) {
      if (fileStatus[i] == false) {
        return false;
      }
    }
    allImagesReadyCallback(assets);
  }
  var loadFile = function(fileName) {
    var img = new Image();
    img.src = fileName;
    assets[fileName] = img;
    
    var index = fileStatus.length;
    fileStatus.push(false);
    img.onload = function() {
      imageReady(index);
    }
  }
  
  return function(filesToLoad, callback) {
    allImagesReadyCallback = callback;
    var l = filesToLoad.length;
    fileStatus.push(false)
    for (var i = 0; i < l; i++) {
      currentFile = filesToLoad[i];
      loadFile(currentFile);
    }
    imageReady(0);
  }
})();
