var Goal = Goal || {};

Goal.init = function(level) {
	// FILL IN FOR EVERY LEVEL
	if (level == 0) {
		this.position = [220,10,-70];
	}
	else if (level == 1 || level == 2) { 
		// JENNIE: also storing locations of officers
		// because I don't know where else to store right now...
		// officer 0: [-170, 10, 140] IRON MAN
		// officer 1: [-80, 10, -110] DEADPOOL
		// officer 2: [-30, 10, -110] FLASH
		// officer 3: [170, 10, -110] SPIDERMAN
		// officer 4: [180, 10, 40]   SHOCKWAVE
		// officer 5: [180, 10, 140] LAST: Storm

		this.officers = [[-170, 10, 140],[-80, 10, -110],[-30, 10, -110],[170, 10, -110],[180, 10, 40],[180, 10, 140]];

		this.position = [180, 10, 140];
	}
	else if (level == 3) {
		// JENNIE: just wins if gets to printer right now
		this.position = [23, 8, -120];
	}
	else {
		this.position = [400,400,400];
	}
}

// Update the goal's position
// THIS NEEDS TO BE FILLED IN. Right now it just stays the same.
Goal.updatePosition = function(newx,newy,newz) {
	// FILL IN FOR EVERY LEVEL
	this.position[0] = newx;
	this.position[1] = newy;
	this.position[2] = newz;
}
