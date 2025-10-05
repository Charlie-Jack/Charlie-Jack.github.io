/*Created by: Charlie Simpkins
Last updated: 02-10-2025 */

class Weapon {
    constructor(fireRate, projectileColour, damage, level) {
        this.fireRate = fireRate;
        this.projectileColour = projectileColour;
        this.damage = damage;
        this.level = level;
    }

    drawIcon() {
        push(); 
            noStroke();
            texture(defaultWeaponImage);
            translate(2 * windowWidth/7, -2 * windowHeight/5, -2 * windowWidth/7); //Adjustments to allow for orthographic drawing style.
            rotate(QUARTER_PI, [0, 1, 0]);
            plane(400, 480); 
        pop();
        //Create text.
        push();
            textFont(pixelFont);
            textSize(60);
            translate(2 * windowWidth/7 - 350, -2 * windowHeight/5, -2 * windowWidth/7 + 350); //Adjustments to allow for orthographic drawing style.
            rotate(QUARTER_PI, [0, 1, 0]);
            stroke('#180832');
            fill('#FFF5F1');
            text("temp", 0, 0);
        pop(); 
    }  
}

class BasicProjectile {
    constructor(x, y, z, direction) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.position = createVector(this.x, this.y, this.z);
        this.direction = direction;

        this.speed = 10;
    }

    draw() {
        this.direction.setMag(this.speed);
        this.x += this.direction.x;
        this.z += this.direction.z;
        this.position.set(this.x, this.y, this.z);
        push();
            translate(this.x, this.y, this.z)
            fill(weapon.projectileColour);
            box(10, 10, 10);
        pop();
    }
}
