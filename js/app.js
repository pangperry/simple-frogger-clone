//main enemy and player classes. Instances of each are
//continuously updated by the engine file
var Enemy = function (row, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.y = row * 83 - 20;
    this.x = -101;
    this.speed = speed;
};

Enemy.prototype.runaway = function (dt, speedIncrements) {
    this.x += 5;
    this.y += 400 * dt;
    this.sprite = 'images/enemy-bug-rotate-right.png';
}

Enemy.prototype.run = function (dt, increments) {
    this.x += increments[this.speed];
    if (this.x >= ctx.canvas.width) {
        this.x = -500;
        this.y = (Math.floor(Math.random() * 3) + 1) * 83 - 20;
    }
    if (this.speed === 'not') {
        this.x = 202;

    }
}

Enemy.prototype.update = function (dt) {
    var roar = player.roar
    const increments = {
        fast: 500 * dt,
        normal: 350 * dt,
        slow: 200 * dt,
        not: 0,
    }

    player.winner ? 
        this.runaway(dt, increments) : this.run(dt, increments);
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 5 * 83 - 20;
    this.winner = false;
    this.crashed = false;
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
    if (this.y < 0) this.wins();
};

Player.prototype.wins = function () {
    document.removeEventListener('keyup', keyHandler);
    var playerctx = this;

    setTimeout(function () {
        playerctx.roar();
        playerctx.winner = true;
        playerctx.sprite = 'images/crocodile.png';
        playerctx.x > 200 ? player.x - 200 : playerctx.x;
        playerctx.y = playerctx.y - 60;
        var buttonClasses = document.querySelector('.btn').classList;
        buttonClasses.remove('hidden');
    }, 500)
}

Player.prototype.update = function () {
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.roar = function () {
    var roar = document.querySelector('#roar');
    roar.volume = .4;
    roar.currentTime = 0;
    roar.play()
}

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
}

let allEnemies;
let player;

//instantiates and sets all classes/pieces
function setPieces() {
    // splat = new Splat();
    allEnemies = [];
    allEnemies.push(new Enemy(1, 'normal'));
    allEnemies.push(new Enemy(2, 'normal'));
    allEnemies.push(new Enemy(3, 'slow'));
    allEnemies.push(new Enemy(4, 'fast'));
    player = new Player();

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

//enables restart button at end of game
function enablePlayAgain(reset) {
    var button = document.querySelector('.btn');
    button.addEventListener('click', function() {
        button.classList.add('hidden');
        reset();
    });
}


// TODO: 

// suggestions: 
    //change splat and win to be methods on player --- this will require some thinking about triggering a 
    //look into simplifying the collision-detection
    
    //strict mode??? -maybe not...might just change to es6 + babel?