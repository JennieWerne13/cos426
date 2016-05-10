var Player = Player || {};

Player.init = function() {
	var rand = Math.random() * 0.1 - 0.05;
	Player.position = [0,10,149]; // JENNIE: being higher up wastes less space on bottom
	Player.orientation = [0,rand,0];
	Player.pressed = false;
	Player.pizzaLocation = [-10, 0, 130];
	Player.officersReached = [0,0,0,0,0,0]; 
	Player.reachedPrinter = false;
}

// Update the player's position
// THIS NEEDS TO BE FILLED IN. Right now it just increments.
Player.updatePosition = function() {

	this.position[0] += 0;
	this.position[1] += 0;
	this.position[2] += 0;
}

Player.getInspirString = function(i) {
	if (i == 0) {
		return "Arrogance never hurts!";
	}
	else if (i == 1) {
		return "Don't experiment.";
	}
	else if (i == 2) {
		return "Speed over strength.";
	}
	else if (i == 3) {
		return "Tap into your animal instinct!";
	}
	else if (i == 4) {
		return "Do what's right.";
	}
	else if (i == 5) {
		return "You can do it!";
	}
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
	else if (Game.level == 2) {


		// SystemSettings.addObjectFromFile( 'pizza.png', 'pizza.obj', this.position[0] - 10.0, this.position[1] + 3*(Math.random() - 0.5), this.position[2] - 10.0, 23, 0, 2 );
		for (var i = 0; i < Player.officersReached.length; i++) {

			if (Player.officersReached[i] == 0 && Math.abs(this.position[0] - Goal.officers[i][0]) < 30 && Math.abs(this.position[2] - Goal.officers[i][2]) < 30) {
				Player.officersReached[i] = 1;

				document.getElementById("superhero" + i + "-2").style.fontWeight = "bold";
				document.getElementById("superhero" + i + "-2").style.backgroundColor = "#e59400";

				var inspir_str = Player.getInspirString(i);

				var a = new THREE.Euler( Player.orientation[0], Player.orientation[1], Player.orientation[2], 'XYZ' );
				var b = new THREE.Vector3(0,0,-1);
				b.applyEuler(a);

				var newPosition = [];
				newPosition[0] = Player.position[0] + 10*b.x;
				newPosition[1] = 10;
				newPosition[2] = Player.position[2]+ 10*b.z;
				
				var loader = new THREE.FontLoader();
				loader.load( 'js/helvetiker_regular.typeface.js', function ( font ) {

				    var textGeo = new THREE.TextGeometry( inspir_str, {

				        font: font,

				        size: 2,
				        height: 1,
				        curveSegments: 12,

				    });

				    textGeo.computeBoundingBox();
				    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

				    var textMaterial = new THREE.MeshPhongMaterial( { color: 0x00ffff, specular: 0xffffff } );

				    var mesh = new THREE.Mesh( textGeo, textMaterial );
				    mesh.position.x = newPosition[0];
				    mesh.position.y = newPosition[1];
					mesh.position.z = newPosition[2];
					mesh.rotation.y = Renderer._camera.rotation._y - 0.15;

				    mesh.castShadow = true;
				    mesh.receiveShadow = true;
				    Scene._scene.add( mesh );

				} );
			}
		}
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
			if (Player.officersReached[i] == 0 && Math.abs(this.pizzaLocation[0] - Goal.officers[i][0]) < 30 && Math.abs(this.pizzaLocation[2] - Goal.officers[i][2]) < 30) {
				Player.officersReached[i] = 1;
				// alert player that they have reached officer
				// font-weight: bold;
				document.getElementById("superhero" + i).style.fontWeight = "bold";
				document.getElementById("superhero" + i).style.backgroundColor = "#e59400";
			}
		}
	}
	else if (Game.level == 2) {
		var loader = new THREE.FontLoader();
		loader.load( 'js/helvetiker_regular.typeface.js', function ( font ) {

		    var textGeo = new THREE.TextGeometry( "Printing your resume...", {

		        font: font,

		        size: 1,
		        height: 0.5,
		        curveSegments: 12,

		    });

		    textGeo.computeBoundingBox();
		    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

		    var textMaterial = new THREE.MeshPhongMaterial( { color: 0x00ffff, specular: 0x00ffff } );

		    var mesh = new THREE.Mesh( textGeo, textMaterial );
		    mesh.position.x = Goal.position[0] - 7;
		    mesh.position.y = 11;
			mesh.position.z = Goal.position[2];
			mesh.rotation.y = 0;

		    mesh.castShadow = true;
		    mesh.receiveShadow = true;
		    Scene._scene.add( mesh );

		} );

		setTimeout(function() {Player.reachedPrinter = true; },3000);
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
		Scene._scene.getObjectByName('pizza.obj').position.set(Player.position[0] + rottmp[0],Player.position[1]-3.0,Player.position[2] + rottmp[1]);
		Scene._scene.getObjectByName('pizza.obj').rotation.set(Player.orientation[0], Player.orientation[1] + Math.PI, Player.orientation[2]);
	}
}