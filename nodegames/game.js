var game = (function() {

  var board = []
  colors = {
    dirt: '#864',
    rock: '#333'
  }
  for (var a = 0; a+1 < 500/16; a++) {
    var c = [];
    for (var b = 0; b+1 < 500/16; b++ ) {
      if (Math.random()*2 > 1) {
        c.push('dirt');
      } else {
         c.push('rock');
      }
    }
    board.push(c);
  }
  
  var Player = (function() {
    this.x = 0;
    this.y = 0;
    this.down = function() { this.y += 1 }
    this.up = function() { this.y -= 1 }
    this.left = function() { this.x -= 1 }
    this.right = function() { this.x += 1 }
  })
  var player = new Player;
  
  var x = 0; y = 0;
  
  var keyboard = (function() {
    console.log("hi");
    var keyStates = {}
    
    // TODO so ugly!
    function keyDownListener(e) {
      if (e.keyCode == 39) {        // right
        keyStates.right = true
        player.right();
      } else if (e.keyCode == 37) { // left
        keyStates.left = true
        player.left();
      } else if (e.keyCode == 38) { // up
        keyStates.up = true
        player.up();
      } else if (e.keyCode == 40) { // down
        keyStates.down = true
        player.down();
      } else if (e.keyCode == 32) { // space
        keyStates.space = true
      } else if (e.keyCode == 90) { // z
        keyStates.z = true
      } else {
        return true;
      }
      return false;
    }
    function keyUpListener(e) {
      if (e.keyCode == 39) {        // right
        keyStates.right = false
      } else if (e.keyCode == 37) { // left
        keyStates.left = false
      } else if (e.keyCode == 38) { // up
        keyStates.up = false
      } else if (e.keyCode == 40) { // down
        keyStates.down = false
      } else if (e.keyCode == 32) { // space
        keyStates.space = false
      } else if (e.keyCode == 90) { // z
        keyStates.z = false
      } else {
        return true;
      }
      return false;
    }
    
    return {
       keyDownListener: keyDownListener,
       keyUpListener: keyUpListener,
       keys: keyStates
    }
  })();
  
  var graphics = (function(selector) {
    var canvas = $(selector)[0];
    var context = canvas.getContext("2d");
    var drawTile = function(x,y, color) {
      context.fillStyle = color
      context.fillRect(x*16,y*16,16,16);
    }
    var redraw = function(scene) {
      canvas.width = 16 * board.length;
      canvas.height = 16 * board[0].length
      for (var a = 0; a < scene.length; a++) {
        for (var b = 0; b < scene[a].length; b++ ) {
          drawTile(a,b,colors[scene[a][b]])
        }
      }
      drawTile(player.x,player.y,'rgba(255, 100, 100, 0.5)')
    }
    return {
      redraw: redraw
    }
  }); // this will get called explicitly later.
  
  var socket;
  (function() {
    socket = io.connect();
    socket.on('connect', function() {

     })
     socket.on('disconnect', function() {

     })
     socket.on
     socket.on('reconecting', function() {
       console.log("Trying to reconnect.")
     })
     socket.on('reconnect', function() {
       console.log("Re-established connection.")
     })
     socket.on('reconnect_failed', function() {
       console.log("Unable to reconnect.")
     })
  })


  var tick = function() {
    console.log('tick');
    graphics.redraw(board)
  }

  var init = (function() {
    var updateServer = function() {
      tick();
      await();
    }
    var await = function() {
      setTimeout(updateServer, 0);
    }
    await();
  })
  
  return {
    init: function(selector) {
      
      $('body').keydown(keyboard.keyDownListener);
      $('body').keyup(keyboard.keyUpListener);
      graphics = graphics(selector);
      init();
    }
  }
})();
$(function() {  
  game.init('#canvas');
})