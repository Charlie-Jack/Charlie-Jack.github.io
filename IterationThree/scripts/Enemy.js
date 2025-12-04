/*Created by: Charlie Simpkins
01-09-2025: Transfer of pathfinding() method from Main.js to enemy class.
            Removed cell colouring for pathfinding function.
04-10-2025: Added collision logic with projectiles.
30-11-2025: Sound effect on enemy death implemented.
            Added chance of health pickups on death.
03-12-2025: Updated inline comments.    
            Added rare chance of maxHealth and weapon rarity increases on death.
            Added enemy scaling per floor traversed.
            Added tracking for enemy deaths and damage received in stats tracker.
Last updated: 03-12-2025 */

class Enemy {
    constructor(x, y, z, health, arrayPosition) {
        this.arrayPosition = arrayPosition;
        this.x = x;
        this.y = y;
        this.z = z;
        this.position = createVector(this.x, this.y, this.z);
        //Pathfinding attributes.
        this.openSet = [startNode];
        this.closedSet = []; //Nodes already checked.
        this.path = []
        this.currentNode = []

        this.movement = (30 * scalarDifficulty[difficulty][2]) - 1;
        this.speed = 0;
        this.pathfind = true;

        this.health = health;
        this.damageCooldown = 0;
        this.fill = '#F16566';

        this.level = 1;
    }

    //Updates the position of enemy towards the end node.
    updatePosition() {  
        this.x = this.path[0].i * 20 - 300;
        this.z = this.path[0].j * 20 - 300;
        this.position.set(this.x, this.y, this.z);
    }   

    pathfinding() {
        if (this.openSet.length > 0) { //Continue if openSet is not empty - and thus the end node has not been located, nor all possible nodes exhausted.
            //Finds the most optimal node.
            var lowestIndex = 0;
            for (var i = 0; i < this.openSet.length; i++) {
                if (this.openSet[i].f < this.openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }
            //Sets current node to the most optimal node.
            this.currentNode = this.openSet[lowestIndex];

            //Checks whether current node is the end node.
            if (this.currentNode === endNode) {
                console.log("Completed.");
                this.pathfind = false;
            }

            //Moves current node from the open set to the closed set.
            removeFromArray(this.openSet, this.currentNode);
            this.closedSet.push(this.currentNode)

            var adjacentNodes = this.currentNode.adjacentNodes;
            for (var i = 0; i < adjacentNodes.length; i++) { //Iterates through each adjacent node from array.
                var adjacent = adjacentNodes[i];

                if (!this.closedSet.includes(adjacent) && !adjacent.wall) {
                    var tentativeG = this.currentNode.g + 1; //Applies current node score + distance.
                    var newPath = false;
                    if (this.openSet.includes(adjacent)) { //If adjacent node is in the open set and more optimal than previously visited nodes.
                        if (tentativeG < adjacent.g) {
                            adjacent.g = tentativeG;
                            newPath = true;
                        }
                    } else { //If adjacent node is not already in the open set, it is added.
                        adjacent.g = tentativeG;
                        newPath = true;
                        this.openSet.push(adjacent);
                    }

                    if (newPath) {
                        //Calculate heurisitc value of adjacent node.
                        adjacent.h = heuristic(adjacent, endNode);
                        adjacent.f = adjacent.g + adjacent.h; //Calculate f score.
                        adjacent.previous = this.currentNode;
                    }
                }
            }
        } else { //Stops search if no solution is available.
            console.log('No solution.');
            this.pathfind = false;
            return;
        }

        //Displays optimal path.
        this.path = [];
        var temp = this.currentNode;
        this.path.push(temp);
        while (temp.previous) {
            this.path.push(temp.previous);
            temp = temp.previous;
        }    
        
        if (!this.pathfind) {
            this.closedSet = [];
            this.openSet = [];
        }      
    }

    resetPathfind() {
        this.pathfind = true;
        this.closedSet = [];
        this.openSet = [];
        this.openSet.push(this.path[0]);
        for (var i = 0; i < columns; i++) { //Resets all previous nodes in the path.
            for (var j = 0; j < rows; j++) {
                grid[i][j].previous = undefined;
            }
        }
        //Runs the enemy pathfinding and movement to cause the enemy to dash towards the player.
        this.movement = (30 * scalarDifficulty[difficulty][2]) - 1;
        if (this.speed % (5 * scalarDifficulty[difficulty][2]) == 0) {
            this.pathfinding();
        }
        this.speed++;
    }

    //Checks for collisions by comparing the distance between their respective vectors with a fixed value.
    checkCollisions() {
        //Checks for collisions between player and enemy.
        if (p5.Vector.dist(this.position, player.position) < 30) { 
            healthBar.adjustHealth("minus", 1);
        } 
        //Checks for collisions between player projectiles and enemy.
        for (var i = 0; i < player.projectileList.length; i++) {
            if (p5.Vector.dist(this.position, player.projectileList[i].position) < 10 && this.damageCooldown <= 0) {
                this.health -= player.projectileList[i].damage;
                statsTracker.damageDealt += player.projectileList[i].damage;
                this.damageCooldown = 10;
                //Handle enemy death.
                if (this.health <= 0) {
                    //Add chance of dropping health, maxHealth or weapon rarity increase on death.
                    if (random(1) < 0.5) { 
                        this.currentNode.healthPickup = true;
                    } else if (random(1) > 0.5) {
                        if (random(1) > 0.5) {
                            this.currentNode.weaponRarityPickup = true;
                        } else {
                            this.currentNode.maxHealthPickup = true;
                        }
                    }
                    enemyArray.splice(this.arrayPosition, 1);
                    statsTracker.enemiesKilled++;
                    deathSound.play();   
                }
            } 
        }
        //Causes red flash when the enemy takes damage.
        if (this.damageCooldown >= 0) {
            this.fill = '#C9415F';
        } else {
            this.fill = '#F16566';
        }
        this.damageCooldown--;
    }

    //Draw the enemy object to canvas. 
    draw() {
        push();
            translate(this.x, this.y, this.z);
            fill(this.fill);
            box(20, 50, 20);
        pop();
        
        /*
        for (var i = 0; i < this.closedSet.length; i++) { //Colours nodes of closed set.
            this.closedSet[i].show(color(255, 0, 0));
        }
        for (var i = 0; i < this.openSet.length; i++) { //Colours nodes of open set.
            this.openSet[i].show(color(0, 255, 0));
        }
        for (var i = 0; i < this.path.length; i++) { //Colours nodes of path set.
            this.path[i].show(color(0, 0, 255));
        }
        */
    }

    //Resets attributes to match their initial values.
    setDefaults(x, y, z, health) {
        this.x = x;
        this.y = y;
        this.z = z;

        //Pathfinding attributes.
        this.openSet = [startNode];
        this.closedSet = []; //Nodes already checked.
        this.path = []
        this.currentNode = []

        this.movement = (30 * scalarDifficulty[difficulty][2]) - 1;
        this.speed = 0;
        this.pathfind = true;

        this.health = health;
    }
}

