$(function() {
  var Asteroids = (function() {
    // the update function; gets called every tick.
    var updateInterval;
    // Draw the board.
    var drawInterval;
    var ship;

    var redrawCanvas = (function () {
      var canvas = document.getElementById("asteroids");
      var context = canvas.getContext("2d");
      function drawShip(ship) {
        context.strokeStyle = "#000";
        context.moveTo(ship.x + 10 * Math.sin(ship.theta),               ship.y + 10 * Math.cos(ship.theta));
        context.lineTo(ship.x +  5 * Math.sin(ship.theta + 2*Math.PI/3), ship.y +  5 * Math.cos(ship.theta + 2*Math.PI/3));
        context.lineTo(ship.x +  5 * Math.sin(ship.theta + 4*Math.PI/3), ship.y +  5 * Math.cos(ship.theta + 4*Math.PI/3));
        context.lineTo(ship.x + 10 * Math.sin(ship.theta),               ship.y + 10 * Math.cos(ship.theta));
        
        context.stroke();
      }
      return (function() {
        // clear board
        canvas.width += 0;
        // Draw gamestate
        drawShip(ship);
      });
    })();
    
    //Keyboard Manager
    var keyboard = (function() {
      var keyStates = {}
      
      function keyDownListener(e) {
        console.log("Got keydown");
        
        if (e.keyCode == 39) {        // right
          keyStates.right = true
        } else if (e.keyCode == 37) { // left
          keyStates.left = true
        } else if (e.keyCode == 38) { // up
          keyStates.up = true
        } else if (e.keyCode == 40) { // down
          keyStates.down = true
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
        } else {
          return true;
        }
        return false;
      }
      
      return {
         keyDownListener: keyDownListener,
         keyUpListener: keyUpListener,
        isPressed: keyStates
      }
    })();
    
    
    
    function tick() {
      if (keyboard.isPressed.right) {
        ship.theta += 0.01;
      } 
      if (keyboard.isPressed.left) {
        ship.theta -= 0.01;
      }
    }
  
    function init(selector) {
      
      ship = {
        x: 50,
        y: 50,
        theta: 0
      }
      
      drawInterval = setInterval(redrawCanvas, 1);
      updateInterval = setInterval(tick, 5);
      $(selector).keydown(keyboard.keyDownListener);
      $(selector).keyup(keyboard.keyUpListener);
      
    }
    return {
      init: init
    }
  })();
  Asteroids.init('body');
})