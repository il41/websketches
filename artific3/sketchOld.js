let img;
let y = 0;
let w = innerWidth;
let h = innerHeight;
let randomNum = Math.random() * 100;
let seed = randomNum;
let angle1 = 0;
let spinSpeed = 1 + Math.random() * 100;
// spinSpeed = 92.67;
// spinSpeed = 10.301957481572765;

let mouseMovedYet = false; // track mouse activity
let defaultX = w-(w / 4);      // custom starting origin
let defaultY = h-(h / 4);

function setup() {
  createCanvas(w, h);
  pixelDensity(1);
  img = createImage(w, h);
  img.loadPixels();
  background(0);
  console.log(spinSpeed);
  console.log(seed);
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

  // translate relative to whichever position we're using
  translate(
    w / 2 + map(xPos, 0, w, -w / 2, w / 2),
    h / 2 + map(yPos, 0, h, -h / 2, h / 2)
  );

  angle1 += spinSpeed;

  if (y <= h) {
    img.loadPixels();
    push();
    let mod1 = sin(frameCount * 0.1) + seed / 50;
    let mod2 = cos(frameCount * 0.2) + 2;
    let mod3 = cos(frameCount * 0.3) + 3;
    let mod4 = cos(frameCount * 0.05) + 0.1;
    let mod5 = cos(frameCount * 0.08) + 2;

    for (let x = 0; x < w; x++) {
      let val = 255 * (mod1 / 100 + 0.5 * sin(x * mod1) * cos(y * mod1 / 100));
      let index = (x + y * w) * 4;
      img.pixels[index + 0] = val;
      img.pixels[index + 1] = val;
      img.pixels[index + 2] = val;
      img.pixels[index + 3] = 255;
    }
    y += 4;
  }

  img.updatePixels();
  rotate(angle1);
  image(img, 0, 0);
  pop();
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
  // update globals so mappings and image dimensions stay aligned
  w = windowWidth;
  h = windowHeight;

  resizeCanvas(w, h);
  img = createImage(w, h);
  y = 0;
  background(0);

  // reposition default origin relative to new size
  defaultX = w / 4;
  defaultY = h / 4;
}
