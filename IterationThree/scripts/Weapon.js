/*Created by: Charlie Simpkins
04-10-2025: Created weapon class and drawIcon() method.
            Implemented projectiles.
30-11-2025: Sound effect on weapon use implemented.
            Weapon now speed scales with difficulty.
01-12-2025: Added weapon levels, damage scaling and projectile colours.
            Changed weapon user interface sprite to match rarity tint.
03-12-2025: Added weapon rarities.
            Updated inline comments.
            Removed tint from weapon sprite; added rarity indicator.
11-12-2025: Added different weapon sprites for each rarity.
Last updated: 11-12-2025 */

class Weapon {
    constructor(fireRate, colour, damage, level) {
        this.fireRate = fireRate;
        this.colour = colour;
        this.damage = damage;
        this.level = level;
        this.rarity = floor(this.level/5);
        this.colourVariations = ["red", "orange", "yellow", "green", "blue", "purple", "black"];
        this.gunTexture = gunTypes[this.rarity];
    }
    //Draws weapon user interface to canvas.
    drawIcon() {
        //Create weapon sprite display.
        push(); 
            noStroke();
            if (this.rarity < this.colourVariations.length) {
                this.gunTexture = gunTypes[this.rarity];
            } else {
                if (random(1) < 0.3) {
                    this.gunTexture = gunTypes[floor(random(7))];
                }
            }
            texture(this.gunTexture);
            translate(2 * windowWidth/7, -2 * windowHeight/5, -2 * windowWidth/7); //Adjustments to allow for orthographic drawing style.
            rotate(QUARTER_PI, [0, 1, 0]);
            plane(400, 480); 
        pop();
        //Create weapon rarity indicator.
        push(); 
            noStroke();
            //Change tint to match rarity.
            if (this.rarity < this.colourVariations.length) {
                this.colour = this.colourVariations[weapon.rarity];
            } else {
                this.colour = this.colourVariations[floor(random(5))];
            }
            texture(rarityImage);
            tint(this.colour);
            translate(2 * windowWidth/7 - 130, -2 * windowHeight/5 - 60, -2 * windowWidth/7 + 200); //Adjustments to allow for orthographic drawing style.
            rotate(QUARTER_PI, [0, 1, 0]);
            plane(50, 60); 
        pop();
        //Create level display text.
        push();
            textFont(pixelFont);
            textSize(40);
            translate(2 * windowWidth/7 - 390, -2 * windowHeight/5, -2 * windowWidth/7 + 390); //Adjustments to allow for orthographic drawing style.
            rotate(QUARTER_PI, [0, 1, 0]);
            stroke('#180832');
            fill('#FFF5F1');
            text("Level: " + this.level , 0, 0);
        pop(); 
    }  
    //Sets the weapon's damage and rarity to scale with its level attribute.
    setLevel() {
        this.damage = this.level;
        if (this.rarity < floor(this.level/5)) {
            this.rarity = floor(this.level/5);
        }
    }
}

class BasicProjectile {
    constructor(x, y, z, direction) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.position = createVector(this.x, this.y, this.z);
        this.direction = direction;
        this.damage = weapon.damage;

        this.colour = weapon.colour
        this.colourVariations = ["red", "orange", "yellow", "green", "blue", "purple", "black"];

        this.speed = 10 * scalarDifficulty[difficulty][5];
    }

    draw() {
        this.direction.setMag(this.speed); //Sets the speed of the projectile's movement vector.
        this.x += this.direction.x;
        this.z += this.direction.z;
        this.position.set(this.x, this.y, this.z);
        //Changes projectile colours depending on weapon rarity.
        if (weapon.rarity < this.colourVariations.length) { 
            this.colour = this.colourVariations[weapon.rarity];
        } else {
            this.colour = this.colourVariations[floor(random(5))];
        }
        //Draws projectile to canvas.
        push();
            translate(this.x, this.y, this.z)
            fill(this.colour);
            box(10, 10, 10);
        pop();
    }
}


