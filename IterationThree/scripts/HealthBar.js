/*Created by: Charlie Simpkins
02-09-2025: Created health bar class and methods.
            Added logic to remove hearts when the player loses health.
05-09-2025: Added visual cosmetic shaders and camera roll on health reduction.
15-09-2025: Created collectible counter class to display coins.
30-11-2025: Sound effect on player losing health implemented.
03-12-2025: Updated inline comments.
            Added damage scaling with dungeon level.
            Added tracking for damage received in stats tracker.
Last updated: 03-12-2025 */

class HealthBar {
    constructor(maxHealth) {
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.damageCooldown = 0;
    }

    //Draw Health bar icons.
    draw() {
        for (var i = 0; i < this.maxHealth; i++) { //Draws number of hearts equal to maxHealth.
            push(); 
            noStroke();
            //Draws hearts or empty hearts depending on player's current health.
            if (i < this.health) {
                texture(heart);
            } else {
                texture(emptyHeart);
            }
            translate(-windowWidth * 0.65 + i * 150, windowHeight * 0.08 - i * 75, 0); //Adjustments to allow for orthographic drawing style.
            rotate(QUARTER_PI, [0, 1, 0]);
            plane(100, 120); 
            pop();
        }
    }
    //Adjust health bar to add or remove empty hearts.
    adjustHealth(type, amount) {
        if (type == "minus") { //Decreases player health.
            if (this.damageCooldown <= 0) { //Add cooldown before more damage can be taken.
                this.health -= amount * scalarDifficulty[difficulty][3] * floor(dungeonLevel/3);
                statsTracker.damageReceived += amount * scalarDifficulty[difficulty][3] * floor(dungeonLevel/3);
                damageSound.play();
                this.damageCooldown = 30
                //Visual indicator of damage.
                cameraRoll += 0.1;
                mainCamera.roll(0.1);
                if (this.health <= 0) { //Check for player death.
                    this.health = 0;
                    playing = false; //Stop playing game.
                }
            } else if (this.damageCooldown >= 20) {
                //Adds distortion filter on damage taken.
                filter(displaceColors);
            }

        } else { //Increase player health.
            this.health += amount;
            if (this.health > this.maxHealth) { //Validation check to not exceed maximum health.
                this.health = this.maxHealth;
            }
        }
    }
}

class CollectibleCounter {
    constructor() {
        this.coins = 0;
    }
    //Draw the coin icon and counter to canvas.
    draw() {
        //Draws the coin user interface sprite to canvas.
        push(); 
            noStroke();
            texture(coinImage);
            translate(-windowWidth * 0.65, windowHeight * 0.08 + 150, 0); //Adjustments to allow for orthographic drawing style.
            rotate(QUARTER_PI, [0, 1, 0]);
            plane(100, 120); 
        pop();
        //Create text to display the current amount of coins that the player has.
        push();
            textFont(pixelFont);
            textSize(60);
            translate(-windowWidth * 0.65 + 100, windowHeight * 0.08 + 140, 0); //Adjustments to allow for orthographic drawing style.
            rotate(QUARTER_PI, [0, 1, 0]);
            stroke('#180832');
            fill('#FFF5F1');
            text(this.coins, 0, 0);
        pop(); 
    }
}
