/*Created by: Charlie Simpkins
Last updated: 02-10-2025 */

class SummaryMenu {
    constructor() {
        this.angle = 0;
    }
    //Draw summary menu object to canvas. 
    draw() {
        noStroke();
        push(); //Convert to 3D horizontal plane.
            fill('#FC9EB0');
            translate(0, 0, -500);
            plane(windowWidth, windowHeight); //Scales cells to window size.
        pop();
        //Create spinning text.
        push();
            textFont(titleFont);
            textSize(150);
            textAlign(CENTER, CENTER);
            translate(0, -300, 200);
            rotateZ(-25 / 600);   
            if (this.angle % 50 > 25) {
                rotateZ((this.angle % 50) / 600);
            } else {
                rotateZ((50 -this.angle % 50) / 600);   
            }
            this.angle++;
            stroke('#180832');
            fill('#FFF5F1');
            text('game over', 0, 0);
        pop(); 
    }
}

class RestartButton extends Button {
    constructor(x, y, width, height) {
        super(x, y, width, height, scale, rotate);
    }

    detectCursor() {
        this.scale = 1;
        this.rotate = false;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.1; //Adds responsiveness to hover.   
            this.rotate = true;         
            if (click) {
                healthBar.health = healthBar.maxHealth; //Prompts switch to start menu.
                newRoom();
                click = false;  
            }
        }
    }

    draw() {
        push(); 
            texture(replayButtonImage);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 0);
            if (this.rotate) {
                rotateX(100);
            }
            plane(this.width * this.scale, this.height * this.scale); 
        pop();  
    }
}

