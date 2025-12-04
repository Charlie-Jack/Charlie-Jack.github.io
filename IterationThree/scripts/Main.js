/*Created by: Charlie Simpkins
The main script that controls all functionality of the solution.
Legacy updates will not be tracked by comments in the header due to their frequency.
Last updated: 03-12-2025 */

//Utility functions.
function removeFromArray(array, element) {
    for (var i = array.length - 1; i >= 0; i--) { //Checks for an element in the array - decrementing avoids skipping cascading elements on deletion.
        if (array[i] == element) { 
            array.splice(i, 1); //Deletes the element at the index in the array.
        }
    }
}

function heuristic(a, b) { //Finds distance between points.
    //Euclidian estimate.
    var d = dist(a.i, a.j, b.i, b.j);
    //Manhattan estimate.
    //var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}

//Detect mouse click inputs.
let click;
function mouseClicked() {
    click = true;
}

//Correct camera roll to its default rotation.
var cameraRoll = 0;
function correctCameraRoll() {
    if (cameraRoll > 0) {
        mainCamera.roll(-0.01);
        cameraRoll -= 0.01;
    }
}

//Starts the game, resetting all attributes - that are not otherwise reset by their methods - to their default values.
function startGame() {
    healthBar.maxHealth = 5;
    healthBar.health = healthBar.maxHealth;
    player.setPosition(220, -25, 220);
    mainCamera.set(gameCamera);
    enemyArray = [];
    enemy = new Enemy(-300, -25, -300, 10 * scalarDifficulty[difficulty][1], 0);
    enemyArray.push(enemy);
    statsTracker.reset();
    collectibleCounter.coins = 0;
    weapon.level = 1;
    weapon.rarity = 0;
    //Reset tutorial attributes.
    tutorial.movementKeys = [false, false, false, false];
    tutorial.clearFilters();
}

//Import p5 for on-demand global mode, allowing for use of p5.js functions outside of setup() and draw(). (Ignore the error message this causes.)
new p5();
//Loads all fonts, images, shaders and sounds.
function preload() {
    //Button sprites.
    button = loadImage('assets/button.png');
    playButtonImage = loadImage('assets/playButton.png');
    settingsButtonImage = loadImage('assets/settingsButton.png');
    muteButtonImage = loadImage('assets/muteButton.png');
    soundButtonImage = loadImage('assets/soundButton.png');
    replayButtonImage = loadImage('assets/replayButton.png');
    exitButtonImage = loadImage('assets/exitButton.png');
    easyDifficultyButtonImage = loadImage('assets/easyDifficultyButton.png');
    normalDifficultyButtonImage = loadImage('assets/normalDifficultyButton.png');
    hardDifficultyButtonImage = loadImage('assets/hardDifficultyButton.png');

    //Key sprites.
    keyWImage = loadImage('assets/keys/keyW.png');
    keyAImage = loadImage('assets/keys/keyA.png');
    keySImage = loadImage('assets/keys/keyS.png');
    keyDImage = loadImage('assets/keys/keyD.png');

    //UI sprites.
    heart = loadImage('assets/heart.png');
    emptyHeart = loadImage('assets/emptyHeart.png');
    coinImage = loadImage('assets/coin.png');
    rarityImage = loadImage('assets/rarityIndicator.png');
    defaultWeaponImage = loadImage('assets/defaultWeaponImage.gif');
    checkboxEmptyImage = loadImage('assets/checkboxEmpty.png');
    checkboxFullImage = loadImage('assets/checkboxFull.png');

    //Load font families.
    titleFont = loadFont('assets/krok.otf');
    pixelFont = loadFont('assets/pixelated.ttf');

    //Load sounds.
    soundFormats('ogg');
    shootSound = loadSound('assets/sounds/cowBell.ogg');
    deathSound = loadSound('assets/sounds/ironXylophone.ogg');
    activateSound = loadSound('assets/sounds/flute.ogg');
    deactivateSound = loadSound('assets/sounds/snare.ogg');
    selectionSound = loadSound('assets/sounds/hat.ogg');
    collectibleSound = loadSound('assets/sounds/bell.ogg');
    damageSound = loadSound('assets/sounds/bd.ogg');

    //Load shaders.
    displaceColorsSrc = `
    precision highp float;

    uniform sampler2D tex0;
    varying vec2 vTexCoord;

    vec2 zoom(vec2 coord, float amount) {
    vec2 relativeToCenter = coord - 0.5;
    relativeToCenter /= amount; // Zoom in
    return relativeToCenter + 0.5; // Put back into absolute coordinates
    }

    void main() {
    // Get each color channel using coordinates with different amounts
    // of zooms to displace the colors slightly
    gl_FragColor = vec4(
        texture2D(tex0, vTexCoord).r,
        texture2D(tex0, zoom(vTexCoord, 1.05)).g,
        texture2D(tex0, zoom(vTexCoord, 1.1)).b,
        texture2D(tex0, vTexCoord).a
    );
    }
    `;
}

//Set boolean to display start menu.
let playing = false;
//Initialise canvas, cameras, shaders, global variables and objects.
function setup() {  
    createCanvas(windowWidth, windowHeight, WEBGL);
 
    //Instantiate cameras.
    gameCamera = createCamera();
    gameCamera.lookAt(0, 0, 0);
    gameCamera.setPosition(290, -290, 290);
    gameCamera.ortho();
 
    menuCamera = createCamera();
    menuCamera.lookAt(0, 0, 0);
    menuCamera.setPosition(0, 0, 800); 
    menuCamera.ortho();

    mainCamera = createCamera();
    mainCamera.ortho();
    setCamera(mainCamera);

    //Create shaders.
    displaceColors = createFilterShader(displaceColorsSrc);

    //Create game objects.
    player = new Player(220, -25, 220);

    //Create UI objects.
    healthBar = new HealthBar(5);
    collectibleCounter = new CollectibleCounter();

    //Create Menu objects.
    summaryMenu = new SummaryMenu(); //Start menu objects.
    restartButton = new RestartButton(windowWidth/2, windowHeight/2 + windowHeight/3, 150, 150);

    startMenu = new StartMenu(); //Summary menu objects.
    playButton = new PlayButton(windowWidth/2 - 165, windowHeight/2 + windowHeight/9, 150, 150);
    soundButton = new SoundButton(windowWidth/2 + 165, windowHeight/2 + windowHeight/9, 150, 150);

    settingsMenu = new SettingsMenu(); //Settings meny options.
    settingsButton = new SettingsButton(windowWidth/2, windowHeight/2 + windowHeight/9, 150, 150);
    exitButton = new ExitButton(windowWidth/8, windowHeight/7, 150, 150);
    tutorialCheckbox = new Checkbox(windowWidth/2 + 400, windowHeight/2, 150, 150);

    //Difficulty button objects.
    easyDifficultyButton = new DifficultyButton(windowWidth/2 - 360, windowHeight/2 + windowHeight/5, 300, 150);
    normalDifficultyButton = new DifficultyButton(windowWidth/2, windowHeight/2 + windowHeight/5, 373, 150);
    hardDifficultyButton = new DifficultyButton(windowWidth/2 + 360, windowHeight/2 + windowHeight/5, 300, 150);

    weapon = new Weapon(10, "red", 1, 1);

    tutorial = new Tutorial();

    //Difficulty selection and adjustments.
    difficulty = 1;
    /*Multiplicative modifier for: 
    0. Difficulty name.
    1. Enemy health.
    2. Enemy speed.
    3. Enemy damage.
    4. Wall frequency.
    5. Projectile speed.
    */
    scalarDifficulty = [["easy", 0.5, 3, 1, 0.5, 1.5], ["normal", 1, 9/5, 1, 1, 1], ["hard", 1.5, 1, 2, 2, 0.8]];

    //Create tracker object for game statistics.
    statsTracker = new StatsTracker();
    //Generate initial dungeon room.
    newRoom();
}

function draw() {
    //Background and text styling.
    strokeWeight(2);
    background('#EEC39A');

    if (!playing) {
    mainCamera.set(menuCamera); //Resets the camera direction to look at menu.
        if (healthBar.health == 0) { //Chooses the start or end menu depending on the player's health.
            //Summary menu.
            summaryMenu.draw();
            statsTracker.draw();
            restartButton.draw();
            restartButton.detectCursor();
            click = false; //Resets click to false after all cursor collision checks with buttons.
        } else {
            //Start menu.
            startMenu.draw();
            playButton.draw();
            playButton.detectCursor();
            settingsButton.draw();
            settingsButton.detectCursor();
            soundButton.draw();
            soundButton.detectCursor();
            click = false; //Resets click to false after all cursor collision checks with buttons.
        }
    } else {
        //Camera control.
        mainCamera.setPosition(290, -290, 290); //Resets the camera direction to look at the game.
        mainCamera.lookAt(0, 0, 0);
        orbitControl(1, 0, 1); //Limits camera control with the mouse on the x and z axis.

        //User interface display.
        healthBar.draw();
        healthBar.damageCooldown --; //Decreases the cooldown on player damage.
        weapon.drawIcon();
        collectibleCounter.draw();

        //Display all cells in the grid.
        for (var i = 0; i < columns; i++) { //Adds cells to rows.
            for (var j = 0; j < rows; j++) {
                grid[i][j].show(color('#FFF5F1'));
            }
        }

        //Tutorial.
        if (tutorial.tutorialActive) {
            tutorial.draw();
        } 
        if (tutorial.tutorialStage > 2) { //Creates an enemy if the second stage of the tutorial has been completed.
            //Enemy handling.
            for (var i = 0; i < enemyArray.length; i++) { //Enables the default enemy pathfinding.
                enemyArray[i].movement++;
                if (enemyArray[i].pathfind) {
                    if (enemyArray[i].movement % (30 * scalarDifficulty[difficulty][2]) == 0) { //Controls idle movement when the player is stationary.
                        enemyArray[i].pathfinding();
                        enemyArray[i].updatePosition();
                    }
                }
                enemyArray[i].draw();
                enemyArray[i].checkCollisions();
            }
            if (tutorial.tutorialStage < 4) { //Enable fast pathfinding to account for player movement.
                tutorial.tutorialStage = 4;
            }
        }

        //Player display.
        player.updatePosition();
        player.ability();
        player.draw();
        try {
            //Opens doors when all enemies are defeated.     
            for (var i = 0; i < doorArray.length; i++) { 
                if (enemyArray.length == 0) {
                    doorArray[i].open();
                }    
                doorArray[i].draw();
            }
        } catch (TypeError) {
            console.log("Error.")
        }
    } 
    //Correct the camera roll to its default rotation.
    correctCameraRoll();
}
