/*Created by: Charlie Simpkins
05-10-2025: Added main menu.
06-10-2025: Created button class and subclasses.
15-10-2025: Menu aesthetic overhall including pillars and new button sprites.
04-11-2025: Added diificulty settings to menu.
            Added sound effects and sound button functionality.
03-12-2025: Option to toggle tutorial in settings menu.
            Added inline comments to all classes.
Last updated: 03-12-2025 */

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
    //Draw the summary menu object to canvas. 
    draw() {
        noStroke();
        //Create a background plane.
        push(); 
            fill('#C9415F');
            translate(0, 0, -500);
            plane(windowWidth, windowHeight); //Scales to window size.
        pop();
        //Create a background for the title text.
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

        //Create all menu pillar objects.
        this.menuPillar1.draw();
        this.menuPillar2.draw();
        this.menuPillar3.draw();
        this.menuPillar4.draw();
        this.menuPillar5.draw();

        //Draw the settings menu.
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
    //Draws menu pillar objects to canvas.
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
            //Moves the pillars with respect to their variance.
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
    //Detect whenever the user's cursor is hovering over the button sprite.
    detectCursor() {
        this.scale = 1;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.5;
            console.log("hover");
            if (click) {
                console.log("click"); //Foundation for a function to be called when the button is clicked.
                selectionSound.play();
                click = false;  
            }
        }
        click = false;  
    }
    //Draws the button to canvas.
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
    //Detect whenever the user's cursor is hovering over the button sprite.
    detectCursor() {
        this.scale = 1;
        this.rotate = false;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.1; //Adds responsiveness to hover.
            this.rotate = true;
            if (click) {
                startGame(); //Starts the game whenever the button is clicked.
                activateSound.play();
                playing = true;
                click = false;  
            }
        }
    }
    //Draws the button to canvas.
    draw() {
        push(); 
            texture(playButtonImage);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 0);
            //Adds responsiveness to hover.
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
    //Draw the summary menu object to canvas. 
    draw() {
        noStroke(); 
        push(); //Convert to 3D horizontal plane.
            fill('#FC9EB0');
            stroke('#180832');
            translate(0, 0, 200);
            plane(4 * windowWidth/5, 4 * windowHeight/5); //Scales cells to window size.
        pop();
        
        //Create settings menu title text.
        push();
            textFont(titleFont);
            textSize(300);
            textAlign(CENTER, CENTER);
            translate(0, -300, 200);
            stroke('#180832');
            fill('#FFF5F1');
            text('settings', 0, 0);    
        pop();
        //Draws checkbox for toggling tutorial to canvas.
        tutorialCheckbox.draw();
        tutorialCheckbox.detectCursor();
        //Draws all difficulty option buttons to canvas.
        easyDifficultyButton.draw(easyDifficultyButtonImage, 0);
        easyDifficultyButton.detectCursor(0);
        normalDifficultyButton.draw(normalDifficultyButtonImage, 1);
        normalDifficultyButton.detectCursor(1);
        hardDifficultyButton.draw(hardDifficultyButtonImage, 2);
        hardDifficultyButton.detectCursor(2);
        //Draws the exit button to canvas to allow the player to close the settings menu.
        exitButton.draw();
        exitButton.detectCursor();
    }
}

class Checkbox extends Button {
    constructor(x, y, width, height) {
        super(x, y, width, height, scale, rotate);
        this.sprite = checkboxEmptyImage;
    }
    //Detect whenever the user's cursor is hovering over the checkbox sprite.
    detectCursor() {
        this.scale = 1;
        this.rotate = false;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.1; //Adds responsiveness to hover.
            this.rotate = true;
            if (click) {
                //Toggle checkbox texture and tutorial on click.
                if (this.sprite == checkboxFullImage) {
                    deactivateSound.play();
                    this.sprite = checkboxEmptyImage;
                    tutorial.tutorialActive = false;
                    tutorial.tutorialStage = 6;
                } else {
                    this.sprite = checkboxFullImage;
                    tutorial.tutorialActive = true;
                    tutorial.tutorialStage = 1;
                    activateSound.play();
                }
                click = false;  
            }
        }
    }
    //Draws the checkbox to canvas.
    draw() {
        if (tutorial.tutorialActive) {
            this.sprite = checkboxFullImage;
        } else {
            this.sprite = checkboxEmptyImage;
        }
        push(); 
            texture(this.sprite);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 300);
            //Adds responsiveness to hover.
            if (this.rotate) {
                rotateX(100);
            }
            plane(this.width * this.scale, this.height * this.scale); 
        pop();   
        //Create tutorial checkbox text.
        push();
            textFont(pixelFont);
            textSize(60);
            textAlign(CENTER, CENTER);
            translate(-110, -25, 300);
            stroke('#180832');
            fill('#FFF5F1');
            text('Tutorial Active:', 0, 0);    
        pop();
    }
}

class DifficultyButton extends Button {
    constructor(x, y, width, height) {
        super(x, y, width, height, scale, rotate);
    }
    //Detect whenever the user's cursor is hovering over the button sprite.
    detectCursor(difficultyType) {
        this.scale = 1;
        this.rotate = false;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.1; //Adds responsiveness to hover.
            this.rotate = true;
            if (click) {
                difficulty = difficultyType;
                selectionSound.play();
                newRoom(); //Create new room with adjustments relevant to new difficulty setting.
                click = false;  
            }
        }
    }
    //Draws the button to canvas with different sprites depending on parameters.
    draw(sprite, difficultyType) {
        push(); 
            texture(sprite);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 300);
            //Adds responsiveness to hover.
            if (this.rotate) {
                rotateX(100);
            }
            if (difficultyType == difficulty) {
                this.scale = 1.1;
                this.rotate = true;
            }
            plane(this.width * this.scale, this.height * this.scale); 
        pop();   
    }
}

class ExitButton extends Button {
    constructor(x, y, width, height) {
        super(x, y, width, height, scale, rotate);
    }
    //Detect whenever the user's cursor is hovering over the button sprite.
    detectCursor() {
        this.scale = 1;
        this.rotate = false;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.1; //Adds responsiveness to hover.
            this.rotate = true;
            if (click) {
                selectionSound.play();
                settingsMenu.active = !settingsMenu.active; //Closes the settings menu.
                click = false;  
            }
        }
    }
    //Draws the button to canvas.
    draw() {
        push(); 
            texture(exitButtonImage);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 300);
            //Adds responsiveness to hover.
            if (this.rotate) {
                rotateX(100);
            }
            plane(this.width * this.scale, this.height * this.scale); 
        pop();   
    }
}

class SettingsButton extends Button {
    constructor(x, y, width, height) {
        super(x, y, width, height, scale, rotate);
    }
    //Detect whenever the user's cursor is hovering over the button sprite.
    detectCursor() {
        this.scale = 1;
        this.rotate = false;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.1; //Adds responsiveness to hover.
            this.rotate = true;
            if (click) {
                selectionSound.play();
                settingsMenu.active = !settingsMenu.active; //Opens the settings menu.
                click = false;  
            }
        }
    }
    //Draws the button to canvas.
    draw() {
        push(); 
            texture(settingsButtonImage);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 0);
            //Adds responsiveness to hover.
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
    //Detect whenever the user's cursor is hovering over the button sprite.
    detectCursor() {
        this.scale = 1;
        this.rotate = false;
        if (mouseX >= (this.x - this.width/2) && mouseX <= (this.x + this.width/2) && mouseY >= (this.y - this.height/2) && mouseY <= (this.y + this.height/2)) {
            this.scale = 1.1; //Adds responsiveness to hover.
            this.rotate = true;
            if (click) {
                //Toggle button texture on click.
                if (this.sprite == soundButtonImage) {
                    deactivateSound.play();
                    this.sprite = muteButtonImage;
                    outputVolume(0);
                } else {
                    this.sprite = soundButtonImage;
                    outputVolume(1);
                    activateSound.play();
                }
                click = false;  
            }
        }
    }
    //Draws the button to canvas.
    draw() {
        push(); 
            texture(this.sprite);
            translate(this.x - windowWidth/2, this.y - windowHeight/2, 0);
            //Adds responsiveness to hover.
            if (this.rotate) {
                rotateX(100);
            }
            plane(this.width * this.scale, this.height * this.scale); 
        pop();   
    }
}

