let sourceImg=null;
let maskImg=null;
let renderCounter=0;

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
  colorMode(RGB);
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
      
      let offset_R =15;
      let offset_G =0;
      let offset_B =-15;

      let offset_z = 5;
      

       //rgb of chromatic aberration 
      let current_r;
      if (i + offset_R < width && j + offset_z< height) {
        current_r = sourceImg.get(i + offset_R,j+offset_z);
      } else {
        current_r =col;
      }

     
      let current_g;
      if (i + offset_G >= 0 && j>= 0) {
        current_g = sourceImg.get(i + offset_G,j);
      } else {
        current_g =col;
      }

      let current_b;
      if (i + offset_B < width &&  j- offset_z< height) {
        current_b = sourceImg.get(i + offset_B,j-offset_z);
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
  // print(renderCounter);
  if(renderCounter > 1080) {
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
