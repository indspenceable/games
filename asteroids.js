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
    
    function tick() {
      ship.theta += 0.01;
    }
  
    (function init() {
      ship = {
        x: 50,
        y: 50,
        theta: 0
      }
      
      drawInterval = setInterval(redrawCanvas, 1);
      updateInterval = setInterval(tick, 5);
    })()
  })()
})