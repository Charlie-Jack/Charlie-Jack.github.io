/*Created by: Charlie Simpkins
10-08-2025: Created the cell function and logic for the base creation of a pathfinding map.
04-09-2025: Added the generateDoors() function.
15-09-2025: Added coin generation to map.
20-10-2025: Wall generation now scales with difficulty.
30-11-2025: Added health pickups.
            Added weapon level increases.
03-12-2025: Added inline comments to all classes.
            Chnaged health pickup collectible varities to spheres.
Last updated: 03-12-2025 */


var columns = 30; //Declare the grid.
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
    this.weaponUpgrade = false;
    this.healthPickup = false;
    this.maxHealthPickup = false;
    this.weaponRarityPickup = false;

    if (random(1) < (0.03 * scalarDifficulty[difficulty][4])) { //Generates walls with the amount scaling to the current difficulty setting.
        this.wall = true;
    } else if (random(1) > 0.995) { //Generate coins.
        this.coin = true;
    } else if (random(1) > 0.999) { //Generate weapon upgrades.
        this.weaponUpgrade = true;
    }

    if (this.i == columns - 1 || this.i == 0 || this.j == rows - 1 || this.j == 0 ) { //Adds border walls.
        this.wall = true;
        generateDoors(this.i, this.j);
    }

    //Display the cell in the grid.
    this.show = function(colour) { 
        fill(colour);
        if (this.wall) { //Creates a wall.
            push();
            translate(this.i * 20 - 300, -5, this.j * 20 - 300);
            fill('#969696ff');
            box(20, 20, 20);
            pop(); 
        } else if (this.coin) { //Creates a coin collectible.
            push();
            translate(this.i * 20 - 300, -5, this.j * 20 - 300);
            fill('#f7ff85ff');
            box(10, 10, 10);
            pop(); 
        } else if (this.weaponUpgrade) { //Creates a weapon upgrade collectible.
            push();
            translate(this.i * 20 - 300, -5, this.j * 20 - 300);
            fill('#1e93c2ff');
            box(10, 10, 10);
            pop(); 
        } else if (this.healthPickup) { //Creates a health pickup collectible.
            push();
            translate(this.i * 20 - 300, -5, this.j * 20 - 300);
            noStroke();
            fill('#c2291eff');
            sphere(10, 10, 10);
            pop(); 
        } else if (this.maxHealthPickup) { //Creates a maxHealth increase pickup collectible.
            push();
            translate(this.i * 20 - 300, -5, this.j * 20 - 300);
            noStroke();
            fill('#37ff05ff');
            sphere(10, 10, 10);
            pop(); 
        } else if (this.weaponRarityPickup) { //Creates a weapon rarity pickup collectible.
            push();
            translate(this.i * 20 - 300, -5, this.j * 20 - 300);
            fill('#880071ff');
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
    //Generate a random amount of doors along the walls of each dungeon floor.
    if (random(1) < 0.03) {
        door = new Door(i * 20 - 300, j * 20 - 300);
        doorArray.push(door);
    }  
    //Ensure at least one door is generated.
    if (i == columns - 1 && j == rows - 1) {
        door = new Door(i * floor(random(20)) - 300, j * 20 - 300);
        doorArray.push(door);
    }
}