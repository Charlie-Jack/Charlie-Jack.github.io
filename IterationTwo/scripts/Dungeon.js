/*Created by: Charlie Simpkins
04-10-2025: Added new room function outside of setup().
            Fixed doors.
Last updated: 04-10-2025 */

var doorArray = []
class Door {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.position = createVector(this.i + 30, 0, this.j - 30);
        this.fill = '#C9415F';
    }

    draw() {
        push();
            translate(this.i, 0, this.j)
            console.log(this.position + player.position);
            fill(this.fill);
            box(30, 70, 30);
        pop();
    }

    open() {
        this.fill = '#f7ff85ff';
        if (p5.Vector.dist(this.position, player.position) < 60) {
            this.fill = '#14df79ff';
            if (keyIsDown(69) === true) { 
                newRoom();  
                statsTracker.roomsExplored++;  
                enemy = new Enemy(-300, -25, -300, 10, 0);
                enemyArray.push(enemy);
            }
        }
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