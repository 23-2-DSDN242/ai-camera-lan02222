let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_a.jpg";
let maskFile   = "mask_a.png";
let outputFile = "output_a.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(0, 255, 0); //(255, 0, 0)
  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw () {
  let angle = 45;
  let offsetX = 60;
  let offsetY = 50;

  for(let i=0;i<4000;i++) {
    //random xy
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    let pix = sourceImg.get(x, y);
    let mask = maskImg.get(x, y);
    
    // push();
    // rotate(radians(angle));
        
    
    fill(pix);
  //   //draw on mask
    if(mask[0] > 128) {
      let pointSize = 10;
      ellipse(x, y, pointSize, pointSize);
    }
    //draw on input
    else {
      fill(0, pix[1], 0);
      let pointSize = 20;
      rect(x, y, pointSize, pointSize);    
    }
  }

  //example
  // if (mask[0] > 128) {
  //   let pointSize = 10;
  // //different stroke color
  //   stroke(pix)
  //   strokeWeight(height/500)
  //   console.log(pix[0])
  //   if(pix[0] > 120){
  //   line(x+offsetX, y+offsetY, x+offsetX, y+height/10+offsetY)
  //   }else{
  //     line(x+offsetX, y+offsetY, x+offsetX, y-height/10+offsetY)
  //   }

  //   pop();


  // }
  // else{
  //   noStroke()
  //   fill(0,pix[1],0);
  //   let pointSize = 20;
  //   rect(x,y,pointSize, pointSize);
  // }
  // }

  renderCounter = renderCounter + 1;
  if(renderCounter > 10) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
