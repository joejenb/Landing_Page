function setup() {

    frameRate(10)
    let canvas  = createCanvas(74, 74);
    canvas.parent("chords");
    background(255, 255, 255);
  
    // translucent stroke using alpha value
    stroke(0, 0, 0, 15);
  }
  
  function draw() {
    // draw two random chords each frame
    if (frameCount / 60 < 5){
        randomChord();
        randomChord();
    }
  }
  
  function randomChord() {
    // find a random point on a circle
    let angle1 = random(0, 2 * PI);
    let xpos1 = 37 + 37 * cos(angle1);
    let ypos1 = 37 + 37 * sin(angle1);
  
    // find another random point on the circle
    let angle2 = random(0, 2 * PI);
    let xpos2 = 37 + 37 * cos(angle2);
    let ypos2 = 37 + 37 * sin(angle2);
  
    // draw a line between them
    line(xpos1, ypos1, xpos2, ypos2);
  }