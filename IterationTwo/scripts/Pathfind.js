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

function startGame() {
    healthBar.health = healthBar.maxHealth;
    player.setPosition(220, -25, 220);
    mainCamera.set(gameCamera);
}

//Import p5 for on-demand global mode (ignore error message).
new p5();

function enemyPathfinding() {
    if (openSet.length > 0) { //Continue if openSet is not empty - and thus the end node has not been located, nor all possible nodes exhausted.
        //Finds the most optimal node.
        var lowestIndex = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        //Sets current node to the most optimal node.
        var currentNode = openSet[lowestIndex];

        //Checks whether current node is the end node.
        if (currentNode === endNode) {
            console.log("Completed.");
            pathfind = false;
        }

        //Moves current node from the open set to the closed set.
        removeFromArray(openSet,currentNode);
        closedSet.push(currentNode)

        var adjacentNodes = currentNode.adjacentNodes;
        for (var i = 0; i < adjacentNodes.length; i++) { //Iterates through each adjacent node from array.
            var adjacent = adjacentNodes[i];

            if (!closedSet.includes(adjacent) && !adjacent.wall) {
                var tentativeG = currentNode.g + 1; //Applies current node score + distance.
                var newPath = false;
                if (openSet.includes(adjacent)) { //If adjacent node is in the open set and more optimal than previously visited nodes.
                    if (tentativeG < adjacent.g) {
                        adjacent.g = tentativeG;
                        newPath = true;
                    }
                } else { //If adjacent node is not already in the open set, it is added.
                    adjacent.g = tentativeG;
                    newPath = true;
                    openSet.push(adjacent);
                }

                if (newPath) {
                    //Calculate heurisitc value of adjacent node.
                    adjacent.h = heuristic(adjacent, endNode);
                    adjacent.f = adjacent.g + adjacent.h; //Calculate f score.
                    adjacent.previous = currentNode;
                }
            }
        }
    } else { //Stops search if no solution is available.
        console.log('No solution.');
        pathfind = false;
        return;
    }

    //Displays optimal path.
    path = [];
    var temp = currentNode;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }    
    console.log("Path: " + pathPosition.toString()); 
    console.log(path);
    
    if (!pathfind) {
        closedSet = [];
        openSet = [];
    }
}

function preload() {
    button = loadImage('assets/button.png');
    playButtonImage = loadImage('assets/playButton.png');
    settingsButtonImage = loadImage('assets/settingsButton.png');
    muteButtonImage = loadImage('assets/muteButton.png');
    soundButtonImage = loadImage('assets/soundButton.png');
    replayButtonImage = loadImage('assets/replayButton.png');

    heart = loadImage('assets/heart.png');
    emptyHeart = loadImage('assets/emptyHeart.png');

    titleFont = loadFont('/assets/krok.otf');
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
    enemy = new Enemy(-300, -25, -300);

    //Create UI objects.
    healthBar = new HealthBar(5);

    //Create Menu objects.
    summaryMenu = new SummaryMenu();
    restartButton = new RestartButton(windowWidth/2, windowHeight/2 + windowHeight/9, 150, 150);

    startMenu = new StartMenu();
    playButton = new PlayButton(windowWidth/2 - 165, windowHeight/2 + windowHeight/9, 150, 150);
    settingsButton = new SettingsButton(windowWidth/2, windowHeight/2 + windowHeight/9, 150, 150);
    soundButton = new SoundButton(windowWidth/2 + 165, windowHeight/2 + windowHeight/9, 150, 150);

    //Make grid.
    for (var i = 0; i < columns; i++) { //Create rows
        grid[i] = new Array(rows);
    }
    for (var i = 0; i < columns; i++) { //Add cells to rows.
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
    for (var i = 0; i < columns; i++) {  //Determines adjacent nodes.
        for (var j = 0; j < rows; j++) {
            grid[i][j].addAdjacent(grid);
        }
    }

    //Initilaise open set and start/end nodes.
    startNode = grid[1][1]; 
    endNode = grid[columns - 1][rows - 1]; 
    //Prevents start and end nodes from being blocked.
    startNode.wall = false;

    openSet.push(startNode);

    //enemyPosition = createVector(enemy.getPosition('x'), enemy.getPosition('y'), enemy.getPosition('z'));
    pathPosition = createVector(100, 0, 100);
}

let enemyMovement = 29;
let pathfind = true;

var cameraRoll = 0;
function draw() {
    //Styling.
    strokeWeight(2);
    background(200);

    if (!playing) {
    mainCamera.set(menuCamera); //Resets camera direction to look at menu.
        if (healthBar.health == 0) { //Chooses start or end menu depending on player health.
            //Summary menu.
            summaryMenu.draw();
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

        enemyMovement++;
        //Enemy display.    
        enemy.checkCollisions();

        if (pathfind) {
            if (enemyMovement % 30 == 0) {
                enemyPathfinding();
                enemy.updatePosition();
            }
            enemy.draw();
        }
        
        //Display cells in grid.
        for (var i = 0; i < columns; i++) { //Add cells to rows.
            for (var j = 0; j < rows; j++) {
                grid[i][j].show(color(255));
            }
        }

        for (var i = 0; i < closedSet.length; i++) { //Colours nodes of closed set.
            closedSet[i].show(color(255, 0, 0));
        }
        for (var i = 0; i < openSet.length; i++) { //Colours nodes of open set.
            openSet[i].show(color(0, 255, 0));
        }
        for (var i = 0; i < path.length; i++) { //Colours nodes of path set.
            path[i].show(color(0, 0, 255));
            //Updates final path node position vector.
            pathPosition.set(path[0].i * 20 - 300, 0, path[0].j * 20 - 300);
        }

        //Player display.
        player.updatePosition();
        player.draw();
    } 

    //Correct camera roll to default rotation.
    if (cameraRoll > 0) {
        mainCamera.roll(-0.01);
        cameraRoll -= 0.01;
    }
}
