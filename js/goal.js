var Goal = Goal || {};

Goal.init = function(level) {
	// FILL IN FOR EVERY LEVEL
	this.position = [0, 0, 0];
}

// Update the goal's position
// THIS NEEDS TO BE FILLED IN. Right now it just stays the same.
Goal.updatePosition = function(newx,newy,newz) {
	// FILL IN FOR EVERY LEVEL
	this.position[0] = newx;
	this.position[1] = newy;
	this.position[2] = newz;

}
