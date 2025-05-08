//A* pathfinding algorithm.
//CharlieJack, from The Coding Train.
//15.04.25 

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

var columns = 30; //Declare grid.
var rows = 30;
var grid = new Array(columns)

var openSet = []; //Nodes to check.
var closedSet = []; //Nodes already checked.
var path = [];

function Cell(i, j) {
    this.i = i; //Cell position attributes.
    this.j = j;

    //Attributes used in node evaluation.
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.adjacentNodes = [];
    this.previous = undefined;

    //Generate walls.
    this.wall = false;
    if (random(1) < 0.3) {
        this.wall = true;
    }
    //Display cell in grid.
    this.show = function(colour) { 
        fill(colour);
        if (this.wall) {
            fill(0);
        }
        stroke(0);
        rect(this.i * width/columns, this.j * height/rows, width/columns, height/rows); //Scales cells to window size.
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

function setup() {
    createCanvas(1000, 1000);

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
    startNode = grid[0][0]; 
    endNode = grid[columns - 1][rows - 1]; 
    //Prevents start and end nodes from being blocked.
    startNode.wall = false;
    endNode.wall = false;

    openSet.push(startNode);
}

function draw() {
    background(0);
    strokeWeight(2);

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
            noLoop();
            console.log("Completed.");
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
        noLoop();
        return;
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

    //Displays optimal path.
    path = [];
    var temp = currentNode;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }    
    for (var i = 0; i < path.length; i++) { //Colours nodes of path set.
        path[i].show(color(0, 0, 255));
    }

    //Draw line path.
    noFill();
    stroke(0, 0, 255);
    strokeWeight(width/columns/2);
    beginShape();
    for (var i = 0; i < path.length; i++) { //Colours nodes of path set.
        vertex(path[i].i * width/columns + width/columns/2, path[i].j * height/rows + height/rows/2);
    }
    endShape();
}