var Enemy = function(row, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.y = row * 83 - 20;
    this.x = -101;
    this.speed = speed; 
};

Enemy.prototype.update = function(dt) {
    const speedIncrements = {
        fast: 500 * dt,
        normal: 350 * dt,
        slow: 200 * dt,
        not: 0,
    }

    this.x += speedIncrements[this.speed]; 
    if (this.x >= ctx.canvas.width) {
        this.x = -500;
        this.y = (Math.floor(Math.random() * 3) + 1) * 83 - 20;
    }
    if (this.speed === 'not') {
        this.x = 202;
    }

    // console.log("enemy.y", this.y);
    // console.log("enemy.x", this.x);
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 5 * 83 - 20;
}

Player.prototype.handleInput = function(direction) {
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

Player.prototype.update = function() {
    // console.log("Player.x",this.x);
    // console.log("Player.y", this.y);
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Splat = function() {
    this.sprite = 'images/bloody.png'; 
    this.x = -1000;
    this.y = -1000;
}

Splat.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// allEnemies.push(new Enemy(1, 'fast'));
// allEnemies.push(new Enemy(2, 'normal'));
// allEnemies.push(new Enemy(3, 'slow'));
// setTimeout(function() {
    // allEnemies.push(new Enemy(1, 'slow'));
// }, 1500);

let allEnemies;
let player;
let splat;

function setPieces() {
    splat = new Splat();
    allEnemies = [];
    allEnemies.push(new Enemy(2, 'normal'));
    allEnemies.push(new Enemy(3, 'slow'));
    player = new Player();

    setTimeout(function() {
        allEnemies.push(new Enemy(1, 'fast'));
    }, 500);

    setTimeout(function() {
        allEnemies.push(new Enemy(1, 'fast'));
    }, 1000);
    // allEnemies.push(new Enemy(3, 'not'));
    document.addEventListener('keyup', keyHandler);
}

function keyHandler(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
}

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
    // audios.forEach(function(audio) {
    //     console.log(audio);
    //     audio.play();
    // });
}





// TODO: 
  //requirements:
    // Vehicle-player collision resets the game
    // Something happens when player wins

    // Vehicle-player collisions happen logically (not too early or too late)
    //must have readme
    //add comments to my code
// nice to haves:
    // Add collectible items on screen
    // Multiple vehicle types
    // Timed games
    // Be creative!