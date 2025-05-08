let mainCamera;
let mapGeometry;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    //Instantiate camera.
    mainCamera = createCamera();

    //Collision geometry.
}

//Player class.
class Player {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = 5;
    }
    //Updates position based on movement key pressed.
    updatePosition() {
      let mvmt = createVector(0, 0, 0);
      //Support for player keyboard inputs.
      if(keyIsDown(65) === true) {
        if (this.x >= -240) {
            mvmt.x -= 1;
        }
      }
      if(keyIsDown(68) === true) {
        if (this.x <= 300) {
            mvmt.x += 1;
        }
      }
      if(keyIsDown(87) === true) {
        if (this.z >= -270) {
            mvmt.z -= 1;
        }
      }
      if(keyIsDown(83) === true) {
        if (this.z <= 270) {
            mvmt.z += 1;
        }
      }

      //Changes the magnitude of the change in position relative to speed.
      mvmt.setMag(this.speed);

      this.x += mvmt.x; //Sets new position.
      this. z += mvmt.z;
    }

    //Draw player object to canvas.
    draw() {
        push();
        translate(this.x, this.y, this.z);
        fill(0, 0, 255);
        box(50, 100, 50);
        pop();
    }
}

class Enemy {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    //Updates position based on movement key pressed.
    updatePosition() {
      let mvmt = createVector(0, 0, 0);

      this.x += mvmt.x; //Sets new position.
      this. z += mvmt.z;
    }

    //Draw player object to canvas.
    draw() {
        push();
        translate(this.x, this.y, this.z);
        fill(255, 0, 0);
        box(50, 100, 50);
        pop();
    }

}

//Create objects.
player = new Player(0, -60, 0);
enemy = new Enemy(100, -59, 0);

function draw() {
    background(200);

    //Camera control.
    mainCamera.lookAt(0, 0, 0);
    mainCamera.setPosition(290, -290, 290);
    orbitControl(1, 0, 1); //Limited camera control with the mouse on the x and z axis.

    //Map
    beginGeometry();
    push();
    translate(30, 0, 0);
    box(600, 20, 600);
    pop();
    mapGeometry = endGeometry();
    mapGeometry.computeNormals();

    // Display the helix.
    model(mapGeometry);

    // Style the normal vectors.
    stroke(255, 0, 0);

    // Iterate over the vertices and vertexNormals arrays.
    for (let i = 0; i < mapGeometry.vertices.length; i += 1) {

        // Get the vertex p5.Vector object.
        let v = mapGeometry.vertices[i];

        // Get the vertex normal p5.Vector object.
        let n = mapGeometry.vertexNormals[i];

        // Calculate a point along the vertex normal.
        let p = p5.Vector.mult(n, 10);

        // Draw the vertex normal as a red line.
        push();
        translate(v);
        line(0, 0, 0, p.x, p.y, p.z);
        pop();
    }

    stroke(0, 0, 0);
    //Player display.
    player.updatePosition();
    player.draw();

    //Enemy display.
    enemy.draw();

    //Styling.
    ortho();
    debugMode()
}