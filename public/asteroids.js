$(function() {
  var Asteroids = (function() {
    // the update function; gets called every tick.
    var updateInterval;
    // Draw the board.
    var drawInterval;
    var ship;

    var graphics = (function () {
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
      function redraw () {
        // clear board
        canvas.width += 0;
        // Draw gamestate
        drawShip(ship);
      };
      
      return {
        redraw: redraw
      }
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
         keys: keyStates
      }
    })();


    // #TODO this should live in the ship obejct. needs to be a real class :(
    function addVelocity(ship, amt) {
      ship.xVelocity += amt * Math.sin(ship.theta)
      ship.yVelocity += amt * Math.cos(ship.theta)
    }
    
    function friction(ship, coefficient) {
      ship.xVelocity *= coefficient;
      ship.yVelocity *= coefficient;
    }
    
    function screenWrap(ship) {
      if (ship.x >= 500) {
        ship.x -= 500
      }
      if (ship.y >= 500) {
        ship.y -= 500
      }
      if (ship.x < 0) {
        ship.x += 500
      }
      if (ship.y < 0) {
        ship.y += 500
      }
    }
    
    function tick() {
      if (keyboard.keys.left) {
        ship.theta += 0.1;
      } 
      if (keyboard.keys.right) {
        ship.theta -= 0.1;
      }
      
      if (keyboard.keys.up) {
        addVelocity(ship,0.3)
      }
      
      ship.x += ship.xVelocity
      ship.y += ship.yVelocity
      
      screenWrap(ship)
      friction(ship, 0.98);
    }
  
    function init(selector) {
      ship = {
        x: 50,
        y: 50,
        xVelocity: 0,
        yVelocity: 0,
        theta: 0
      }
      
      drawInterval = setInterval(graphics.redraw, 10);
      updateInterval = setInterval(tick, 10);
      $(selector).keydown(keyboard.keyDownListener);
      $(selector).keyup(keyboard.keyUpListener);
      
    }
    return {
      init: init
    }
  })();
  Asteroids.init('body');
})