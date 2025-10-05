/*Created by: Charlie Simpkins
Last updated: 02-10-2025 */

/*Created by: Charlie Simpkins
Last updated: 30-08-2025
Resets the pathfinding algorithm when the player moves, as the conditions have now changed.
This includes both the open and closed set, previously visited nodes, and the pathfinding boolean.
Also calls enemyPathfinding() every seven frames to cause the enemy towards the player, even when the
player is also moving.*/

var columns = 30; //Declare grid.
var rows = 30;
var grid = new Array(columns)

function Cell(i, j) {
    this.i = i; //Cell position attributes.
    this.j = j;

    //Attributes used in node evaluation.
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.adjacentNodes = [];
    this.previous = undefined;

    //Generate walls and collectibles.
    this.wall = false;
    this.coin = false;
    if (random(1) < 0.03) {
        this.wall = true;
    } else if (random(1) > 0.99) {
        this.coin = true;
    }
    if (this.i == columns - 1 || this.i == 0 || this.j == rows - 1 || this.j == 0 ) { //Adds border walls.
        this.wall = true;
        generateDoors(this.i, this.j);
    }

    //Display cell in grid.
    this.show = function(colour) { 
        fill(colour);
        if (this.wall) { //Creates wall block.
            push();
            translate(this.i * 20 - 300, -5, this.j * 20 - 300);
            fill('#969696ff');
            box(20, 20, 20);
            pop(); 
        } else if (this.coin) { //Creates coin collectible.
            push();
            translate(this.i * 20 - 300, -5, this.j * 20 - 300);
            fill('#f7ff85ff');
            box(10, 10, 10);
            pop(); 
        }
        stroke('#001011');      
        push(); //Convert to 3D horizontal plane.
        translate(this.i * 20 - 300, 0, this.j * 20 - 300);
        rotate(HALF_PI, [1, 0, 0]);
        plane(20, 20); //Scales cells to window size.
        pop();
    }

    //Determines neighbouring nodes depenedent on cell position in the grid.
    this.addAdjacent = function(grid) {
        //Adds orthogonically adjacent cells.
        if (this.i < columns - 1) {
            this.adjacentNodes.push(grid[this.i + 1][this.j])
        } 
        if (this.i > 0) {
            this.adjacentNodes.push(grid[this.i - 1][this.j])
        }
        if (this.j < rows - 1) {
            this.adjacentNodes.push(grid[this.i][this.j + 1])
        }
        if (this.j > 0) {
            this.adjacentNodes.push(grid[this.i][this.j - 1])
        }
        //Adds diagonally adjacent cells.
        if (this.i > 0 && this.j > 0) {
            this.adjacentNodes.push(grid[this.i - 1][this.j - 1])
        }
        if (this.i < columns - 1 && this.j > 0) {
            this.adjacentNodes.push(grid[this.i + 1][this.j - 1])
        }
        if (this.i > 0 && this.j < rows - 1) {
            this.adjacentNodes.push(grid[this.i - 1][this.j + 1])
        }
        if (this.i < columns - 1 && this.j < rows - 1) {
            this.adjacentNodes.push(grid[this.i + 1][this.j + 1])
        }
    }
}

function generateDoors(i, j) {
    if (random(1) < 0.03) {
        door = new Door(i * 20 - 300, j * 20 - 300);
        doorArray.push(door);
    }  
    //Ensure at least one door is generated.
    if (doorArray == []) {
        door = new Door(i * 20 - 300, j * 20 - 300);
        doorArray.push(door);
    }
}