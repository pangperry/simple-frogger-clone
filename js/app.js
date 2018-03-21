//main enemy and player classes. Instances of each are
//continuously updated by the engine file
var Enemy = function (row, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.y = row * 83 - 20;
    this.x = -101;
    this.speed = speed;
};

Enemy.prototype.update = function (dt) {
    var roar = player.roar
    const speedIncrements = {
        fast: 500 * dt,
        normal: 350 * dt,
        slow: 200 * dt,
        not: 0,
    }

    if (player.winner) {
        this.x += 5;
        this.y += 400 * dt;
        this.sprite = 'images/enemy-bug-rotate-right.png';
    } else {
        this.x += speedIncrements[this.speed];
        if (this.x >= ctx.canvas.width) {
            this.x = -500;
            this.y = (Math.floor(Math.random() * 3) + 1) * 83 - 20;
        }
        if (this.speed === 'not') {
            this.x = 202;
        }
    }
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 5 * 83 - 20;
    this.winner = false;
}

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
};

Player.prototype.update = function () {
    if (this.y < 0) this.winner = true;
    if (this.winner) {
        document.removeEventListener('keyup', keyHandler);
    }
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//WinningCroc and Splat classes used to replace the player image in collision
// and win conditions
var WinningCroc = function () {
    //image is from  crocodile https://pngtree.com/element/down?id=MzQ3NzI1Mw==&type=1
    this.sprite = 'images/crocodile.png';
    this.y = +9999;
    this.x = +9999;
    this.winTriggered = false;
}

WinningCroc.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

WinningCroc.prototype.roar = function () {
    var roar = document.querySelector('#roar');
    roar.volume = .4;
    roar.currentTime = 0;
    roar.play()
}

var Splat = function () {
    this.sprite = 'images/bloody.png';
    this.x = -9999;
    this.y = -9999;
}

Splat.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

let allEnemies;
let player;
let splat;
let winningCroc;

//instantiates and sets all classes/pieces
function setPieces() {
    splat = new Splat();
    allEnemies = [];
    allEnemies.push(new Enemy(1, 'normal'));
    allEnemies.push(new Enemy(2, 'normal'));
    allEnemies.push(new Enemy(3, 'slow'));
    allEnemies.push(new Enemy(4, 'fast'));
    player = new Player();
    winningCroc = new WinningCroc(); 

    setTimeout(function() {
        allEnemies.push(new Enemy(1, 'fast'));
        allEnemies.push(new Enemy(4, 'normal'));
    }, 750);

    document.addEventListener('keyup', keyHandler);
}

//key handler function for player movement
function keyHandler(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
}

//plays sounds for collisions only
function playSounds() {
    var crash = document.querySelector("#crash");
    crash.volume = .1;
    var yell = document.querySelector("#yell");
    yell.volume = .1;
    crash.currentTime = 0;
    crash.play()
    setTimeout(function() {
        yell.currentTime = 0;
        yell.play();
    }, 300);
}

//enables restart button at end of game
function enablePlayAgain(reset) {
    var button = document.querySelector('.btn');
    button.addEventListener('click', function() {
        button.classList.add('hidden');
        reset();
    });
}


// TODO: 

// Required: 
    // 2. Add instructions on how to play
// suggestions: 
    //studu