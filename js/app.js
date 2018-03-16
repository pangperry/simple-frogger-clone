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
        slow: 200 * dt,
    }

    this.x += speedIncrements[this.speed]; 
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 5 * 80;
}

Player.prototype.handleInput = function(direction) {
    var moves = {
        left: -103,
        right: 103,
        up: -83,
        down: 83,
    }
    
    if (direction && direction === 'right' || direction === 'left') {
        this.x += moves[direction];
    } else if (direction) {
        this.y += moves[direction];
    }

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [];

allEnemies.push(new Enemy(1, 'fast'));
allEnemies.push(new Enemy(2, 'normal'));
allEnemies.push(new Enemy(3, 'slow'));

let player = new Player();
// allEnemies.push(new Enemy('right', 20, null));


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
