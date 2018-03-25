let allEnemies;
let allItems;
let player;
let round = 1;
let gems = 0;
let lives = 3;

// main enemy and player classes. Instances of each are
// continuously updated by the engine file

// main character class with render and update methods
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

//enemy subclass
var Enemy = function(row, speed, image, x, width, height) {
    Character.call(this, row, speed, image, x, width, height);
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.runaway = function (dt, speedIncrements) {
    this.x += 5;
    this.y += 400 * dt;
    this.sprite = 'images/enemy-bug-rotate-right.png';
};

Enemy.prototype.run = function (dt, increments) {
    this.x += increments[this.speed];
    if (this.x >= ctx.canvas.width) {
        this.x = -500;
        this.y = (Math.floor(Math.random() * 3) + 1) * 83 - 20;
    }
    if (this.speed === 'not') {
        this.x = 202;
    }
};

// player subclass
var Player = function(row, speed, image, x, width, height) {
    Character.call(this, row, speed, image, x, width, height);
    this.x = 202;
    this.winner = false;
    this.crashed = false;
    this.passedRound = false;
}; 

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function () {};
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
    //AND rounds = 5, then this wins, otherwise, increment round and reset
    //will need to pass in round to set pieces and then come up with different game logic
    //for each round
    if (this.y < 0) {
        if (round === 5) {
            this.wins();
        } else {
            this.nextRound();
        }
    }
};

//pause keyinputs,
//generate a small win sound 
// increment round, 
// resets player to start 
//reset triggers setpieces and setPieces should now take a round parameter
//reset should now take a round parameter
//should add enemies according to round now
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
    roar.volume = .4;
    roar.currentTime = 0;
    roar.play()
};

Player.prototype.keyHandler = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
}

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

var Item = function(row, image, x, width=71, height=101) { 
    this.sprite = image;
    this.y = row * 83 - 40;
    this.x = x;
    this.width = width;
    this.height = height;
}

Item.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//********FINISH GAME END FUNCTIONALITY */
function gameEnd() {
    alert('game end!!');
}
//instantiates and sets all classes/pieces
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

//enables restart button at end of game
function enablePlayAgain(reset) {
    var button = document.querySelector('.btn');
    button.addEventListener('click', function() {
        button.classList.add('hidden');
        reset();
    });
};

function updateStats() {
    $(".stats").remove();
    var source = document.getElementById("stats-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = {round: round, gems: gems, lives: lives};
    var html = template(context);
    $('#stats').append(html);
}

$(function() {
    updateStats();
});


// TODO: 
    //fix round update---it's not happenining on time, every time
    //add a game over modal with player again?
      //add game over sound
    //improve victory: winning sound + maybe some fireworks again ;)

    // other potential changes:
        //add a title
        //clean up code
        //consider converting all to es6