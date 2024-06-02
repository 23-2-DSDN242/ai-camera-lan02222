let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile   = "mask_1.png";
let outputFile = "output_1.png";
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
  colorMode(RGB);

  maskCenterSearch(20);
}

function draw () {
  let num_lines_to_draw = 40;
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
    for(let i=0; i<1920; i++) {
      colorMode(RGB);
      let pix = sourceImg.get(i, j);
      // create a color from the values (always RGB)
      let col = color(pix);
      let mask = maskImg.get(i, j);

      // colorMode(HSB, 360, 100, 100);
      // draw a "dimmed" version in gray
      colorMode(RGB);
      let r = red(col);
      let g = green(col);
      let b = blue(col);
      
      let offset_R =5;
      let offset_G =-5;
      let offset_B =0;

      let offset_z = 10;
      

       //rgb of chromatic aberration 
      let current_r;
      if (i + offset_R < width && j + offset_z>= 0) {
        current_r = sourceImg.get(i + offset_R,j+offset_z);
      } else {
        current_r =col;
      }

     
      let current_g;
      if (i + offset_G < width && j- offset_z>= 0) {
        current_g = sourceImg.get(i + offset_G,j- offset_z);
      } else {
        current_g =col;
      }

      let current_b;
      if (i + offset_B >= 0 &&  j>= 0) {
        current_b = sourceImg.get(i ,j);
      } else {
        current_b =col;
      }



      if(mask[0] < 128) {
        // draw the full pixels
        // let new_sat = map(s, 0, 100, 50, 100);
        let new_col = color(red(current_r), green(current_g), blue(current_b));
        // let new_hue = map(h, 0, 360, 180, 540);
        set(i, j, new_col);
      }
      else {
        // let new_brt = map(b, 0, 100, 20, 40);
        let old_col = color(r, g, b);
        // let new_col = color(h, s, b);
        set(i, j, old_col);
      }
    }
  }
  renderCounter = renderCounter + num_lines_to_draw;
  updatePixels();

  if (maskCenter !== null) {
    drawMaskCenter();
  }

  if(renderCounter > 1080) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);

  }
}

function drawMaskCenter(){
  strokeWeight(1);
  noFill();
  stroke(235,191,103);

  if (maskCenter[0]> width/2){
  //big  circles
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
   //Blush
  noStroke();
  fill(253,129,74,60);    
  ellipse(maskCenter[0]-maskCenter[0]/18, maskCenter[1]+9, maskCenterSize[0]/8);
  ellipse(maskCenter[0]+maskCenter[0]/18, maskCenter[1]+9, maskCenterSize[0]/8); 
  
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
  let mouthWidth = maskCenterSize[0]/6;
  let mouthHeight = maskCenterSize[1]/20;
  let mouthX =maskCenter[0] - mouthWidth/2;
  let mouthY =maskCenter[1] + maskCenterSize[0]/12;

  beginShape();
  vertex(mouthX,mouthY);
  bezierVertex(mouthX + mouthWidth/3, mouthY + mouthHeight, mouthX+mouthWidth/3*2,mouthY + mouthHeight, mouthX + mouthWidth, mouthY );
  endShape();

}
}
  function maskCenterSearch(min_width) {
    let max_up_down = 0;
    let max_left_right = 0;
    let max_x_index = 0;
    let max_y_index = 0;
    let X_STOP = 1920;
    let Y_STOP = 1080;

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

    function keyTyped() {
      if (key == '!') {
        saveBlocksImages();
      }
    }