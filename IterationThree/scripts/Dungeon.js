/*Created by: Charlie Simpkins
04-10-2025: Added new room function outside of setup().
            Fixed doors.
04-11-2025: Added tutorial and its stages.
02-12-2025: Added movement key indicators to tutorial.
03-12-2025: Updated summary and inline comments.
            Added enemy scaling per floor traversed.
Last updated: 03-12-2025 */

var dungeonLevel = 3;
var doorArray = []
class Door {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.position = createVector(this.i + 30, 0, this.j - 30);
        this.fill = '#C9415F';
    }
    //Draws the door to canvas.
    draw() {
        push();
            translate(this.i, 0, this.j)
            fill(this.fill);
            box(30, 70, 30);
        pop();
    }
    //Opens all doors when the enemy is defeated. 
    open() {
        this.fill = '#f7ff85ff';
        if (p5.Vector.dist(this.position, player.position) < 100) { //Changes the door colour when the player is in range.
            this.fill = '#14df79ff';
            //Allows the player to enter the next floor when the ability key is pressed.
            if (keyIsDown(69) === true) { 
                //Chance for enemy to level up.
                if (random(1) > 0.5) {
                    dungeonLevel++;
                }
                newRoom();   
                statsTracker.roomsExplored++;  
                enemy = new Enemy(-300, -25, -300, floor(10 * scalarDifficulty[difficulty][1] * dungeonLevel/3), 0);
                enemyArray.push(enemy);
            }
        }
    }
}

class Tutorial {
    constructor() {
        this.tutorialActive = true;
        this.tutorialStage = 1;

        this.movementKeys = [false, false, false, false];
        this.wKey = keyWImage;
        this.aKey = keyAImage;
        this.sKey = keySImage;
        this.dKey = keyDImage;
    }
    //Draws the tutorial text and sprites to canvas.
    draw() {
        switch (this.tutorialStage) {
            case 1: //Tutorial stage one, teaching movement controls.
                //Create tutorial information text.
                push();
                    textFont(pixelFont);
                    textSize(60);
                    rotate(QUARTER_PI, [0, 1, 0]);
                    translate(-2 * windowWidth/6 , 2 * windowHeight/5 - 300, 2 * windowWidth/10 - 100 ); //Adjustments to allow for orthographic drawing style.
                    stroke('#180832');
                    fill('#FFF5F1');
                    text("move.", 0, 0);
                pop(); 
                //Draws W key sprite to canvas.
                push(); 
                    noStroke();
                    texture(this.wKey);
                    translate(-windowWidth * 0.45, 2* windowHeight/3 - 170, 0); //Adjustments to allow for orthographic drawing style.
                    rotate(QUARTER_PI, [0, 1, 0]);
                    plane(130, 150); 
                pop(); 
                //Draws A key sprite to canvas.
                push(); 
                    noStroke();
                    texture(this.aKey);
                    translate(-windowWidth * 0.45 - 210, 2* windowHeight/3 + 105, 0); //Adjustments to allow for orthographic drawing style.
                    rotate(QUARTER_PI, [0, 1, 0]);
                    plane(130, 150); 
                pop();
                //Draws S key sprite to canvas.
                push(); 
                    noStroke();
                    texture(this.sKey);
                    translate(-windowWidth * 0.45, 2* windowHeight/3, 0); //Adjustments to allow for orthographic drawing style.
                    rotate(QUARTER_PI, [0, 1, 0]);
                    plane(130, 150); 
                pop();
                //Draws D key sprite to canvas.
                push(); 
                    noStroke();
                    texture(this.dKey);
                    translate(-windowWidth * 0.45 + 210, 2* windowHeight/3 - 100, 0); //Adjustments to allow for orthographic drawing style.
                    rotate(QUARTER_PI, [0, 1, 0]);
                    plane(130, 150); 
                pop();
                //Checks whether each movement key has been pressed.
                if (keyIsDown(87)) { //Movement forward validation.
                    this.movementKeys[0] = true;
                    this.wKey.filter(GRAY);
                } else if (keyIsDown(65)) { //Movement left validation.
                    this.movementKeys[1] = true;
                    this.aKey.filter(GRAY);
                } else if (keyIsDown(83)) { //Movement backwards validation.
                    this.movementKeys[2] = true;
                    this.sKey.filter(GRAY);
                } else if (keyIsDown(68)) { //Movement right validation.
                    this.movementKeys[3] = true;
                    this.dKey.filter(GRAY);
                }
                //Increments tutorial stage when all the movement keys have been pressed.
                if (!this.movementKeys.includes(false)) {
                    this.tutorialStage++;
                }
                break;
            case 2: //Tutorial stage two, teaching the collection of coins and collectibles.
                //Create tutorial information text.
                push();
                    textFont(pixelFont);
                    textSize(60);
                    rotate(QUARTER_PI, [0, 1, 0]);
                    translate(-2 * windowWidth/6 , 2 * windowHeight/5 - 300, 2 * windowWidth/10 - 100 ); //Adjustments to allow for orthographic drawing style.
                    stroke('#180832');
                    fill('#FFF5F1');
                    text("pick up a coin.", 0, 0);
                pop(); 
                //Increments tutorial stage when a coin has been collected.
                if (statsTracker.coinsCollected > 0) {
                    this.tutorialStage++;
                }
                break;
            case 4: //Tutorial stage three, teaching the ability to damage enemies using projectiles.
                //Draws E key sprite to canvas.
                push(); 
                    noStroke();
                    texture(keyEImage);
                    translate(-windowWidth * 0.45, 2* windowHeight/3, 0); //Adjustments to allow for orthographic drawing style.
                    rotate(QUARTER_PI, [0, 1, 0]);
                    plane(130, 150); 
                pop();
                //Create tutorial information text.
                push();
                    textFont(pixelFont);
                    textSize(60);
                    rotate(QUARTER_PI, [0, 1, 0]);
                    translate(-2 * windowWidth/6 , 2 * windowHeight/5 - 300, 2 * windowWidth/10 - 100 ); //Adjustments to allow for orthographic drawing style.
                    stroke('#180832');
                    fill('#FFF5F1');
                    text("shoot the enemy.", 0, 0);
                pop();      
                //Increments tutorial stage when the enemy has been hit, detected by checking whether their damage cooldown attribute has been increased.
                if (enemy.damageCooldown > 0) {
                    this.tutorialStage++;
                }
                break; 
            case 5: //Tutorial stage four, teaching the ability to kill enemies.
                //Create tutorial information text.
                push();
                    textFont(pixelFont);
                    textSize(60);
                    rotate(QUARTER_PI, [0, 1, 0]);
                    translate(-2 * windowWidth/6 , 2 * windowHeight/5 - 300, 2 * windowWidth/10 - 100 ); //Adjustments to allow for orthographic drawing style.
                    stroke('#180832');
                    fill('#FFF5F1');
                    text("kill the enemy to open doors.", 0, 0);
                pop();      
                //Increments tutorial stage when the enemy has been killed.
                if (enemy.health == 0) {
                    this.tutorialStage++;
                }
                break; 
            case 6: //Tutorial stage five, teaching the ability to enter doors and progress to the next dungeon stage.
                //Draws E key sprite to canvas.
                push(); 
                    noStroke();
                    texture(keyEImage);
                    translate(-windowWidth * 0.45, 2* windowHeight/3, 0); //Adjustments to allow for orthographic drawing style.
                    rotate(QUARTER_PI, [0, 1, 0]);
                    plane(130, 150); 
                pop();
                //Create tutorial information text.
                push();
                    textFont(pixelFont);
                    textSize(60);
                    rotate(QUARTER_PI, [0, 1, 0]);
                    translate(-2 * windowWidth/6 , 2 * windowHeight/5 - 300, 2 * windowWidth/10 - 100 ); //Adjustments to allow for orthographic drawing style.
                    stroke('#180832');
                    fill('#FFF5F1');
                    text("go through a door.", 0, 0);
                pop();      
                //Increments tutorial stage when the player enters a door. This action spawns a new enemy with a health attribute that must be greater than zero.
                if (enemy.health > 0) {
                    this.tutorialStage++;
                }
                break; 
            //Terminates the tutorial.
            default:
                this.tutorialActive = false;
                break;
        }
    } 
    clearFilters() {
        this.wKey = keyWImage.get();
        this.aKey = keyAImage.get();
        this.sKey = keySImage.get();
        this.dKey = keyDImage.get();
    }
}

function newRoom() {
    doorArray = [];
    player.projectileList = []; //Clear projectiles.
    columns = 30; //Declare grid.
    rows = 30;
    grid = new Array(columns)
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

}
