/*Created by: Charlie Simpkins
Last updated: 02-10-2025 */

//Utility functions.
function removeFromArray(array, element) {
    for (var i = array.length - 1; i >= 0; i--) { //Checks for element in the array - decrementing avoids skipping cascading elements on deletion.
        if (array[i] == element) { 
            array.splice(i, 1); //Deletes element at index in the array.
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

//Correct camera roll to default rotation.
var cameraRoll = 0;
function correctCameraRoll() {
    if (cameraRoll > 0) {
        mainCamera.roll(-0.01);
        cameraRoll -= 0.01;
    }
}

function startGame() {
    healthBar.health = healthBar.maxHealth;
    player.setPosition(220, -25, 220);
    mainCamera.set(gameCamera);
    enemyArray = [];
    enemy = new Enemy(-300, -25, -300, 10, 0);
    enemyArray.push(enemy);
    statsTracker.reset();
    collectibleCounter.coins = 0;
}

//Import p5 for on-demand global mode (ignore error message).
new p5();

function preload() {
    button = loadImage('assets/button.png');
    playButtonImage = loadImage('assets/playButton.png');
    settingsButtonImage = loadImage('assets/settingsButton.png');
    muteButtonImage = loadImage('assets/muteButton.png');
    soundButtonImage = loadImage('assets/soundButton.png');
    replayButtonImage = loadImage('assets/replayButton.png');

    //UI sprites.
    heart = loadImage('assets/heart.png');
    emptyHeart = loadImage('assets/emptyHeart.png');
    coinImage = loadImage('assets/coin.png');
    defaultWeaponImage = loadImage('assets/defaultWeaponImage.gif');

    //Load font families.
    titleFont = loadFont('/assets/krok.otf');
    pixelFont = loadFont('/assets/pixelated.ttf');

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

    //Create tracker object for game statistics.
    statsTracker = new StatsTracker();

    //Create Menu objects.
    summaryMenu = new SummaryMenu(); //Start menu objects.
    restartButton = new RestartButton(windowWidth/2, windowHeight/2 + windowHeight/5, 150, 150);

    startMenu = new StartMenu(); //Summary menu objects.
    playButton = new PlayButton(windowWidth/2 - 165, windowHeight/2 + windowHeight/9, 150, 150);
    soundButton = new SoundButton(windowWidth/2 + 165, windowHeight/2 + windowHeight/9, 150, 150);

    settingsMenu = new SettingsMenu(); //Settings meny options.
    settingsButton = new SettingsButton(windowWidth/2, windowHeight/2 + windowHeight/9, 150, 150);

    weapon = new Weapon(10, "red");

    //Generate initial dungeon room.
    newRoom();
}

function draw() {
    //Styling.
    strokeWeight(2);
    background('#EEC39A');

    if (!playing) {
    mainCamera.set(menuCamera); //Resets camera direction to look at menu.
        if (healthBar.health == 0) { //Chooses start or end menu depending on player health.
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
        mainCamera.setPosition(290, -290, 290);//Resets camera direction to look at game.
        mainCamera.lookAt(0, 0, 0);
        orbitControl(1, 0, 1); //Limited camera control with the mouse on the x and z axis.

        //Health bar display.
        healthBar.draw();
        healthBar.damageCooldown --; //Decrease cooldown on player damage.

        weapon.drawIcon();
        collectibleCounter.draw();

        //Display cells in grid.
        for (var i = 0; i < columns; i++) { //Add cells to rows.
            for (var j = 0; j < rows; j++) {
                grid[i][j].show(color('#FFF5F1'));
            }
        }
   
        //Enemy handling.
        for (var i = 0; i < enemyArray.length; i++) { 
            enemyArray[i].movement++;
            if (enemyArray[i].pathfind) {
                if (enemyArray[i].movement % 30 == 0) {
                    enemyArray[i].pathfinding();
                    enemyArray[i].updatePosition();
                }
            }
            enemyArray[i].draw();
            enemyArray[i].checkCollisions();
        }

        //Player display.
        player.updatePosition();
        player.ability();
        player.draw();

        //Opens doors when all enemies are defeated.     
        for (var i = 0; i < doorArray.length; i++) { 
            if (enemyArray.length == 0) {
                doorArray[i].open();
            }    
            doorArray[i].draw();
        }

    } 
    //Correct camera roll to default rotation.
    correctCameraRoll();
}
