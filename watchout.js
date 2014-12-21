var gameOptions = {
  height: 900,
  width: 1800,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisionCount: 0
};

// var createEnemies = function() {
//   var empty = Array.apply(null, Array(gameOptions.nEnemies));
//   return empty.map(function(value, i) {
//     return {
//       id: i,
//       // x: Math.random() * 100,
//       // y: Math.random() * 100
//     };
//   });
// };

var player = [];
var gameBoard = d3.select('body').append('div')
  .attr('class', 'game-board')
  .style("height", gameOptions.height + "px")
  .style("background-color", "gray")
  .style({
    'width': gameOptions.width + 'px'
  })
  .on('mousemove', function() {
    player = d3.mouse(this);
  });

// var dragmove = function(d) {
//   d3.select(this)
//     .style("top", function() {
//       var top = ((d3.event.sourceEvent.pageY) - this.offsetHeight / 2);
//       var topStyle = top + "px";
//       return (top > gameOptions.height) ? (gameOptions.height + "px") : topStyle;
//     })
//     .style("left", function() {
//       var left = ((d3.event.sourceEvent.pageX) - this.offsetWidth / 2);
//       var leftStyle = left + "px";
//       return (left > gameOptions.width) ? (gameOptions.width + "px") : leftStyle;
//     });
// };
// var drag = d3.behavior.drag()
//   .on("drag", dragmove);

// var player = gameBoard.append('button')
//   .attr('class', 'player')
//   .style('top', (gameOptions.height / 2) + 'px')
//   .style('left', (gameOptions.width / 2) + 'px')
//   .call(drag);

var enemies = gameBoard.selectAll('div').data(d3.range(gameOptions.nEnemies))
  .enter().append("div")
  .style("background-image", "url('asteroid.png')")
  .attr('class', 'enemy')
  .style('top', function() {
    return Math.random() * (gameOptions.height - 35) + 'px'
  })
  .style('left', function() {
    return Math.random() * (gameOptions.width - 35) + 'px'
  });


var moveEnemies = function(element) {

  element.transition().duration(2500)
    .style('top', function() {
      return Math.random() * (gameOptions.height - 35) + 'px'
    })
    .style('left', function() {
      return Math.random() * (gameOptions.width - 35) + 'px'
    })
    .each('end', function() {
      moveEnemies(d3.select(this));
    });

};

moveEnemies(enemies);


var prevCollision = false;

var checkCollision = function() {
  var collision = false;
  enemies.each(function() {

    var radiusSum = parseFloat(d3.select('.enemy').style('width')) / 2 + 15;
    var xDiff = parseFloat(d3.select(this).style('left')) - player[0];
    var yDiff = parseFloat(d3.select(this).style('top')) - player[1];
    var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if (separation < radiusSum) {
      collision = true;
    }
  });

  if (collision) {

    d3.select('.game-board').style('background-image', 'none');
    d3.select('.game-board').style('background-color', 'red');

    setTimeout(function() {
      d3.select('.game-board').style('background-image', 'url("stars.jpg")');
    }, 100);


    gameStats.score = 0;

    if (prevCollision != collision) {
      gameStats.collisionCount++;
      d3.select('#collisionCount').text(gameStats.collisionCount.toString());
    }

  }
  prevCollision = collision;
};
d3.timer(checkCollision);



var m = 2;
var increaseScore = function() {
  var multiplier = Math.ceil(gameStats.score / 100);

  if (multiplier === m) {
    m++;
    var text = "<span class = 'levelTwo'>LEVEL " + (m - 1) + "!!!</span>";
    $(text).appendTo('.game-board');
    $(".levelTwo").animate({
      left: '-3150px',
      //opacity:'0.5',
      //height:'150px',
      //width:'150px'
    }, 4000);
    $("<span class ='wish'>Make a wish!!!</span>").appendTo('.game-board');
    $(".wish").animate({
      left: '-3150px',
      //opacity:'0.5',
      //height:'150px',
      //width:'150px'
    }, 6000);

    gameOptions.nEnemies *= multiplier;
  }

  gameStats.score += 1;
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  d3.select('#high').text(gameStats.bestScore.toString());
  d3.select('#current').text(gameStats.score.toString());


};
setInterval(increaseScore, 50);
