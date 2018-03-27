let allEnemies;
let allItems;
let player;
let round = 1;
let gems = 0;
let lives = 3;

// main character class 
var Character = function(row, speed, image, x=-101, width=71, height=101) {
    this.sprite = image;
    this.y = row * 83 - 20;
    this.x = x;
    this.width = width;
    this.height = height - 20;
    this.speed = speed;
};

Character.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// update is used along with requestAnimationFrame and delta from game
// engine to simulate movement in Enemy subclass
Character.prototype.update = function (dt) {
    const increments = {
        fast: 500 * dt,
        normal: 350 * dt,
        slow: 200 * dt,
        not: 0,
    };

    player.winner ?
        this.runaway(dt, increments) : this.run(dt, increments);
};

// Enemy subclass
var Enemy = function(row, speed, image, x, width, height) {
    Character.call(this, row, speed, image, x, width, height);
};

Enemy.prototype = Object.create(Character.prototype);

Enemy.prototype.constructor = Enemy;

// Runaway triggered by win condition at end of game
Enemy.prototype.runaway = function (dt, speedIncrements) {
    this.x += 5;
    this.y += 400 * dt;
    this.sprite = 'images/enemy-bug-rotate-right.png';
};

// sets running speed for the enemy. Once the enemy reaches
// end of canvas, it resets the enemy to the beginning, and 
// also randomly assigns it to a row
Enemy.prototype.run = function (dt, increments) {
    this.x += increments[this.speed];
    if (this.x >= ctx.canvas.width) {
        this.x = -500;
        this.y = (Math.floor(Math.random() * 3) + 1) * 83 - 20;
    }
};

// Player subclass
var Player = function(row, speed, image, x, width, height) {
    Character.call(this, row, speed, image, x, width, height);
    this.x = 202;
    this.crashed = false;
    this.passedRound = false;
}; 

Player.prototype = Object.create(Character.prototype);

Player.prototype.constructor = Player;

Player.prototype.update = function () {};

// main player method, handles player movement and triggers
// Player.prototype.wins and Player.prototype.nextRound
// methods
Player.prototype.handleInput = function (direction) {
    var moves = {
        left: -103,
        right: 103,
        up: -83,
        down: 83,
    };
    if ((direction && direction === 'left' && this.x > 0) ||
        (direction && direction === 'right' && this.x < 400)) {
        this.x += moves[direction];
    } else if ((direction && direction === 'up' && this.y > 0) ||
        (direction && direction === 'down' && this.y < 390)) {
        this.y += moves[direction];
    }

    if (this.y < 0) {
        if (round === 5) {
            this.wins();
        } else {
            this.nextRound();
        }
    }
};

// temporarily blocks player movement in between rounds,
// increments round and updates stats. Also triggers board reset
// in update (enjine.js) by settting player.passedRound to true
Player.prototype.nextRound = function () {
    document.removeEventListener('keyup', this.keyHandler);

    playerctx = this;
    setTimeout(function() {
        round++;
        updateStats();
        playerctx.passedRound = true;
    }, 1000);
}

Player.prototype.wins = function () {
    document.removeEventListener('keyup', this.keyHandler);
    var playerctx = this;

    setTimeout(function () {
        playerctx.roar();
        playerctx.winner = true;
        playerctx.sprite = 'images/crocodile.png';
        playerctx.x = 
            playerctx.x > 300 ? player.x - 300 : playerctx.x;
        playerctx.y = playerctx.y - 60;
        var buttonClasses = document.querySelector('.btn').classList;
        buttonClasses.remove('hidden');
    }, 500)
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.roar = function () {
    var roar = document.querySelector('#roar');
    var cheer = document.querySelector('#cheer');
    roar.volume = .4;
    cheer.volume = .6;
    roar.currentTime = 0;
    roar.play()
    setTimeout(function () {
        cheer.currentTime = 0;
        cheer.play();
    }, 400);
};

Player.prototype.keyHandler = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
};

Player.prototype.crash = function() {
    var crash = document.querySelector("#crash");
    var yell = document.querySelector("#yell");
    this.sprite = 'images/bloody.png';
    this.crashed = true;

    document.removeEventListener('keyup', this.keyHandler);
    crash.volume = .1;
    yell.volume = .1;
    crash.currentTime = 0;
    crash.play()
    this.y = this.y - 20;
    this.x = this.x - 25;

    setTimeout(function () {
        yell.currentTime = 0;
        yell.play();
    }, 300);
    lives--;

    updateStats();
};

// Item class
var Item = function(row, image, x, width=71, height=101) { 
    this.sprite = image;
    this.y = row * 83 - 40;
    this.x = x;
    this.width = width;
    this.height = height;
};

Item.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Called by collide function in game engine. Triggers losing sounds, 
// and makes the play again modal visible
function loseGame(reset) {
    var loseGame = $('#lose-sound')[0];
    var gameOver = $('#game-over')[0];
    loseGame.play();
    setTimeout(function() {
        $('.game-over').removeClass('hidden');
        gameOver.play();
        enablePlayAgain(reset, true);
    }, 1000);

};

// Dynamically instantiates and sets all classes/pieces based on round level. Difficulty
// increases with level/round
function setPieces(level) {
    allEnemies = [];
    allItems = [];
    player = new Player(5, null, 'images/char-boy.png', 202);

    var levels = {
        1: function () {
            allEnemies.push(new Enemy(1, 'normal', 'images/enemy-bug.png'));
            allItems.push(new Item(1, 'images/gem-blue.png', 303))
        },
        2: function () {
            setTimeout(function () {
                allEnemies.push(new Enemy(3, 'fast', 'images/enemy-bug.png'));
                allEnemies.push(new Enemy(4, 'normal', 'images/enemy-bug.png'));;
            }, 750)
            allEnemies.push(new Enemy(4, 'fast', 'images/enemy-bug.png'));
            allItems.push(new Item(3, 'images/gem-blue.png', 101))
        },
        3: function () {
            allEnemies.push(new Enemy(2, 'slow', 'images/enemy-bug.png'));
            allItems.push(new Item(2, 'images/gem-blue.png', 404))
        },
        4: function () {
            allEnemies.push(new Enemy(2, 'normal', 'images/enemy-bug.png'));
        },
        5: function () {
            allItems.push(new Item(1, 'images/gem-blue.png', 303))
            setTimeout(function () {
                allEnemies.push(new Enemy(1, 'fast', 'images/enemy-bug.png'));
                allEnemies.push(new Enemy(4, 'normal', 'images/enemy-bug.png'));;
            }, 750)
        },
    };

    for (var i = 1; i <= level; i++) {
        levels[i]();
    }

    document.addEventListener('keyup', player.keyHandler);
};

// Resets stats for restart
function zeroStats() {
    lives = 3;
    gems = 0;
    round = 1;
    updateStats();
};

// enables restart buttons at at game over from crashes and end of game
// from win
function enablePlayAgain(reset, isLose) {
    if (isLose) {
        $('#restart').click(function() {
            $('.game-over').addClass('hidden');
            zeroStats();
            reset();
        });
    } else {
        var button = document.querySelector('.btn');
        button.addEventListener('click', function () {
            button.classList.add('hidden');
            zeroStats();
            reset();
        });
    }
};

// uses Handlebars module to dynamically update stats in html
function updateStats() {
    $(".stats").remove();
    var source = document.getElementById("stats-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = { round: round, gems: gems, lives: lives };
    var html = template(context);
    $('#stats').append(html);
};

//initial call to updateStats once document is ready
$(function() {
    updateStats();
});


// TODOs: 
    //cleanup code
    //improve design: 
        // font, font-size, placement of round, lives and gems
        // add color to you lose modal
        // add a you win modal 

    // other potential changes:
        //add a title
        //clean up code
        //consider converting all to es6