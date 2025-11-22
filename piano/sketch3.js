let noiseLevel = 105;
let noiseScale = 0.005;
let mouseScaleX = 100;
let mouseScaleY = 100;

let offsetX = 1;
let offsetY = 1;
let offsetSpeedX = 100;
let offsetSpeedY = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);

  background(200);

  drawNoise();
  colorMode(HSB);
}

function draw(){
    // noiseScale = map(sin(frameCount/100),0,1,0.001,0.009);
    // mouseScaleX+=0.01;
    // mouseScaleY+=0.01;
    drawNoise();
    

}

function drawNoise(){
      // Set the noise level and scale.
    offsetX +=1 ;
    offsetY +=1 ;

  // Iterate from top to bottom.
  for (let y = 0; y < height; y += 20) {
    // Iterate from left to right.
    for (let x = 0; x < width; x += 20) {
    // Scale the input coordinates.
      let nx = noiseScale * x + mouseX/mouseScaleX;
      let ny = noiseScale * y + mouseY/mouseScaleY;

    // let nx = noiseScale * x + offsetX/offsetSpeedX;
    // let ny = noiseScale * y + offsetY/offsetSpeedY;

      // Compute the noise value.
      let c = noiseLevel * noise(nx, ny);

      // Draw the point.
      stroke(c);
      noStroke();
    //   strokeWeight(2);
    //   point(x, y);
      fill(c,100,100);
      fill(c);
    // fill(100);
    push();
    translate(windowWidth/2,windowHeight/2);
    // rotate(Math.random()*3.14)
    
    rotate(Math.random());
    rect(x,y,20);
    pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
    drawNoise();
}