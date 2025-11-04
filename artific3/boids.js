let img;
let y = 0;
let w = innerWidth;
let h = innerHeight;
let randomNum = Math.random() * 100;
let seed = randomNum;
let angle1 = 0;
let spinSpeed = 1 + Math.random() * 100;

let mouseMovedYet = false;
let defaultX = w - w / 4;
let defaultY = h - h / 4;

// Boids globals
let boids = [];
const NUM_BOIDS = 60;
const BOID_MAX_SPEED = 3;
const BOID_PERCEPTION = 20;

function setup() {
  createCanvas(w, h);
  pixelDensity(1);
  img = createImage(w, h);
  img.loadPixels();
  background(0);

  for (let i = 0; i < NUM_BOIDS; i++) {
    boids.push(new Boid(random(width), random(height)));
  }
}

function draw() {
  let xPos, yPos;
  if (!mouseMovedYet) {
    xPos = defaultX;
    yPos = defaultY;
  } else {
    xPos = mouseX;
    yPos = mouseY;
  }

  // --- DRAW ROTATING PATTERN ---
  push(); // isolate transformations
  translate(
    w / 2 + map(xPos, 0, w, -w / 2, w / 2),
    h / 2 + map(yPos, 0, h, -h / 2, h / 2)
  );

  angle1 += spinSpeed;

  if (y <= h) {
    img.loadPixels();
    let mod1 = sin(frameCount * 0.01) + seed / 50;
    for (let x = 0; x < w; x++) {
      let val = 255 * (mod1 / 100 + 0.5 * sin(x * mod1) * cos(y * mod1 / 100));
      let index = (x + y * w) * 10;
      img.pixels[index + 0] = val;
      img.pixels[index + 1] = val;
      img.pixels[index + 2] = val;
      img.pixels[index + 3] = 255;
    }
    y += 4;
    img.updatePixels();
  }

  rotate(angle1);
  image(img, 0, 0);
  pop(); // 🔹 restore to global coordinate space

  // --- DRAW BOIDS (not affected by rotation or translate) ---
  drawBoids();
}


// --- Boid system ---
class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }

  align(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < BOID_PERCEPTION) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(BOID_MAX_SPEED);
      steering.sub(this.velocity);
      steering.limit(0.05);
    }
    return steering;
  }

  cohesion(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < BOID_PERCEPTION) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(BOID_MAX_SPEED);
      steering.sub(this.velocity);
      steering.limit(0.05);
    }
    return steering;
  }

  separation(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < BOID_PERCEPTION / 2) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d); // linear falloff, not quadratic
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(BOID_MAX_SPEED);
      steering.sub(this.velocity);
      steering.limit(0.1);
    }
    return steering;
  }

  // 🧲 attraction to mouse (or default point)
  attractTo(targetX, targetY) {
    let target = createVector(targetX, targetY);
    let force = p5.Vector.sub(target, this.position);
    let distance = force.mag();
    distance = constrain(distance, 10, 300); // don't pull too hard when close
    force.setMag(0.5 / distance); // weaker farther away
    return force;
  }


  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    let attractX = mouseMovedYet ? mouseX : defaultX;
    let attractY = mouseMovedYet ? mouseY : defaultY;
    let attraction = this.attractTo(attractX, attractY);
    attraction.setMag(0.05); // gentle attraction

    // combine forces with weighting
    this.acceleration.add(alignment.mult(1.0));
    this.acceleration.add(cohesion.mult(0.8));
    this.acceleration.add(separation.mult(0.6));
    this.acceleration.add(attraction.mult(1.3));
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(BOID_MAX_SPEED);
    this.acceleration.mult(0);
  }

  show() {
    push();
    stroke(255);
    strokeWeight(0.5);
    fill(0, 150 , 200, 100);
    noStroke();
    let angle = this.velocity.heading();
    translate(this.position.x, this.position.y);
    rotate(angle);
    // triangle(0, -5, -10, 5, 10, 5);
    circle(0,0,5);
    pop();
  }
}

function drawBoids() {
  for (let boid of boids) {
    boid.edges();
    boid.flock(boids);
    boid.update();
    boid.show();
  }
}

// --- Detect user input ---
function mouseMoved() {
  mouseMovedYet = true;
}
function mousePressed() {
  mouseMovedYet = true;
}

// --- Auto resize canvas ---
function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
  img = createImage(w, h);
  y = 0;
  background(0);

  defaultX = w / 4;
  defaultY = h / 4;

  boids = [];
  for (let i = 0; i < NUM_BOIDS; i++) {
    boids.push(new Boid(random(width), random(height)));
  }
}
