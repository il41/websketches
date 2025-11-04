let img;
let w = innerWidth;
let h = innerHeight;
let randomNum = Math.random() * 100;
let seed = randomNum;
let angle1 = 0;
let spinSpeed = 1 + Math.random() * 100;
spinSpeed = 92.67;

let mouseMovedYet = false;
let defaultX = w - w / 4;
let defaultY = h - h / 4;

function setup() {
  createCanvas(w, h);
  pixelDensity(1);
  img = createImage(w, h);
  background(0);
}

function draw() {
  let xPos = mouseMovedYet ? mouseX : defaultX;
  let yPos = mouseMovedYet ? mouseY : defaultY;

  // --- Animate moiré: generate each frame ---
  generateImageAnimated(frameCount);

  push();
  // If you want rotation and translation, uncomment:
  // translate(
  //   w / 2 + map(xPos, 0, w, -w / 2, w / 2),
  //   h / 2 + map(yPos, 0, h, -h / 2, h / 2)
  // );

  translate(w / 2, h / 2 );

  angle1 += spinSpeed;
  rotate(angle1);

  image(img, 0, 0);
  pop();
}

// --- Animated moiré generation ---
function generateImageAnimated(frameCountSim) {
  img.loadPixels();
  let yStep = 10;
  let yCurrent = 0;

  // slow oscillation factor for stretching
  let osc = 1;
  let osc2 = 1;
  // osc = sin(frameCountSim * 0.01) * 1 + 1; // ranges 0.5–1.5
  // osc2 = sin(frameCountSim * 0.0001) * 1 + 1; // ranges 0.5–1.5

  while (yCurrent < h) {
    let mod1 = (sin(frameCountSim * 0.1) + seed / 50) * osc;
    let mod2 = cos(frameCountSim * 0.2) + 2;
    let mod3 = cos(frameCountSim * 0.3) + 3;
    let mod4 = cos(frameCountSim * 0.05) + 0.1;
    let mod5 = cos(frameCountSim * 0.08) + 2;

    for (let y = yCurrent; y < yCurrent + yStep && y < h; y++) {
      for (let x = 0; x < w; x++) {
        let val = 255 * (mod1 / 100 + 0.5 * sin(x * mod1) * cos(y * mod1 / 100));
        let index = (x + y * w) * 11
        img.pixels[index + 0] = val;
        img.pixels[index + 1] = val;
        img.pixels[index + 2] = val;
        img.pixels[index + 3] = 255;
      }
    }

    yCurrent += yStep;
    frameCountSim++;
  }
  img.updatePixels();
}

// --- Detect user input ---
function mouseMoved() { mouseMovedYet = true; }
function mousePressed() { mouseMovedYet = true; }

// --- Auto resize canvas ---
function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
  defaultX = w / 4;
  defaultY = h / 4;

  img = createImage(w, h);
}
