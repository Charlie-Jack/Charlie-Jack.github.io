/*Created by: Charlie Simpkins
Last updated: 02-10-2025 */

//Player class.
var playerNode;
class Player {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = 5;
        this.position = createVector(this.x, this.y, this.z);

        this.mvmt = createVector(0, 0, 0);
        this.lastMvmt = createVector(0, 0, 0);
        
        this.projectileList = [];
        this.weaponCooldown = 10;
    }
    //Updates position based on movement key pressed.
    updatePosition() {
    //Find the current cell that the player is most closely contained within.
        for (var a = 0; a < columns; a++) { 
            for (var b = 0; b < rows; b++) {
                if (grid[a][b].i == round((this.x + 300) / 20) && grid[a][b].j == round((this.z + 300) / 20)) {
                    playerNode = grid[a][b];
                    grid[a][b].show(color(255, 255, 0));
                    endNode = grid[a][b];
                }
            }
        }
        //Checks for collectibles in current node.
        if (grid[playerNode.i][playerNode.j].coin) { //Collects coins on current node.
            collectibleCounter.coins++;
            statsTracker.coinsCollected++;
            grid[playerNode.i][playerNode.j].coin = false;
        }

        this.mvmt = createVector(0, 0, 0);
        let movement = false;

    //Support for player keyboard inputs.  
    //Diagonal movement. 
        if(keyIsDown(65) === true && keyIsDown(87) === true) { //Movement left and up diagonally.
            if (!((Math.ceil(this.x / this.speed) * this.speed) % 20 <= 3 && (grid[playerNode.i - 1][playerNode.j].wall || grid[playerNode.i - 1][playerNode.j - 1].wall || grid[playerNode.i][playerNode.j - 1].wall))) { //Check whether player is in centre of node.
                this.mvmt.x -= 0.7;  
                this.mvmt.z -= 0.7;
                movement = true;
            }
        } else if(keyIsDown(65) === true && keyIsDown(83) === true) { //Movement left and down diagonally.
            if (!((Math.ceil(this.x / this.speed) * this.speed) % 20 <= 3 && (grid[playerNode.i - 1][playerNode.j].wall || grid[playerNode.i - 1][playerNode.j + 1].wall || grid[playerNode.i][playerNode.j + 1].wall))) { //Check whether player is in centre of node.
                this.mvmt.x -= 0.7;  
                this.mvmt.z += 0.7;
                movement = true;
            }
        } else if(keyIsDown(68) === true && keyIsDown(87) === true) { //Movement right and up diagonally.
            if (!((Math.ceil(this.x / this.speed) * this.speed) % 20 <= 3 && (grid[playerNode.i + 1][playerNode.j].wall || grid[playerNode.i + 1][playerNode.j - 1].wall || grid[playerNode.i][playerNode.j - 1].wall))) { //Check whether player is in centre of node.
                this.mvmt.x += 0.7;  
                this.mvmt.z -= 0.7;
                movement = true;
            }
        } else if(keyIsDown(68) === true && keyIsDown(83) === true) { //Movement right and down diagonally.
            if (!((Math.ceil(this.x / this.speed) * this.speed) % 20 <= 3 && (grid[playerNode.i + 1][playerNode.j].wall || grid[playerNode.i + 1][playerNode.j + 1].wall || grid[playerNode.i][playerNode.j + 1].wall))) { //Check whether player is in centre of node.
                this.mvmt.x += 0.7;  
                this.mvmt.z += 0.7;
                movement = true;
            }
        }
    //Orthogonal movement.
        if (!movement) {
        //Movement left.
            if (keyIsDown(65) === true) {
                if (this.x >= -300) { //Validation boundary check for movement left.
                    if (!((Math.ceil(this.x / this.speed) * this.speed) % 20 <= 3 && (grid[playerNode.i - 1][playerNode.j].wall || grid[playerNode.i - 1][playerNode.j + 1].wall || grid[playerNode.i - 1][playerNode.j - 1].wall))) { //Check whether player is in centre of node.
                        this.mvmt.x -= 1;
                        movement = true;
                    }
                }//playerNode.i + 1 != columns || 
            }
            //Movement right.
            if (keyIsDown(68) === true) {
                if (this.x <= 275) { //Validation check for movement right.
                    if (!(((Math.ceil(this.x / this.speed) * this.speed) % 20 <= 3) && (grid[playerNode.i + 1][playerNode.j].wall || grid[playerNode.i + 1][playerNode.j + 1].wall || grid[playerNode.i + 1][playerNode.j - 1].wall))) {
                        this.mvmt.x += 1;
                        movement = true;
                    }
                }
            }
            //Movement forward.
            if (keyIsDown(87) === true) {
                if (this.z >= -300) { //Validation check for movement forward.
                    if (!((Math.ceil(this.z / this.speed) * this.speed) % 20 <= 3 && (grid[playerNode.i][playerNode.j - 1].wall || grid[playerNode.i - 1][playerNode.j - 1].wall || grid[playerNode.i + 1][playerNode.j - 1].wall))){ //Check whether player is in centre of node.
                        this.mvmt.z -= 1;
                        movement = true;
                    }
                } //((playerNode.j != 0) ? grid[playerNode.i][playerNode.j - 1].wall : true)))
            }
            //Movement backwards.
            if (keyIsDown(83) === true) {
                if (this.z <= 275) { //Validation check for movement backwards.
                    if (!((Math.ceil(this.z / this.speed) * this.speed) % 20 <= 3 && (grid[playerNode.i][playerNode.j + 1].wall || grid[playerNode.i - 1][playerNode.j + 1].wall || grid[playerNode.i + 1][playerNode.j + 1].wall))) { //Check whether player is in centre of node.
                        this.mvmt.z += 1;
                        movement = true;     
                    }      
                }
            } 
        }

        if (movement) {
            for (var i = 0; i < enemyArray.length; i++) { //Add cells to rows.
                enemyArray[i].resetPathfind(); 
            }
        }    

      //Changes the magnitude of the change in position relative to speed.
      this.mvmt.setMag(this.speed);

      this.x += this.mvmt.x; //Sets new position.
      this.z += this.mvmt.z;

      //Update position vector.
      this.position.set(this.x, 0, this.z);
    }

    getPosition() {
        return this.position;
    }
    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    ability() {
        if (!this.mvmt.equals(0, 0, 0)) {
            this.lastMvmt = this.mvmt;
        }
        if (this.weaponCooldown <= 0) {
            if (keyIsDown(69) === true) { 
                var projectile = new BasicProjectile(this.x, this.y, this.z, this.lastMvmt);
                this.projectileList.push(projectile);
                this.weaponCooldown = 10;
            } 
        }
        for (var i = 0; i < this.projectileList.length; i++) {
            this.projectileList[i].draw();
        }
        this.weaponCooldown--;
    }

    //Draw player object to canvas.
    draw() {
        push();
          translate(this.x, this.y, this.z);
          fill(255, 255, 0);
          box(20, 50, 20);
        pop();
    }
}

class StatsTracker {
    constructor() {
        this.roomsExplored = 1;
        this.coinsCollected = 0;

        this.angle = 0;
    }

    draw() {
        noStroke();
        //Create text.
        push();
            textFont(pixelFont);
            textSize(60);
            textAlign(CENTER, CENTER);
            translate(0, -100, 200);
            rotateZ(-25 / 600);   
            if (this.angle % 50 > 25) {
                rotateZ((this.angle % 50) / 600);
            } else {
                rotateZ((50 -this.angle % 50) / 600);   
            }
            this.angle++;
            fill('#FFF5F1');
            text("rooms explored: " + this.roomsExplored, 0, 0);
            translate(0, 100, 0);
            text("coins collected: " + this.coinsCollected, 0, 0);
        pop(); 
    }

    reset() {
        this.roomsExplored = 1;    
        this.coinsCollected = 0;  
    }
}