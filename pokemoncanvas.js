/**
 * Pokemon HTML5 canvas game
 * @version 1.0.0
 * @author Pravin Nayak <pra12vin54@gmail.com>
 */
window.onload = function () {
    'use strict';

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let w = document.getElementById('canvas').offsetWidth;
    let h = document.getElementById('canvas').offsetHeight;
    let pokemonterrainImageLoaded = false,
        pokeballImageLoaded = false,
        SpritImageLoaded = false;
    let imageSize = 50;

    let score = 0;
    let startX = 30
    let startY = 70
    let preDefinedInterval = 1000 * 5; //milliseconds
    let addtionalCollisonOffset = 5

    //PokemonterrainImageLoaded image
    let PokemonterrainImageLoaded = new Image();
    PokemonterrainImageLoaded.onload = function () {
        pokemonterrainImageLoaded = true;
        assetsLoaded();
    };
    PokemonterrainImageLoaded.src = './pokemon_terrain.jpg';


    //main sound
    let mainTheme = new Audio('./pokemonMainTheme.mp3');
    mainTheme.loop = true;
    mainTheme.volume = 0.5;
    // mainTheme.play();

    //pokeball-selection
    var pokePick = new Audio('./pokeballpickedUp.mp3');
    pokePick.volume = 0.8;

    //player image
    let spritImage = new Image();
    spritImage.onload = function () {
        pokeballImageLoaded = true;
        assetsLoaded();
    };
    spritImage.src = './pokemon.png';

    //pokeball image
    var pokeballImage = new Image();
    pokeballImage.onload = function () {
        SpritImageLoaded = true;
        assetsLoaded();
    };
    pokeballImage.src = './pokeball.png';

    let totalPokeballOnScreen = 5;
    let totatPokeballsArray = []
    /**
     * It acts as a class for every newly created pokeball
     * @Object
     * @name pokeball
     */
    var pokeball = {
        x: 0,
        y: 0,
        generatePosition: function () {
            let count = 0;
            do {
                this.x = Math.ceil(60 + (Math.random() * 100) + (Math.random() * 100) + (Math.random() * 100));
                this.y = Math.ceil(30 + (Math.random() * 100) + (Math.random() * 100) + (Math.random() * 100));
                count += 1

            } while ((check_collision(this.x, this.y) || check_pokeballCollison(this.x, this.y, "check").foundCollision) && count <= 20);
            // console.log(count)
            if (count >= 20) {
                window.location.reload()
            }
        }
    };



    for (let i = 0; i < totalPokeballOnScreen; i++) {
        let newPoke = Object.assign({}, pokeball)
        newPoke.generatePosition()
        totatPokeballsArray[i] = newPoke

    }
    // console.log(totatPokeballsArray)


    /**
     * Holds all the player's info like x and y axis position, his current direction (facing).
     * I have also incuded an object to hold the sprite position of each movement so i can call them
     * I also included the move function in order to move the player - all the functionality for the movement is in there
     * @Object
     * @name pokeball
     */
    var player = {};


    player.move = function (direction) {
        /**
         * A temporary object to hold the current x, y so if there is a collision with the new coordinates to fallback here
         */
        var hold_player = {
            x: startX,
            y: startY,
        };

        /**
         * Decide here the direction of the user and do the neccessary changes on the directions
         */
        switch (direction) {
            case 'left':
                if (!check_collision(startX - 1, startY)) {
                    startX -= addtionalCollisonOffset - 1
                }
                break;
            case 'right':
                if (!check_collision(startX + 1, startY)) {
                    startX += addtionalCollisonOffset - 1
                }

                break;
            case 'up':

                if (!check_collision(startX, startY - 1)) {
                    startY -= addtionalCollisonOffset - 1
                }

                break;
            case 'down':

                if (!check_collision(startX, startY + 10)) {
                    startY += addtionalCollisonOffset - 1
                }

                break;
        }

        /**
         * if there is a collision just fallback to the temp object i build before while not change back the direction so we can have a movement
         */
        if (check_collision(startX, startY)) {
            startX = hold_player.x;
            startY = hold_player.y;
        }

        /**
         * If player finds the coordinates of pokeball the generate new one, play the sound and update the score
         */
        let tempx = startX + 10,
            tempy = startY + 29
        // console.log(tempx, tempy, pokeball.x, pokeball.y)
        let collisionCheck = check_pokeballCollison(tempx, tempy)
        if (collisionCheck.foundCollision) {
            pokePick.pause();
            pokePick.currentTime = 0;
            pokePick.play();
            score += 1;

            let newPoke = Object.assign({}, pokeball)
            newPoke.generatePosition()
            totatPokeballsArray.splice(collisionCheck.ballFound, 1)
            setTimeout(() => {
                totatPokeballsArray.push(newPoke)
                update();
            }, preDefinedInterval)

        }

        update();
    };

    /**
     * Handle all the updates of the canvas and creates the objects
     * @function
     * @name update
     */
    function update() {
        ctx.drawImage(PokemonterrainImageLoaded, 0, 0);

        //Genboard
        board();

        //pokeball
        for (let i of totatPokeballsArray) {
            if (i.x) {
                ctx.drawImage(
                    pokeballImage,
                    i.x,
                    i.y,
                    imageSize - 30,
                    imageSize - 30
                )
            }

        }


        ctx.drawImage(
            spritImage,
            startX,
            startY,
            imageSize,
            imageSize
        );

    }

    function stopMainMusic() {
        mainTheme.pause()
    }

    function startMainMusic() {
        mainTheme.play()
    }

    /**
     * Our function that decides if there is a collision on the objects or not
     * @function
     * @name check_collision
     * @param {Integer} x - The x axis
     * @param {Integer} y - The y axis
     */
    function check_collision(x, y) {
        var foundCollision = false;
        if (
            x < 10 ||
            y < 10 ||
            y > 370 ||
            (y > 330 && (x >= 10 && x < 60)) ||
            (y > 370 && x < 60) ||
            ((y >= 340 && y <= 370) && x > 310) ||
            x > 390 ||
            (y > 320 && x > 350) ||
            (x > 380 && y > 280) ||
            (x > 380 && y < 60) ||
            ((y >= 20 && y < 50) && x > 370) ||
            ((y >= 10 && y < 60) && x < 60)

        ) {
            console.log('lost on the woods');
            foundCollision = true;
        }

        return foundCollision;
    }

    /**
     * Our function that decides if there is a collision on the pokeball or not
     * @function
     * @name check_pokeballCollison
     * @param {Integer} x - The x axis
     * @param {Integer} y - The y axis
     */
    function check_pokeballCollison(x, y, check) {
        let foundCollision = false;
        let ballFound = null;

        if (check) {
            for (let i in totatPokeballsArray) {

                let add = addtionalCollisonOffset + 20 // to keep the pokeball apart for certain distance

                if (((x + add) >= totatPokeballsArray[i].x && totatPokeballsArray[i].x >= (x - add)) && ((y + add) >= totatPokeballsArray[i].y && totatPokeballsArray[i].y >= (y - add))) {
                    // console.log("pokeball collision occured")
                    foundCollision = true
                    ballFound = i
                    break
                }
            }
        } else {
            for (let i in totatPokeballsArray) {
                // console.log(x, i.x, "x pos")
                if (((x + addtionalCollisonOffset) >= totatPokeballsArray[i].x && totatPokeballsArray[i].x >= (x - addtionalCollisonOffset)) && ((y + addtionalCollisonOffset) >= totatPokeballsArray[i].y && totatPokeballsArray[i].y >= (y - addtionalCollisonOffset))) {
                    // console.log("pokeball collision occured")
                    foundCollision = true
                    ballFound = i
                    break
                }
            }
        }




        return {
            foundCollision,
            ballFound
        };
    }

    /**
     * Here we are creating our board on the bottom right with our score
     * @todo maybe some mute button for the future?
     * @function
     * @name board
     */
    function board() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(w, h, 100, 70);

        ctx.font = 'bolder 18px Arial';
        ctx.fillStyle = '#000000';
        // console.log(w, h)
        let subH = 200
        ctx.fillText('You Found', 360, h - subH);

        ctx.font = 'bolder 16px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(score + ' poketballs', 360, h - subH - 20);
    }

    /**
     * Decide here if all the assets are ready to start updating
     * @function
     * @name assetsLoaded
     */
    function assetsLoaded() {
        if (
            pokemonterrainImageLoaded == true &&
            pokeballImageLoaded == true &&
            SpritImageLoaded == true
        ) {
            // pokeball.generatePosition();
            let waitNode = document.getElementById("wait")
            waitNode.parentNode.removeChild(waitNode)
            update();
        }
    }

    /**
     * Assign of the arrow keys to call the player move
     */
    document.onkeydown = function (e) {
        e = e || window.event;

        if (e.keyCode == '37') player.move('left');
        else if (e.keyCode == '38') player.move('up');
        else if (e.keyCode == '39') player.move('right');
        else if (e.keyCode == '40') player.move('down');
    };
    document.getElementById("stpMainMusic").addEventListener("click", function () {
        if (this.innerHTML.toLowerCase() == "start main music") {
            startMainMusic()
            this.innerHTML = "Stop Main Music"
        } else {
            stopMainMusic()
            this.innerHTML = "Start Main Music"
        }
    })
};