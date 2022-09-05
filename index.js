var bullsEye1;
var zoomValue = 5200 - 4600;
var angleValue = 0;
var oscillate;
var surface;


function setup(){
	let canvas = createCanvas(windowWidth / 10, windowWidth / 10, WEBGL);
    canvas.parent("bulls_eye");
	frameRate(35);
	bullsEye1 = new BullsEye();
	bullsEye1.depth = 3;
}

function draw(){
	//background(255, 255, 255);
	bullsEye1.draw(surface);
	//background(0, 0, 0);
	if (surface){
		surface.camera(angleValue, 0, round(zoomValue), 0, 0, 0, 0, 1, 0);
		camera(0, 0, 1000, 0, 0, 0, 0, 1, 0);	//Due to the size there must be one camera for the cube
		rotateX(frameCount * 0.01);						//and one for what's on its surface
		rotateY(frameCount * 0.01);	//Rotates the cordinate system for everything drawn after, within draw()
		texture(surface);	//Applies the renderer buffer to all surfaces after this point in the fucntion
		box(470);
	}
	else{
		camera(angleValue, 0, round(zoomValue), 0, 0, 0, 0, 1, 0);
	}
}
document.addEventListener('DOMContentLoaded', function(){
	/*Each function is called in response to a change in the state of a corresponding html
	input. Both changeOscillation() and changeToCube() use checkbox's */
	let BullsEye = document.getElementById('bulls_eye')
	let down = false;
	let current_x = 0;

	let leaveListener = (event) => {
		down = false;
	}
	//BullsEye.addEventListener('mouseleave', leaveListener)

	let downListener = (event) => {
		down = true;
		current_x = event.clientX;
	}
	BullsEye.addEventListener('mousedown', downListener)

	let moveListener = (event) => {
		if (down){
			new_x = event.clientX;
			angleValue -= 2 * (new_x - current_x);
			current_x = new_x
		}
	}
	document.addEventListener('mousemove', moveListener)

	let upListener = (event) => {
		down = false;
	}
	BullsEye.addEventListener('mouseup', upListener)
	document.addEventListener('mouseup', upListener)
});
