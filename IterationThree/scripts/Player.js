/*Created by: Charlie Simpkins
25-08-2025: Created base class and movement methods.
            Updated movement to support diagonal directions.
15-09-2025: Added validation to movement with respect to wall nodes.
            Collision checks with coins to enable them to be picked up.
04-10-2025: Support for projectiles genearted by the weapon class.
            Added the ability() method.
04-11-2025: Added validation to the enemy pathfinding call to ensure that the tutorial is not currently active.
30-11-2025: Support within the collectible pickup collision logic for health pickups and weapon upgrades.
            Sound effects on ability use and collectible pickup implemented.
03-12-2025: Added inline comments to all classes.
            Added collision logic for maxHealth and weapon rarity upgrades.
            Added more statistics tracked and randomised showcase on draw().
Last updated: 03-12-2025 */

var playerNode;
class Player {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = 5;
        this.position = createVector(this.x, this.y, this.z);

        this.mvmt = createVector(0, 0, 0);
        this.lastMvmt = createVector(1, 0, 0);
        
        this.projectileList = [];
        this.weaponCooldown = 10;
    }
    //Updates position based on the movement key pressed.
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
            collectibleSound.play();
            collectibleCounter.coins++;
            statsTracker.coinsCollected++;
            grid[playerNode.i][playerNode.j].coin = false;
        } else if (grid[playerNode.i][playerNode.j].weaponUpgrade) { //Collects weapon upgrades on current node.
            collectibleSound.play();
            weapon.level++;
            weapon.setLevel();
            grid[playerNode.i][playerNode.j].weaponUpgrade = false;
        } else if (grid[playerNode.i][playerNode.j].healthPickup) { //Collects health pickups on current node.
            collectibleSound.play();
            healthBar.adjustHealth("plus", 1);
            grid[playerNode.i][playerNode.j].healthPickup = false;
       } else if (grid[playerNode.i][playerNode.j].maxHealthPickup) { //Collects maxHealth pickups on current node.
            collectibleSound.play();
            healthBar.maxHealth++;
            grid[playerNode.i][playerNode.j].maxHealthPickup = false;
       } else if (grid[playerNode.i][playerNode.j].weaponRarityPickup) { //Collects weapon rarity pickups on current node.
            collectibleSound.play();
            weapon.rarity++;
            grid[playerNode.i][playerNode.j].weaponRarityPickup = false;
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
        //Fast pathfinding system to track enemy movement to player on player input.
        if (movement && tutorial.tutorialStage > 3) { //Checks that an enemy is active by ensuring that the start of the tutorial has been completed.
            for (var i = 0; i < enemyArray.length; i++) { 
                enemyArray[i].resetPathfind(); 
            }
        }    

      //Changes the magnitude of the change in position relative to speed.
      this.mvmt.setMag(this.speed);

      this.x += this.mvmt.x; //Sets new position.
      this.z += this.mvmt.z;

      //Updates the position vector.
      this.position.set(this.x, 0, this.z);
    }

    //Getter and setter methods for components of the position vector.
    getPosition() {
        return this.position;
    }
    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    //Creates projectiles in the direction of the player's last movement when the ability key is pressed.
    ability() {
        if (!this.mvmt.equals(0, 0, 0)) { //Locks direction of projectile to the last movement direction of the player.
            this.lastMvmt = this.mvmt;
        }
        if (this.weaponCooldown <= 0) {
            if (keyIsDown(69) === true) { //Shoots projectile if the weapon cooldown is zero and the ability key is pressed.
                var projectile = new BasicProjectile(this.x, this.y, this.z, this.lastMvmt);
                this.projectileList.push(projectile);
                this.weaponCooldown = 10;
                shootSound.play();
            } 
        }
        //Draws all projectiles to canvas.
        for (var i = 0; i < this.projectileList.length; i++) {
            this.projectileList[i].draw();
        }
        this.weaponCooldown--;
    }
    //Draws the player object to canvas.
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
        this.damageDealt = 0;
        this.damageReceived = 0;
        this.enemiesKilled = 0;

        this.tracked = ["rooms explored: " + this.roomsExplored, "coins collected: " + this.coinsCollected, "weapon rarity: " + weapon.rarity, "damage dealt: " + this.damageDealt, "damage received: " + this.damageReceived, "enemies killed: " + this.enemiesKilled, "maximum health: " + healthBar.maxHealth];
        this.trackedIndex = [];
        this.angle = 0;
    }

    draw() {
        noStroke();
        //Choose statistics to be displayed.
        if (this.trackedIndex.length == 0) {
            this.chooseDisplay();
        }
        //Create statistic tracker text.
        push();
            textFont(pixelFont);
            textSize(60);
            textAlign(CENTER, CENTER);
            translate(0, -100, 200);
            rotateZ(-25 / 600); //Rotates all text elements between two set values.
            if (this.angle % 50 > 25) {
                rotateZ((this.angle % 50) / 600);
            } else {
                rotateZ((50 -this.angle % 50) / 600);   
            }
            this.angle++;
            fill('#FFF5F1');

            //Draws statistics summaries to canvas.
            for(var i = 0; i < 3; i++) {
                text(this.tracked[this.trackedIndex[i]], 0, 0);
                translate(0, 100, 0);
            }
        pop(); 
    }
    //Resets all tracking attributes to their default values.
    reset() {
        this.roomsExplored = 1;    
        this.coinsCollected = 0;  
        this.damageDealt = 0;
        this.damageReceived = 0;
        this.enemiesKilled = 0;

        this.trackedIndex = [];
    }
    //Choose statistics to be displayed.
    chooseDisplay() {
        this.tracked = ["rooms explored: " + this.roomsExplored, "coins collected: " + this.coinsCollected, "weapon rarity: " + weapon.rarity, "damage dealt: " + this.damageDealt, "damage received: " + this.damageReceived, "enemies killed: " + this.enemiesKilled, "maximum health: " + healthBar.maxHealth];
        for (var i = 0; i < 3; i++) {
            let index;
            while (true) { //Validate that no repeat values are shown.
                index = floor(random(this.tracked.length - 1));
                if (!this.trackedIndex.includes(index)) {
                    break;
                }
            }
            this.trackedIndex.push(index);
            console.log(this.trackedIndex);
        }
    }
}