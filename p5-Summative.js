class Cuboid{
	constructor(dim, colour, angle, z, depth, surface){
		/*Constructs a cube to have the properties provided or some defaults. This means
		a cube can be reused, only having to change a few properties rather than redefine them all.*/
		this.dim = dim;
		this._colour = [255, 255, 255]; 
		this._angle = angle;
		this.z = z;
		this._depth = depth || 0;
		this._surface = surface;
	}

	/*Following two functions are used to get and change the value of angle from outside
	of the class. This allows multiple angles to be altered in one iterative block.*/
	set angle(angle){
		this._angle = angle;
	}

	get angle(){
		return this._angle;
	}

	set surface(surface){
		/* Used to define where the cubes are being drawn to, the canvas or a graphics element.*/
		this._surface = surface;
	}

	set depth(depth){
		/*Changes the depth of a cube while it's other dimensions remain the same.*/
		this._depth = depth;
	}

	/*The colour of each cube gradually changes continually in BullsEye, therefore, the
	the new value must be calculated using the previous value. This requires both getter
	and setter functions.*/
	set colour(colour){
		this._colour = colour;
	}

	get colour(){
		return this._colour;
	}

	draw(surface){
		/*Exccutes the same operations but drawing onto two different renderer objects. One
		draws directly to the canvas while the other draws to an off screen buffer. Each cube
		is drawn on top of the previous by displacing the object to be drawn by
		"this._depth * this.z" and rotating it by its angle calculated in bullsEye. The original
		coordinate system of the canvas is saved by push and then restored after drawing the cube
		using pop.*/
		this._surface = surface;
		if (this._surface){
			this._surface.fill(this._colour[0], this._colour[1], this._colour[2]);
			this._surface.push();
			this._surface.rotate(this._angle);
			this._surface.translate(0, 0, this._depth * this.z);
			this._surface.box(this.dim, this.dim, this._depth);
			this._surface.pop();
		}
		else{
			fill(this._colour[0], this._colour[1], this._colour[2]);
			push();
			rotate(this._angle);
			translate(0, 0, this._depth * this.z);
			box(this.dim, this.dim, this._depth);
			pop();
		}
	}
}

class BullsEye{
	constructor(surface){
		this.layers = 110;
		this.maxRot = PI / 10;	//The most a cube can be rotated by in one go
		this.defAngle = PI / 20;	//The default angle
		this.angleDif = -this.defAngle + (2 * this.defAngle * random(1));	//Starting angle difference
		this.angleDifE = -this.defAngle + (2 * this.defAngle * random(1));	//Objective angle difference
		this.angleFric = 0.7;	//Scales the change in angle value to reduce the speed of rotation
		this.colStep = 0.02; //Scaling factor of input to noise function
		this.cuboids = []; //Stores cuboid objects that make up the BullsEye
		this.destRot = 3 * PI * random(1);	//The objective rotation of the smallest cuboid
		this.noiseFactor = [random(123456), random(123456), random(123456)];
		/*These noiseFactors remain constant and ensure that each component of the
		RGB value is different. Therefore, the overall colour will be more varied. */
		this._depth = 0;
		this._surface = surface;
		for (var i = 0; i < this.layers; i++){
			let dim = 4 + (i * 3);
			let angle = this.destRot + (i * this.angleDif);
			this.cuboids[i] = new Cuboid(dim, undefined, angle, this.layers - i - 1);
		}
	}

	draw(surface){
		/*Draws all of its component pieces, in this case all of the cubes that make it up.*/
		this._surface = surface;
		background(255);	//Clears the screen each frame so that there's no overlap with previous drawings
		stroke(0);	//Sets the stroke colour to be black
		//this.changeColour();
		this.changeAngle();
		if (this._surface){
			surface.background(0);	//While cube is clicked everything must be drawn on a graphics buffer
		}													//that is stored in 'surface'
		for (var i = this.layers - 1; i >= 0; i--){
			this.cuboids[i].draw(this._surface);
		}
	}

	oscillate(){
		/*Continually changes the depth of each cube so as to make the bullsEye look
		as though it were expanding and contracting. One full expansion and contraction takes
		35 frames, and therefore 1 second, to occur.*/
		let depth = 10 + round(sin((frameCount * 2 * PI)/ 35) * 10);
		this._depth = depth * this.layers;
		for (var i = 0; i< this.layers; i++){
			this.cuboids[i].depth = depth;
		}
	}

	set surface(surface){
		/*Defines which p5 renderer object the bullsEye will be drawn onto either the canvas
		or an offscreen graphics buffer.*/
		this._surface = surface;
		for (var i = 0; i< this.layers; i++){
			this.cuboids[i].surface = surface;
		}
	}

	get surface(){
		/*Means that which renderer that is currently being used can be determined from
		outside the class*/
		return this._surface;
	}

	set depth(depth){
		/*Allows for the depth of each cube and so of the overall bullsEye to be set exterior
		to the class*/
		this._depth = depth * this.layers;
		for (var i = 0; i< this.layers; i++){
			this.cuboids[i].depth = depth;
		}
	}


	changeColour(){
		/*Calculates the colour value of the first cuboid using the noise function. Its
		input is the total number of frame changes scaled by the colour step value of bullsEye,
		reducing the rate of change in colour. The use of noise also means that the change in
		value of colour is very smooth, yet also not easily predictable. The colour of the other
		cubes is simply the difference in colour between a cube and that before it minus one,
		added to the current colour value of that cube.*/
		for (var i = 0; i < this.layers; i++){
			let colour = this.cuboids[i].colour;
			for (var t = 0; t < 3; t++){
				if (i !== 0){
					let prevCol = this.cuboids[i - 1].colour;
					colour[t] += (prevCol[t] - colour[t]) - 1;
				}
				else{
					colour[t] = noise(this.noiseFactor[t] + (frameCount* this.colStep)) * 255;
				}
			}
			this.cuboids[i].colour = colour;
		}
	}

	changeAngle(){
		/*Incrementally changes the angle of the first cube, rotating is closer to its intended angle,
		once negligibly far from it a new objective angle is calculated. The other cubes are all
		then rotated by the difference between their angle and that of the cube before, plus a
		value added at all rotations. This value is increased in magnitude every time change angle
		is called otherwise as the difference got smaller the rotation speed would slow to near zero
		until a new objective angle was defined.*/
		this.cuboids[0].angle = this.calcTween(this.cuboids[0].angle, this.destRot, random(0.1));
		if (Math.abs(this.cuboids[0].angle - this.destRot) < 0.000001){
			this.destRot = 3 * PI * random(1);
		}
		this.angleDif = this.calcTween(this.angleDif, this.angleDifE, random(0.2));
		if (Math.abs(this.angleDif - this.angleDifE) < 0.00001){
			this.angleDifE = -this.defAngle + (2 * this.defAngle * random(1));
		}
		for (var i = 1; i < this.layers; i++){
			let rot = (this.cuboids[i - 1].angle - this.cuboids[i].angle + this.angleDif) * this.angleFric;
			if (Math.abs(rot) > this.maxRot){
				this._maxSpeed = true;
				rot = this.maxRot * (rot / Math.abs(rot));
			}
			this.cuboids[i].angle = this.cuboids[i].angle + rot;
		}
	}

	calcTween(from, to, factor){
		/*Generates a new angle by adding the scaled difference of two angles to one of the angles*/
		let diff = to - from;
		diff *= factor;
		from += diff;
		return from;
	}
}
