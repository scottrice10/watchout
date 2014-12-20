// start slingin' some d3 here.
//
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var createEnemies = function() {
  var empty = Array.apply(null, Array(gameOptions.nEnemies));
  return empty.map(function(value, i) {
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  });
};

var gameBoard = d3.select('body').append('div')
  .attr('class', 'game-board')
  .style("height", gameOptions.height + "px")
  .style("background-color", "gray")
  .style({
    'width': gameOptions.width + 'px'
  });

var moveEnemies = function() {
  var empty = createEnemies();
  var enemies = gameBoard.selectAll('div').data(empty, function(d) {
    return d.id;
  });

  enemies.enter().append("div")
    .style("background-image", "url('asteroid.png')")
    .attr('class', 'enemy');

  enemies.style('top', function(enemy){
      return Math.random() * (gameOptions.height - 35) + 'px'
    })
    .style('left', function(enemy){
      return Math.random() * (gameOptions.width - 35) + 'px'
    })
    .on("mouseover", function() {
      onCollision();
    })
    .transition().duration(500)
    .transition().duration(2000)
    .tween('custom', tweenWithCollisionDetection);

  enemies.exit().remove()
};

var checkCollision = function(enemy, collidedCallback) {
  //   var radiusSum = parseFloat(enemy.style('width')) / 2;
  //   // var xDiff = parseFloat(enemy.style('left')) - player[0];
  //   // var yDiff = parseFloat(enemy.style('top')) - player[1];
  //   var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  //   // console.log("xDiff:" + xDiff);
  //   return function() {
  //     if (separation < radiusSum) {
  //       console.log(separation);
  //       return collidedCallback();
  //     }
  //   };
};

var onCollision = function() {
  d3.select('.game-board').style('background-color', 'red');

  setTimeout(function() {
    d3.select('.game-board').style('background-color', 'gray');
  }, 500);

  updateBestScore();
  gameStats.score = 0;
  return updateScore();
};

var updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  return d3.select('#high').text(gameStats.bestScore.toString());
};

var updateScore = function() {
  return d3.select('#current').text(gameStats.score.toString());
};

var increaseScore = function() {
  gameStats.score += 1;
  return updateScore();
};
setInterval(increaseScore, 50);

var tweenWithCollisionDetection = function(endData) {
  var enemy = d3.select(this);
  var startPos = {
    left: parseFloat(enemy.style('left')),
    top: parseFloat(enemy.style('top'))
  };
  var endPos = {
    left: Math.random() * (gameOptions.width - 35),
    top: Math.random() * (gameOptions.height - 35)
  };
  return function(t) {
    checkCollision(enemy, onCollision);
    var enemyNextPos = {
      left: startPos.left + (endPos.left - startPos.left) * t,
      top: startPos.top + (endPos.top - startPos.top) * t
    };
    return enemy.style('left', enemyNextPos.left + 'px').style('top', enemyNextPos.top + 'px');
  };
};

setInterval(function() {
  moveEnemies();
}, 2000);
