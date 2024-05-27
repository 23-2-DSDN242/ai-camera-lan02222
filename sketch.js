let sourceImg=null;
let maskImg=null;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile   = "mask_1.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(0, 0, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  colorMode(HSB);
}

let X_STOP = 600;
let Y_STOP = 600;
// let X_STOP = 1920;
// let Y_STOP = 1080;
//let OFFSET = 20;
let OFFSET = 6;
let renderCounter=0;
function draw () {
  angleMode(DEGREES);
  let num_lines_to_draw = 40;
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
    for(let i=0; i<X_STOP; i++) {
      colorMode(RGB);
      let mask = maskImg.get(i, j);
  
      let pix = [0, 0, 0, 255];

      if (mask[1] < 128) {

        let sum_rgb = [0, 0, 0]
        let num_cells = 0;
        for(let wx=-OFFSET;wx<OFFSET;wx++){
          for (let wy=-OFFSET;wy<OFFSET;wy++) {
            let pix = sourceImg.get(i+wx, j+wy);
            for(let c=0; c<3; c++) {
              sum_rgb[c] += pix[c];
            }
            num_cells += 1;
          }
        }

        for(let c=0; c<3; c++) {
          pix[c] = int(sum_rgb[c] / num_cells);
        } 
      
       }

      else {
        let wave = sin(j*8);
        let slip = map(wave, -1, 1, -OFFSET, OFFSET);
        pix = sourceImg.get(i+slip, j);

        // let brt = map(wave, -1, 1, 0, 255);
        // for(let c=0; c<3; c++) {
        //   pix[c] = brt;
        // }
      }
      set(i, j, pix);
   
    }
  }
 //////////// this is the finish of the blur 

  renderCounter = renderCounter + num_lines_to_draw;
  updatePixels();

///// drawing Eyes 
let eyeSize = 100; 
let spacing = 300;

  for(let i = 0; i < X_STOP; i = i +spacing){
    for(let j = 0; j < Y_STOP; j = j+spacing){
      let mask = maskImg.get(i, j);
      if (mask[1] < 128) {
      DrawEye(i,j, eyeSize- 20);
  }
  }
}

  // /////// drawing Wiggle 
  // for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
  //   for(let i=0; i<X_STOP; i++) {

  //     colorMode(RGB);
  //     let mask = maskImg.get(i, j);
  //     if (mask[1] > 128) { 

  //       let wave = sin(j*8);
  //       let slip = map(wave, -1, 1, -OFFSET, OFFSET);
  //       pix = sourceImg.get(i+slip, j);
  //     } 
  //     set(i, j, pix);
  //   }
  // }



 
  // print(renderCounter);
  if(renderCounter > Y_STOP) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }
}

function DrawEye(x, y, Size){
fill(255)
  ellipse(x, y, Size);
  let offsetX = random(-10,10);
  let offsetY = random(-10,10);
  fill(133, 146, 158 )
  ellipse(x+offsetX, y+offsetY, Size-40);
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
