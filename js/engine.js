/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
*/ 

var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    //  This function serves as the kickoff point for the game loop itself
    //  and handles properly calling the update and render methods. Uses 
    //  time delta and requestAnimationFrame for smooth animation
     
    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        update(dt);
        render();

        lastTime = now;

        win.requestAnimationFrame(main);
    };

    //  This function does some initial setup, including setting the 
    //  lastTime variable that is required for the game loop.
     
    function init() {
        enablePlayAgain(reset);
        reset();
        lastTime = Date.now();
        main();
    };

    // This function is called by main at each tick, updating enemy 
    // movements, checking for player-enemy and player-item collisions,
    // and calling reset to update the board between rounds
    function update(dt) {
        updateEntities(dt);
        if (!player.crashed) {
            checkCollisions();
        }
        if (player.passedRound) {
            reset();
        }
    };

    // This is called by the update function and loops through all of the
    // allEnemies array.
    // Updates for Players and Items are handled separately through checkCollisions
    // and Player.prototype.handleInput 
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
    };

    function isCollision(obj1, obj2) {
        var result = (obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.height + obj1.y > obj2.y);

        return result;
    };

    function collide() {
        player.crash();
        if (lives === 0) {
            setTimeout(function() {
                loseGame(reset);
            }, 1750);
        } else {
            setTimeout(function() {
                reset();
            }, 1750);
        }
    }

    //checks for player-enemy and player-item collisions, and either calls collide 
    //or increments gems
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            if (!player.crashed) {
                if (isCollision(player, enemy)) {
                    collide();
                }
            }
        });

        allItems.forEach(function(item, index) {
            if (!player.crashed) {
                if (isCollision(player, item)) {
                    allItems.splice(index, 1);
                    gems++;
                    updateStats();
                }
            }
        });
    }

    // This function initially draws the "game level", and calls
    // the renderEntities function. It is called every game tick 
    function render() {
        var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png',    // Row 2 of 2 of grass
        ],
            numRows = 6,
            numCols = 5,
            row, col;

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                //Using Resources helpers for caching
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    };

    // This function is called by the render function on each game
    // tick to re-render all entities  app.js
    function renderEntities() {
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        allItems.forEach(function (item) {
            item.render();
        });

        player.render();
    };

    // This function is called once by init and then whenever 
    // Player.prototype.passedRound gets set to true. It calls 
    // setPieces, passing in round to dynimically instantiate 
    // the board entities as appropriate for the round
    function reset() {
        setPieces(round);
    }

    //Loads the images we are going to need for the game
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/bloody.png',
        'images/enemy-bug-rotate-right.png',
        'images/crocodile.png',
        'images/gem-blue.png'
    ]);

    //Calls init, once the images are loaded
    Resources.onReady(init);

    // Assigns the canvas' context object to the global variable for
    // easy access in app.js
    global.ctx = ctx;
})(this);
