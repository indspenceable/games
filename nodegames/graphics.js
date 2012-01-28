var initializeGraphics = function(callback) {
  var canvas = document.getElementById("metroidvania");
  var context = canvas.getContext("2d");
  
  assetLoader(['tiles.png'], function(assets) {
    var drawTile = function(x,y,tx,ty) {
      // given x and y in pixels, and tilex and tiley in location on the tilesheet
      
      // TODO - make asset loader generalize to allow 
      // customization of these hardcoded numbers with 
      // additional arguments
      var pixelOffsetX = tx*17;
      var pixelOffsetY = ty*17;
      context.drawImage(assets['tiles.png'],pixelOffsetX,pixelOffsetY, 16, 16, x, y, 16, 16);
    }
    var drawCenteredTile = function(x,y,tx,ty) {
      drawTile(x*16, y*16, tx, ty)
    }
    var drawTileByName = function(x, y, tileName) {
      if (tileName == 'floor') {
        drawCenteredTile(x,y,2,2)
      } else if (tileName == 'wall') {
        drawCenteredTile(x,y,0,2)
      }
    }
    var redraw = function(scene) {
      // Scene rendering logic goes here.
      for (var i = 0; i < scene.length; i++) {
        for (var j = 0; j < scene[i].length; j++) {
          drawTileByName(i,j,scene[i][j])
        }
      }
    }
    callback(redraw);
  });
};