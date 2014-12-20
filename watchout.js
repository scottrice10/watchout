// start slingin' some d3 here.
//
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};
var gameBoard = d3.select('body').append('div')
  .attr('class', 'game-board')
  .style("height", gameOptions.height + "px")
  .style("background-color", "gray")
  .style({
    'width': gameOptions.width + 'px'
  });

for (var i = 0; i < gameOptions.nEnemies; i++) {
  d3.select('.game-board').append('div')
    .attr('class', 'enemy')
    .style('background-image', 'url(asteroid.png)')
    .style('top', Math.random() * (gameOptions.height - 35) + 'px')
    .style('left', Math.random() * (gameOptions.width - 35) + 'px');
}


var moveEnemies = function() {
  d3.selectAll('.enemy')
    .on("mouseover", function() {
      onCollision();
    })
    .on("mouseenter", function() {
      onCollision();
    })
    .on("mousemove", function() {
      onCollision();
    })
    .transition().duration(500)
    .transition().duration(2000)
    .tween('custom', tweenWithCollisionDetection);
}

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
  console.log("collided");
  // updateBestScore();
  // gameStats.score = 0;
  // return updateScore();
  d3.select('.game-board').style('background-color', 'red');

  setTimeout(function() {
    d3.select('.game-board').style('background-color', 'gray');
  }, 500);
};

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
    var enemyNextPos;
    checkCollision(enemy, onCollision);
    var enemyNextPos = {
      left: startPos.left + (endPos.left - startPos.left) * t,
      top: startPos.top + (endPos.top - startPos.top) * t
    };
    return enemy.style('left', enemyNextPos.left + 'px').style('top', enemyNextPos.top + 'px');
  };
}

setInterval(function() {
  moveEnemies();
}, 2000);
