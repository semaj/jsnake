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
  this.x = this.x - this.speed;
}

SNAKE.prototype.moveRight = function() {
  this.x = this.x + this.speed;
}

SNAKE.prototype.moveUp = function() {
  this.y = this.y + this.speed;
}

SNAKE.prototype.moveDown = function() {
  this.y = this.y - this.speed;
}

SNAKE.prototype.addSnake = function() {
  var thenext = this.next;
  var the = this;
  while(thenext != undefined) {
    the = thenext;
    thenext = thenext.next;
  }
  the.next = new SNAKE(the.x, the.y, function(){}, the.speed);
}

var snake = new SNAKE(0, 0, SNAKE.prototype.moveRight, SPEED);
var new_movement = SNAKE.prototype.moveRight;
var food = new FOOD(30,30);

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
  var the = jQuery.extend(true, {}, snake);
  var window_height = $(window).height() - ($(window).height() % HEIGHT);
  var window_width = $(window).width() - ($(window).width() % WIDTH); 
  the.x = window_width + the.x;
  the.y = window_height + the.y;
  $('body').html('');
  while (the != undefined) {
    $('body').append(
        $('<div style="bottom: ' + the.y % window_height + 'px; left: ' + the.x % window_width + 'px;"></div>')
          .addClass("snake")
    );
    the = the.next;
  }
  $('body').append(
      $('<div style="bottom: ' + food.y % window_height + 'px; left: ' + food.x % window_width + 'px;"></div>')
        .addClass("food")
  );
}

function move() {
  var window_height = $(window).height() - ($(window).height() % HEIGHT);
  var window_width = $(window).width() - ($(window).width() % WIDTH); 
  var snakex = snake.x % window_width;
  var snakey = snake.y % window_height;
  var foodx = food.x % window_width;
  var foody = food.y % window_height;
  if ((snakex < foodx + WIDTH) && (snakex + WIDTH > foodx) &&
      (snakey < foody + HEIGHT) && (snakey + HEIGHT > foody)) {
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


