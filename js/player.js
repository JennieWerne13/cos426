var Player = Player || {};

Player.init = function() {
	var rand = Math.random() * 0.1 - 0.05;
	Player.position = [0,10,149]; // JENNIE: being higher up wastes less space on bottom
	Player.orientation = [0,rand,0];
	Player.pressed = false;
	Player.pizzaLocation = [-10, 0, 130];
	Player.officersReached = [0,0,0,0,0,0]; 
}

// Update the player's position
// THIS NEEDS TO BE FILLED IN. Right now it just increments.
Player.updatePosition = function() {

	this.position[0] += 0;
	this.position[1] += 0;
	this.position[2] += 0;
}

Player.pickUpItem = function() {
	// THIS NEEDS TO BE FILLED IN (MAYBE)

	// Pick up item (this part might not belong in this class, but just generally in the rendering class)
	if (Game.level == 1) {
		this.pizzaLocation[0] = this.position[0]-10.0;
		this.pizzaLocation[1] = this.position[1]-3.0;
		this.pizzaLocation[2] = this.position[2]-10.0;
		Scene._scene.getObjectByName('pizza.obj').position.set(this.pizzaLocation[0],this.pizzaLocation[1],this.pizzaLocation[2]);
	}
	this.pressed = true;
}

Player.putDownItem = function() {
	// THIS ALSO NEEDS TO BE FILLED IN (MAYBE)

	this.pressed = false;
	if (Game.level == 1) {
		this.pressed = true;
		SystemSettings.addObjectFromFile( 'pizza.png', 'pizza.obj', this.pizzaLocation[0], 0, this.pizzaLocation[2], 23, 0, 2 );
		for (var i = 0; i < Player.officersReached.length; i++) {
			if (Player.officersReached[i] == 0 && Math.abs(this.pizzaLocation[0] - Goal.officers[i][0]) < 20 && Math.abs(this.pizzaLocation[2] - Goal.officers[i][2]) < 20) {
				Player.officersReached[i] = 1;
				// alert player that they have reached officer
			}
		}
	}
}

Player.moveForward = function(amount) {
	if (amount == 0) return;

	var a = new THREE.Euler( Player.orientation[0], Player.orientation[1], Player.orientation[2], 'XYZ' );
	var b = new THREE.Vector3(0,0,-1);
	b.applyEuler(a);

	var newPosition = [];
	newPosition[0] = this.position[0] + amount*b.x;
	newPosition[1] = this.position[1] + amount*b.y;
	newPosition[2] = this.position[2] + amount*b.z;

	if (Game.inBounds(newPosition) && Game.noWall(this.position, newPosition)) { // check if in bounds
		// actually move since in bounds
		this.position[0] = newPosition[0];
		this.position[1] = newPosition[1];
		this.position[2] = newPosition[2];

		Renderer._camera.position.set(this.position[0],this.position[1],this.position[2]);
		if (Game.level == 1 && this.pressed) {
			this.pizzaLocation[0] = Scene._scene.getObjectByName('pizza.obj').position.x + amount*b.x;
			this.pizzaLocation[1] = Scene._scene.getObjectByName('pizza.obj').position.y + amount*b.y;
			this.pizzaLocation[2] = Scene._scene.getObjectByName('pizza.obj').position.z + amount*b.z;

			Scene._scene.getObjectByName('pizza.obj').position.set(this.pizzaLocation[0],this.pizzaLocation[1],this.pizzaLocation[2]);
		}
	}
	else {
		this.moveForward(amount - 1);
	}
}

Player.moveBackward = function(amount) {
	if (amount == 0) return;

	var a = new THREE.Euler( Player.orientation[0], Player.orientation[1], Player.orientation[2], 'XYZ' );
	var b = new THREE.Vector3(0,0,1);
	b.applyEuler(a); 

	var newPosition = [];
	newPosition[0] = this.position[0] + amount*b.x;
	newPosition[1] = this.position[1] + amount*b.y;
	newPosition[2] = this.position[2] + amount*b.z;

	if (Game.inBounds(newPosition) && Game.noWall(this.position, newPosition)) { // check if in bounds
		// actually move since in bounds
		this.position[0] = newPosition[0];
		this.position[1] = newPosition[1];
		this.position[2] = newPosition[2];

		Renderer._camera.position.set(this.position[0],this.position[1],this.position[2]);
		if (Game.level == 1 && this.pressed) {
			this.pizzaLocation[0] = Scene._scene.getObjectByName('pizza.obj').position.x + amount*b.x;
			this.pizzaLocation[1] = Scene._scene.getObjectByName('pizza.obj').position.y + amount*b.y;
			this.pizzaLocation[2] = Scene._scene.getObjectByName('pizza.obj').position.z + amount*b.z;

			Scene._scene.getObjectByName('pizza.obj').position.set(this.pizzaLocation[0],this.pizzaLocation[1],this.pizzaLocation[2]);
		}
	}
	else {
		this.moveBackward(amount - 1);
	}
}

Player.turnLeft = function(amount) {
	// var a = new THREE.Euler( Player.orientation[0], Player.orientation[1], Player.orientation[2], 'XYZ' );
	// var b = Renderer._camera.up.clone();
	// b.applyEuler(a); // rotate the initial up vector 

	Player.orientation[1] += amount;
	Renderer._camera.rotation.set( Player.orientation[0], Player.orientation[1], Player.orientation[2]); 
	if (Game.level == 1 && this.pressed) {
		var tmp = [-10,-10];
		var rottmp = [0,0];
		rottmp[0] = Math.cos(Player.orientation[1])*tmp[1] + Math.sin(Player.orientation[1])*tmp[0];
		rottmp[1] = -Math.sin(Player.orientation[1])*tmp[1] + Math.cos(Player.orientation[1])*tmp[0];
		console.log(rottmp);
		Scene._scene.getObjectByName('pizza.obj').position.set(Player.position[0] + rottmp[0],Player.position[1]-3.0,Player.position[2] + rottmp[1]);
		Scene._scene.getObjectByName('pizza.obj').rotation.set(Player.orientation[0], Player.orientation[1] + Math.PI, Player.orientation[2]);
	}
}

Player.turnRight = function(amount) {
	Player.orientation[1] -= amount;
	Renderer._camera.rotation.set( Player.orientation[0], Player.orientation[1], Player.orientation[2]); 
	if (Game.level == 1 && this.pressed) {
		var tmp = [-10,-10];
		var rottmp = [0,0];
		rottmp[0] = Math.cos(Player.orientation[1])*tmp[1] + Math.sin(Player.orientation[1])*tmp[0];
		rottmp[1] = -Math.sin(Player.orientation[1])*tmp[1] + Math.cos(Player.orientation[1])*tmp[0];
		console.log(rottmp);
		Scene._scene.getObjectByName('pizza.obj').position.set(Player.position[0] + rottmp[0],Player.position[1]-3.0,Player.position[2] + rottmp[1]);
		Scene._scene.getObjectByName('pizza.obj').rotation.set(Player.orientation[0], Player.orientation[1] + Math.PI, Player.orientation[2]);
	}
}