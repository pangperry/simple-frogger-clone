var Enemy = function(row, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.y = row * 83 - 20;
    this.x = -101;
    this.speed = speed; 
};

Enemy.prototype.update = function(dt) {
    const speedIncrements = {
        fast: 500 * dt,
        normal: 300 * dt,
        slow: 10 * dt,
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


let allEnemies = [];

// allEnemies.push(new Enemy(1, 'fast'));
// allEnemies.push(new Enemy(2, 'normal'));
// allEnemies.push(new Enemy(3, 'slow'));
allEnemies.push(new Enemy(3, 'not'));

// setTimeout(function() {
    // allEnemies.push(new Enemy(1, 'slow'));
// }, 1500);

let player = new Player();

function keyHandler(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
}

document.addEventListener('keyup', keyHandler);




// TODO: 
  //requirements:
    //Player can not move off screen
    // Something happens when player wins

    // Vehicle-player collisions happen logically (not too early or too late)
    // Vehicle-player collision resets the game
    //must have readme
    //add comments to my code
// nice to haves:
    // Add collectible items on screen
    // Multiple vehicle types
    // Timed games
    // Be creative!