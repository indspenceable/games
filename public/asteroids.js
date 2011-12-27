$(function() {
  var Asteroids = (function() {
    // the update function; gets called every tick.
    var updateInterval;
    // Draw the board.
    var drawInterval;
    
    function Moveable() {
      this.move = function() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        this.screenWrap();
      }
      this.screenWrap = function () {
        if (this.x >= 500) {
          this.x -= 500
        }
        if (this.y >= 500) {
          this.y -= 500
        }
        if (this.x < 0) {
          this.x += 500
        }
        if (this.y < 0) {
          this.y += 500
        }
      }
    }
    
    function Bullet(ship) {
      this.x = ship.x;
      this.y = ship.y;
      this.xVelocity = Math.sin(ship.theta)*7;
      this.yVelocity = Math.cos(ship.theta)*7;
    }
    Bullet.prototype = new Moveable();
    
    
    function Asteroid() {
      
    }
    var asteroids = []
    var ship = new function() {
      this.x = 50;
      this.y = 50;
      this.xVelocity = 0;
      this.yVelocity = 0;
      this.theta = 0;
      this.readyToFire = true
      
      
      this.addVelocity = function(amt){
        this.xVelocity += amt * Math.sin(this.theta)
        this.yVelocity += amt * Math.cos(this.theta)
      }
      this.addFriction = function(coefficient) {
        this.xVelocity *= coefficient;
        this.yVelocity *= coefficient;
      }

      this.bullets = [];
      
      this.fire = function() {
        if (this.readyToFire) {

          var bullet = new Bullet(this);
          this.bullets.push(bullet);
          this.readyToFire = false
          
          var $ship = this;
          setTimeout(function() {
            $ship.readyToFire = true
          }, 200);
          setTimeout(function() {
            $ship.bullets.shift();
           }, 500)
        }
      }
    }
    ship.__proto__.__proto__ = new Moveable();

    // graphics manager
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
        for (var i = 0; i < ship.bullets.length; i ++) {
          drawBullet(ship.bullets[i]);
        }
      }
      function drawBullet(bullet) {
        context.strokeStyle = "#339";
        context.moveTo(bullet.x + 3, bullet.y)
        context.lineTo(bullet.x, bullet.y + 3)
        context.lineTo(bullet.x - 3, bullet.y)
        context.lineTo(bullet.x, bullet.y - 3)
        context.lineTo(bullet.x + 3, bullet.y)
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
      
      
      // TODO so ugly!
      function keyDownListener(e) {
        if (e.keyCode == 39) {        // right
          keyStates.right = true
        } else if (e.keyCode == 37) { // left
          keyStates.left = true
        } else if (e.keyCode == 38) { // up
          keyStates.up = true
        } else if (e.keyCode == 40) { // down
          keyStates.down = true
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
    
    function tick() {
      if (keyboard.keys.left) {
        ship.theta += 0.1;
      } 
      if (keyboard.keys.right) {
        ship.theta -= 0.1;
      }
      if (keyboard.keys.space) {
        ship.addVelocity(0.15)
      }
      if (keyboard.keys.z) {
        ship.fire();        
      }
      
      // ship.x += ship.xVelocity
      // ship.y += ship.yVelocity
      ship.move();
      
      ship.addFriction(0.97);
      
      
      for (var i = 0; i < ship.bullets.length; i ++) {
        var bullet = ship.bullets[i];
        bullet.move();
      }
    }
  
    function init(selector) {
      console.log("Ship is (in init): ", ship)
      drawInterval = setInterval(graphics.redraw, 10);
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