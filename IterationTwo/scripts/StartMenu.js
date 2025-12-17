/*Created by: Charlie Simpkins
Last updated: 02-10-2025 */

class StartMenu {
    constructor() {
        this.pillars = [];
        this.menuPillar1 = new MenuPillar(500, 500, -800, 0, '#ff6380ff');
        this.menuPillar2 = new MenuPillar(-150, -600, 700, 1, '#ff7991ff');
        this.menuPillar3 = new MenuPillar(-200, -500, -900, 2, '#ff6b86ff');
        this.menuPillar4 = new MenuPillar(-500, 400, -600, 3, '#ff889eff');
        this.menuPillar5 = new MenuPillar(270, 1000, 500, 4, '#ff5c7aff');
        /*
        for (var i = 0; i < 4; i++) {
            pillar = new MenuPillar(270, 1000, 500, 4, '#ff5c7aff');
            this.pillars.push(pillar);
        }
        */
        this.angle = 0;
    }
    //Draw summary menu object to canvas. 
    draw() {
        noStroke();
        //Create background plane.
        push(); 
            fill('#C9415F');
            translate(0, 0, -500);
            plane(windowWidth, windowHeight); //Scales to window size.
        pop();
        //Create text background.
        push();
            translate(0, -270, 0);
            stroke('#180832');
            fill('#F16566');
            rotateZ(-150 / 600);   
            if (this.angle % 200 > 100) {
                rotateZ((this.angle % 200) / 600);
            } else {
                rotateZ((200 -this.angle % 200) / 600);   
            }
            this.angle++;
            plane(1400, 370); //Scales to window size.
        pop();
        //Create title text.
        push();
            textFont(titleFont);
            textSize(300);
            textAlign(CENTER, CENTER);
            translate(0, -300, 200);
            rotateZ(-150 / 600);   
            if (this.angle * 0.99 % 200 > 100) {
                rotateZ((this.angle * 0.99 % 200) / 600);
            } else {
                rotateZ((200 -this.angle * 0.99 % 200) / 600);   
            }
            this.angle++;
            stroke('#180832');
            fill('#FFF5F1');
            text('roguelike', 0, 0);
        pop();


        this.menuPillar1.draw();
        this.menuPillar2.draw();
        this.menuPillar3.draw();
        this.menuPillar4.draw();
        this.menuPillar5.draw();

        //Draw settings menu.
        if (settingsMenu.active) {
            settingsMenu.draw();
        }
    }
}
class MenuPillar {
    constructor(height, variance, rotation, position, colour) {
        this.height = height;
        this.variance = variance;
        this.maxVariance = variance;
        this.rotation = rotation;
        this.position = position;
        this.growth = true;
        this.colour = colour;
    }  

    draw() {
        push();
            stroke('#180832');
            fill(this.colour);
            translate(windowWidth/5 * this.position - windowWidth/2 + windowWidth/10, windowWidth/5, -200);
            rotateY(frameCount / this.rotation);
            //Toggles between increasing and decreasing variance from starting position.
            if (this.variance == 0 || this.variance == this.maxVariance) {
                this.growth = !this.growth;
            } 
            if (this.maxVariance > 0) {
                if (this.growth == true) {
                    this.variance += 2;
                } else {
                    this.variance -= 2;
                }
            } else {
                if (this.growth == true) {
                    this.variance -= 2;
                } else {
                    this.variance += 2;
                }      
            }
            translate(0, this.variance, 0);
            box(200, windowHeight + this.height, 200);    
        pop();
    }
}

class Button {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = 1;
        this.rotate = false;
    }

    detectCursor() {
        this.scale = 1;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.5;
            console.log("hover");
            if (click) {
                console.log("click");
                click = false;  
            }
        }
        click = false;  
    }

    draw() {
        push(); 
            texture(button);
            translate(-90, windowHeight/9, 0);
            plane(this.width * this.scale, this.height * this.scale); 
        pop();   
    }
}

class PlayButton extends Button {
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
                startGame();    

                playing = true;
                click = false;  
            }
        }
    }

    draw() {
        push(); 
            texture(playButtonImage);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 0);
            if (this.rotate) {
                rotateX(100);
            }
            plane(this.width * this.scale, this.height * this.scale); 
        pop();   
    }
}

class SettingsMenu {
    constructor() {
        this.active = false;

        this.angle = 0;
    }
    //Draw summary menu object to canvas. 
    draw() {
        noStroke();
        push(); //Convert to 3D horizontal plane.
            fill('#FC9EB0');
            stroke('#180832');
            translate(0, 0, 200);
            plane(4 * windowWidth/5, 4 * windowHeight/5); //Scales cells to window size.
        pop();
    }
}

class SettingsButton extends Button {
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
                settingsMenu.active = !settingsMenu.active;
                click = false;  
            }
        }
    }

    draw() {
        push(); 
            texture(settingsButtonImage);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 0);
            if (this.rotate) {
                rotateX(100);
            }
            plane(this.width * this.scale, this.height * this.scale); 
        pop();   
    }
}

class SoundButton extends Button {
    constructor(x, y, width, height) {
        super(x, y, width, height, scale, rotate);
        this.sprite = soundButtonImage;
    }

    detectCursor() {
        this.scale = 1;
        this.rotate = false;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.1; //Adds responsiveness to hover.
            this.rotate = true;
            if (click) {
                //Toggle button texture on click.
                if (this.sprite == soundButtonImage) {
                    this.sprite = muteButtonImage;
                } else {
                    this.sprite = soundButtonImage;
                }
                click = false;  
            }
        }
    }

    draw() {
        push(); 
            texture(this.sprite);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 0);
            if (this.rotate) {
                rotateX(100);
            }
            plane(this.width * this.scale, this.height * this.scale); 
        pop();   
    }
}



