//main enemy and player classes. Instances of each are
//continuously updated by the engine file

//main character class with render and update methods
var Character = function(row, speed, image, x = -101) {
    this.sprite = image;
    this.y = row * 83 - 20;
    this.x = x;
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
    }

    player.winner ?
        this.runaway(dt, increments) : this.run(dt, increments);
};

//enemy subclass
var Enemy = function(row, speed, image, x) {
    Character.call(this, row, speed, image, x);
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
var Player = function(row, speed, image, x) {
    Character.call(this, row, speed, image, x);
    this.x = 202;
    this.winner = false;
    this.crashed = false;
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
    }
    if ((direction && direction === 'left' && this.x > 0) ||
        (direction && direction === 'right' && this.x < 400)) {
        this.x += moves[direction];
    } else if ((direction && direction === 'up' && this.y > 0) ||
        (direction && direction === 'down' && this.y < 390)) {
        this.y += moves[direction];
    }
    if (this.y < 0) this.wins();
};

Player.prototype.wins = function () {
    document.removeEventListener('keyup', this.keyHandler);
    var playerctx = this;

    setTimeout(function () {
        playerctx.roar();
        playerctx.winner = true;
        playerctx.sprite = 'images/crocodile.png';
        playerctx.x = 
            playerctx.x > 200 ? player.x - 300 : playerctx.x;
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

Player.prototype.crash = function() {
    var crash = document.querySelector("#crash");
    var yell = document.querySelector("#yell");
    this.sprite = 'images/bloody.png';
    this.crashed = true;

    document.removeEventListener('keyup', keyHandler);
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
};

let allEnemies;
let player;

//instantiates and sets all classes/pieces
function setPieces() {
    allEnemies = [];
    allEnemies.push(new Enemy(1, 'normal', 'images/enemy-bug.png'));
    allEnemies.push(new Enemy(2, 'normal', 'images/enemy-bug.png'));
    allEnemies.push(new Enemy(3, 'slow', 'images/enemy-bug.png'));
    allEnemies.push(new Enemy(4, 'fast', 'images/enemy-bug.png'));
    player = new Player(5, null, 'images/char-boy.png', 202);
    setTimeout(function() {
        allEnemies.push(new Enemy(1, 'fast', 'images/enemy-bug.png'));
        allEnemies.push(new Enemy(4, 'normal', 'images/enemy-bug.png'));
    }, 750);

    document.addEventListener('keyup', keyHandler);
};

// key handler function for player movement
function keyHandler(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
}

//enables restart button at end of game
function enablePlayAgain(reset) {
    var button = document.querySelector('.btn');
    button.addEventListener('click', function() {
        button.classList.add('hidden');
        reset();
    });
};


// TODO: 

// suggestions: 
    //change splat and win to be methods on player --- this will require some thinking about triggering a 
    //look into simplifying the collision-detection
    
    //strict mode??? -maybe not...might just change to es6 + babel?