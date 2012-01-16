$(function() {
  var Asteroids = (function() {
    // the update function; gets called every tick.
    // Draws the board at the end.
    var updateInterval;
    var updateTime = 10
    var windowWidth = 500;
    var minAsteroidSize = 7
    
    Moveable = {
      move: function() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        this.screenWrap();
      },
      screenWrap: function () {
        this.x = (this.x+500) % 500
        this.y = (this.y+500) % 500
      },
      collidesWith: function(other, other_radius) {
        other_size = other_radius || other.size
        //console.log("Collision?", ((this.x - other.x)*(this.x - other.x) + (this.y - other.y)*(this.y - other.y) ), (this.size * this.size) + (other_size * other_size))
        return ((this.x - other.x)*(this.x - other.x) + (this.y - other.y)*(this.y - other.y) ) < (this.size * this.size) + (other_size * other_size);
      }
    }
    
    function Bullet(ship) {
      this.x = ship.x;
      this.y = ship.y;
      this.xVelocity = Math.sin(ship.theta)*7;
      this.yVelocity = Math.cos(ship.theta)*7;
      
    }
    Bullet.prototype = Moveable;
    
    
    function Asteroid(x,y,size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.collision = false;
      this.theta = Math.random()*Math.PI
      this.xVelocity = (Math.random()*2)-1;
      this.yVelocity = (Math.random()*2)-1;
    }
    Asteroid.prototype = Moveable;
    
    var stats;
    
    var asteroids;
    function Ship() {
      this.x = 50;
      this.y = 50;
      this.xVelocity = 0;
      this.yVelocity = 0;
      this.theta = 0;
      this.readyToFire = true
      this.alive = false
      
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
          bullet.timeout = setTimeout(function() {
            $ship.bullets.shift();
           }, 500)
        }
      }
    }
    Ship.prototype = Moveable
    var ship = new Ship;
    //ship.__proto__.__proto__ = Moveable;

    // graphics manager
    var graphics = (function () {
      var canvas = document.getElementById("asteroids");
      var context = canvas.getContext("2d");
      context.font = "bold 12px sans-serif";
      
      function drawShip(x,y,theta) {
        context.strokeStyle = "#000";
        context.moveTo(x + 10 * Math.sin(theta),               y + 10 * Math.cos(theta));
        context.lineTo(x +  5 * Math.sin(theta + 2*Math.PI/3), y +  5 * Math.cos(theta + 2*Math.PI/3));
        context.lineTo(x +  5 * Math.sin(theta + 4*Math.PI/3), y +  5 * Math.cos(theta + 4*Math.PI/3));
        context.lineTo(x + 10 * Math.sin(theta),               y + 10 * Math.cos(theta));
      }
      function drawBullet(bullet) {
        context.strokeStyle = "#339";
        context.moveTo(bullet.x + 3, bullet.y)
        context.lineTo(bullet.x, bullet.y + 3)
        context.lineTo(bullet.x - 3, bullet.y)
        context.lineTo(bullet.x, bullet.y - 3)
        context.lineTo(bullet.x + 3, bullet.y)
      }
      function drawAsteroidAt(x,y,theta,size) {
        context.moveTo(Math.random()*size*2 + x - size, Math.random()*size*2 + y - size)
        for (var i = 0; i< 20; i++) {
           context.lineTo(Math.random()*size*2 + x - size, Math.random()*size*2 + y - size)
        }
      }
      function redraw () {
        // clear board
        canvas.width += 0;
        // Draw gamestate
        
        if (ship.alive){
          context.beginPath();
          for (var a = -1; a <= 1; a++) {
            for (var b = -1; b <= 1; b++) {
              drawShip(ship.x + (a*windowWidth), ship.y + (b*windowWidth), ship.theta);
            }
          }
          context.stroke();
        }
        context.beginPath();
        for (var i = 0; i < ship.bullets.length; i ++) {
          drawBullet(ship.bullets[i]);
        }
        context.stroke();
        for (var i = 0; i < asteroids.length; i++) {
          context.beginPath();
          
          context.strokeStyle = "#975";
          
          drawAsteroidAt(asteroids[i].x, asteroids[i].y, asteroids[i].theta, asteroids[i].size);
          context.stroke();
          
        }
        
        // Draw Lives
        context.beginPath();
        for (var i = 0; i < stats.lives; i++) {
          drawShip(10 + 15*i, 15, Math.PI)
        }
        context.stroke();
        
        // Draw Score
        context.fillText("Score: " + stats.score, 5, 30);
        context.fillText("Level: " + stats.level, 5, 45);
        
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
      if (ship.alive) {
        if (keyboard.keys.left) {
          ship.theta += 0.1;
        } 
        if (keyboard.keys.right) {
          ship.theta -= 0.1;
        }
        if (keyboard.keys.up) {
          ship.addVelocity(0.15)
        }
        
        if (keyboard.keys.z) {
          ship.fire();        
        }
      } else if (stats.lives == 0) {
        if (keyboard.keys.space) {
          resetGame();
        }
      }
      // ship.x += ship.xVelocity
      // ship.y += ship.yVelocity
      ship.move();
      
      ship.addFriction(0.97);
      
      for (var i = 0; i < ship.bullets.length; i ++) {
        var bullet = ship.bullets[i];
        bullet.move();
      }
      for (var i = 0; i < asteroids.length; i++) {
        asteroids[i].move();
        asteroids[i].collision = false;
      }
      
      for (var i = 0; i < asteroids.length; i++) {
        var a1 = asteroids[i];
        var collided = false;
        for (var j = 0; j < ship.bullets.length; j++) {
          var b = ship.bullets[j];
          //Todo - factor this out
          if (((a1.x - b.x)*(a1.x - b.x) + (a1.y - b.y)*(a1.y - b.y)) < (a1.size * a1.size)) {
            collided = true;
            ship.bullets.splice(j,1);
            clearTimeout(b.timeout);
            break;
          }
        }
        if (collided == true) {
          if (a1.size > minAsteroidSize) {
              asteroids.push(new Asteroid(a1.x,a1.y,a1.size - 2));
              asteroids.push(new Asteroid(a1.x,a1.y,a1.size - 2));
              stats.score += stats.level
          } else {
            stats.score += (stats.level * 3)
          }
          asteroids.splice(i,1);
          // we killed the last asteroid! trigger next level
          if (asteroids.length == 0) {
            setTimeout(nextLevel, 5000)
          }
          continue;
        }
        
        // We don't care if asteroids collide with one another
        // for (var j = i+1; j < asteroids.length; j++) {
        //   var a2 = asteroids[j]
        //   // If these two are colliding, set collision on both to be TRUE.
        //   // Rather than taking sqrts, I'm squaring the other side of the equation. Should be a little faster.
        //   if (((a1.x - a2.x)*(a1.x - a2.x) + (a1.y - a2.y)*(a1.y - a2.y)) < (a1.size + a2.size)*(a1.size+a2.size)) {
        //     a1.collision = true
        //     a2.collision = true
        //   }
        // }
        
        if (a1.collidesWith(ship, 10) && ship.alive){
          ship.alive = false
          stats.lives -= 1;
          setTimeout(spawnShip, 5000);
        }
      }
      graphics.redraw();
    }
  
  
    function init(selector) {
      updateInterval = setInterval(tick, updateTime);
      $(selector).keydown(keyboard.keyDownListener);
      $(selector).keyup(keyboard.keyUpListener);
      asteroids = []
      resetGame();
    }
    function spawnShip() {
      if (stats.lives == 0) {
        return;
      }
      var legit;
      do {
        ship.x = Math.random()*500;
        ship.y = Math.random()*500;
        legit = true;
        for (var i = 0; i < asteroids.length; i++) {
          if (asteroids[i].collidesWith(ship, 50)) {
            legit = false;
          }
        }
      } while (legit == false);
      
      ship.alive = true
    }
    function nextLevel() {
      stats.level += 1
      for(var i = 0; i < stats.level + 4; i++) {
        asteroids.push(new Asteroid(Math.random()*500, Math.random()*500, 7+(Math.random()*5)));
      }
    }
    function resetGame() {
      // Set stats
      stats = {
        lives: 3,
        score: 0,
        level: 0
      }
      asteroids = []
      nextLevel()
      spawnShip();
    }
    return {
      init: init
    }
  })();
  Asteroids.init('body');
})