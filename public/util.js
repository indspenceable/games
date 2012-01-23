var repeat = function(i, callback) {
  for (var j = 0; j < i; j++) {
    callback(j);
  }
}
var rand = function(i) {
  return Math.floor(Math.random()*i);
}
