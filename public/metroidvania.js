$(function() {
  initializeGraphics(function(render) {
    level = []
    repeat(10, function() {
      var current = []
      repeat(10, function() {
        switch(rand(5)) {
        case 0:
        case 1:
        case 2:
          current.push('floor');
          break;
        case 3:
          current.push('air');
        case 4:
          current.push('wall');
        }
      })
      level.push(current);
    });
    render(level);
  });
});