let sourceImg=null;
let maskImg=null;

// change these three lines as appropiate
let sourceFile = "input_2.jpg";
let maskFile   = "mask_2.png";
let outputFile = "output_2.png";
let maskCenter = null;
let maskCenterSize = null;

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

  maskCenterSearch(20);
}

// let X_STOP = 640;
// let Y_STOP = 480;
let X_STOP = 1920;
let Y_STOP = 1080;
let OFFSET = 20;

function maskCenterSearch(min_width) {
    let max_up_down = 0;
    let max_left_right = 0;
    let max_x_index = 0;
    let max_y_index = 0;

    // first scan all rows top to bottom
    print("Scanning mask top to bottom...")
    for(let j=0; j<Y_STOP; j++) {
      // look across this row left to right and count
      let mask_count = 0;
      for(let i=0; i<X_STOP; i++) {
        let mask = maskImg.get(i, j);
        if (mask[0] > 128) {
          mask_count = mask_count + 1;
        }
      }
      // check if that row sets a new record
      if (mask_count > max_left_right) {
        max_left_right = mask_count;
        max_y_index = j;
      }
    }

    // now scan once left to right as well
    print("Scanning mask left to right...")
    for(let i=0; i<X_STOP; i++) {
      // look across this column up to down and count
      let mask_count = 0;
      for(let j=0; j<Y_STOP; j++) {
        let mask = maskImg.get(i, j);
        if (mask[0] > 128) {
          mask_count = mask_count + 1;
        }
      }
      // check if that row sets a new record
      if (mask_count > max_up_down) {
        max_up_down = mask_count;
        max_x_index = i;
      }
    }

    print("Scanning mask done!")
    if (max_left_right > min_width && max_up_down > min_width) {
      maskCenter = [max_x_index, max_y_index];
      maskCenterSize = [max_left_right, max_up_down];
    }
}

let renderCounter=0;
function draw () {
  angleMode(DEGREES);
  let num_lines_to_draw = 40;
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
    for(let i=0; i<X_STOP; i++) {
      colorMode(RGB);
      let mask = maskImg.get(i, j);
      let changeAmount = map (i, 0,X_STOP -1, 0,100)
      if (mask[0] > 128) {
        pix = sourceImg.get(i, j);
      }
      else {
        if(j%2 == 0) {
          
          pix = [changeAmount,49,73,255]
        }
        else {
          pix = sourceImg.get(i, j);          
        }
      }

      set(i, j, pix);
    }
  }
  renderCounter = renderCounter + num_lines_to_draw;
  updatePixels();

  if (maskCenter !== null) {
    strokeWeight(1);
    noFill();
    stroke(235,191,103);

    if (maskCenter[0]> width/2){
    //big  cireles
    // ellipse(maskCenter[0], maskCenter[1], 260);
    ellipse(maskCenter[0], maskCenter[1], maskCenterSize[0]+60);//260
    strokeWeight(0.75);
    ellipse(maskCenter[0], maskCenter[1], maskCenterSize[0]+120);//320
    strokeWeight(0.5);
    ellipse(maskCenter[0], maskCenter[1], maskCenterSize[0]+260);//460

    //small
    fill(235,191,103);
    ellipse(maskCenter[0]-100, maskCenter[1]+210, maskCenterSize[1]/20);// down left，20
    ellipse(maskCenter[0]+80, maskCenter[1]-140, maskCenterSize[1]/20);// top left，10
    ellipse(maskCenter[0]+180, maskCenter[1]-145, maskCenterSize[1]/25);// top right，8
    ellipse(maskCenter[0]+150, maskCenter[1]+175, maskCenterSize[1]/30);//down right，10
    ellipse(maskCenter[0]-230, maskCenter[1]-20, maskCenterSize[1]/30);//middle left，10
    ellipse(maskCenter[0]-20, maskCenter[1]+160, maskCenterSize[1]/30);//down middle，10
    }
    else{
    //smile face
    noStroke();
    fill(91,57,37);
    //eye
    ellipse(maskCenter[0]-29, maskCenter[1]-10, maskCenterSize[0]/15);
    ellipse(maskCenter[0]+29, maskCenter[1]-10, maskCenterSize[0]/15); 
    //mouth
    noFill();
    stroke(243,116,90);
    strokeWeight(5);
    strokeCap(ROUND);
    let mouthWidth = maskCenterSize[0]/4;
    let mouthHeight = maskCenterSize[1]/15;
    let mouthX =maskCenter[0] - mouthWidth/2;
    let mouthY =maskCenter[1] + maskCenterSize[0]/8;

    beginShape();
    vertex(mouthX,mouthY);
    bezierVertex(mouthX + mouthWidth/3, mouthY + mouthHeight, mouthX+mouthWidth/3*2,mouthY + mouthHeight, mouthX + mouthWidth, mouthY );
    endShape();

    //Blush
    noStroke();
    fill(253,129,74,50);    
    ellipse(maskCenter[0]-60, maskCenter[1]+5, maskCenterSize[0]/5);
    ellipse(maskCenter[0]+60, maskCenter[1]+5, maskCenterSize[0]/5);        

    // translate(maskCenter[0], maskCenter[1]);
    // for (let i = 0; i < 20; i++) {
    //   rotate(35);
    // ellipse(50, 50, 5, 5);
    // }


    // fill(0, 255, 0);
    // stroke(255, 0, 0);
    // ellipse(maskCenter[0], maskCenter[1], 100);
    // line(maskCenter[0]-200, maskCenter[1], maskCenter[0]+200, maskCenter[1]);
    // line(maskCenter[0], maskCenter[1]-200, maskCenter[0], maskCenter[1]+200);
    // noFill();
    // let mcw = maskCenterSize[0];
    // let mch = maskCenterSize[1];
    // rect(maskCenter[0]-mcw/2, maskCenter[1]-mch/2, mcw, mch);
  }
}

  // print(renderCounter);
  if(renderCounter > Y_STOP) {
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