let sourceImg = null;
let maskImg = null;
// let renderCounter = 0;

// Modify these three lines to the appropriate file name
let sourceFile = "input_2.jpg";
let maskFile = "mask_2.png";
let outputFile = "output_2.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}
  

function setup() {
  createCanvas(1920, 1080);
  imageMode(CENTER);
  noStroke();
  background(0, 0, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  drawCAeffect();
}

//ChromaticAberration
function drawCAeffect() {
let offsetX = 20; 
let w = sourceImg.width;
let h = sourceImg.height;
sourceImg.loadPixels();
maskImg.loadPixels();

for (let y = 0; y < h; y++) {
for (let x = 0; x < w; x++) {
let index = (x + y * w) * 4;

let mask = maskImg.pixels[index];
let r = sourceImg.pixels[index];
let g = sourceImg.pixels[index + 1];
let b = sourceImg.pixels[index + 2];
let a = sourceImg.pixels[index + 3];

if (mask < 128) {
set(x + offsetX, y, color(r, 0, 0,a-100));// red
set(x, y, color(0, g, 0,a-100));//green
set(x - offsetX, y, color(0, 0, b,a-100));// blue
} else {

set(x, y, color(r, g, b,a));// keep original color
}
}
}

updatePixels();
}


function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
