var WIDTH = 30;
var SPEED = 30;
var HEIGHT = 30;
function SNAKE(x, y, movement, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.movement = movement;
  this.next = undefined;
};

function FOOD(x, y) {
  this.x = x;
  this.y = y;
};

FOOD.prototype.move = function() {
  this.x = Math.floor(Math.random() * 11) * WIDTH;
  this.y = Math.floor(Math.random() * 11) * HEIGHT;
};

SNAKE.prototype.length = function() {
    if (this.next === undefined) { return 1; }
    else { return this.next.length() + 1; }
};


SNAKE.prototype.move = function(new_movement) {
  this.movement();
  if (this.next != undefined) { this.next.move(this.movement); }
  if (new_movement != undefined) { this.movement = new_movement; }
}

SNAKE.prototype.death = function() {
  var thenext = this.next;
  while (thenext != undefined && this.length() > 2) {
    if (this.x == thenext.x && this.y == thenext.y) {
      return true;
    }
    thenext = thenext.next;
  }
  return false;
}
  
SNAKE.prototype.moveLeft = function() {
  this.x = ($(window).width() + this.x - this.speed) % $(window).width();
  console.log("moving left");
}

SNAKE.prototype.moveRight = function() {
  this.x = (this.x + this.speed) % $(window).width();
  console.log("moving right");
}

SNAKE.prototype.moveUp = function() {
  this.y = (this.y + this.speed) % $(window).height();
  console.log("moving up");
}

SNAKE.prototype.moveDown = function() {
  this.y = ($(window).height() + this.y - this.speed) % $(window).height();
  console.log("moving down");
}

SNAKE.prototype.addSnake = function() {
  var thenext = this.next;
  var the = this;
  while(thenext != undefined) {
    the = thenext;
    thenext = thenext.next;
  }
  the.next = new SNAKE(the.x, the.y, function(){console.log("fancy")}, the.speed);
}

var snake = new SNAKE(0, 0, SNAKE.prototype.moveRight, SPEED);
var new_movement = SNAKE.prototype.moveRight;
var food = new FOOD(50,50);

$('body').keydown(function(event) {
  if (event.keyCode == 37) new_movement = SNAKE.prototype.moveLeft;
  else if (event.keyCode == 38) new_movement = SNAKE.prototype.moveUp;
  else if (event.keyCode == 39) new_movement = SNAKE.prototype.moveRight;
  else if (event.keyCode == 40) new_movement = SNAKE.prototype.moveDown;
});

function stop_when(goal) {
  if (snake.length() == goal) {
    console.log("victory");
    return false;
  }
  else if (snake.death()) {
    console.log("death");
    return false;
  }
  return true;
}

function draw() {
  var the = snake;
  console.log("drawing x" + the.x + " y" + the.y);
  $('body').html('');
  while (the != undefined) {
    $('body').append(
        $('<div style="bottom: ' + the.y + 'px; left: ' + the.x + 'px;"></div>')
          .addClass("snake")
    );
    the = the.next;
  }
  $('body').append(
      $('<div style="bottom: ' + food.y + 'px; left: ' + food.x + 'px;"></div>')
        .addClass("food")
  );
}

function move() {
  if ((snake.x < food.x + WIDTH) && (snake.x + WIDTH >= food.x) &&
      (snake.y < food.y + HEIGHT) && (snake.y + HEIGHT > food.y)) {
    snake.addSnake();
    food.move();
  }
  snake.move(new_movement);
}

function bang(tick_time, goal) {
  if (stop_when(goal)) {
    draw();
    move();
    setTimeout(function() {bang(tick_time, goal)}, tick_time);
  }
}

bang(50, 1000);


