var SystemSettings = SystemSettings || { };

SystemSettings.standardMaterial = new THREE.ShaderMaterial( {

    uniforms: {
        texture:  { type: 't',  value: new THREE.ImageUtils.loadTexture( 'images/blank.png' ) },
    },

    attributes: {
        velocity: { type: 'v3', value: new THREE.Vector3() },
        color:    { type: 'v4', value: new THREE.Vector3( 0.0, 0.0, 1.0, 1.0 ) },
        lifetime: { type: 'f', value: 1.0 },
        size:     { type: 'f', value: 1.0 },
    },

    vertexShader:   document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,

    blending:    Gui.values.blendTypes,
    transparent: Gui.values.transparent,
    depthTest:   Gui.values.depthTest,

} );


SystemSettings.myMaterial = new THREE.ShaderMaterial( {

    uniforms: {
        texture:  { type: 't',  value: new THREE.ImageUtils.loadTexture( 'images/stripe.png' ) },
    },

    attributes: {
        velocity: { type: 'v3', value: new THREE.Vector3() },
        color:    { type: 'v4', value: new THREE.Vector3( 0.0, 0.0, 1.0, 1.0 ) },
        lifetime: { type: 'f', value: 1.0 },
        size:     { type: 'f', value: 1.0 },
    },

    vertexShader:   document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,

    blending:    Gui.values.blendTypes,
    transparent: Gui.values.transparent,
    depthTest:   Gui.values.depthTest,

} );

SystemSettings.createWall = function(xWidth, zWidth, xPos, zPos) {
    var yWidth = 40; // standard height for walls
    var yPos = yWidth / 2; // standard center y for walls

    var ratio = 20;

    // wall texture
    var textureLong;
    var textureShort;
    if (Game.level == 0) {
        textureLong = new THREE.TextureLoader().load( "textures/wall.jpg" );  
        textureShort = new THREE.TextureLoader().load( "textures/wall.jpg" );
    } 
    else if (Game.level == 1 || Game.level == 2) {
        textureLong = new THREE.TextureLoader().load( "textures/terrace.jpg" );  
        textureShort = new THREE.TextureLoader().load( "textures/terrace.jpg" );
    } 
    else {
        textureLong = new THREE.TextureLoader().load( "textures/wall.jpg" );  
        textureShort = new THREE.TextureLoader().load( "textures/wall.jpg" );
    }

    textureLong.wrapS = THREE.RepeatWrapping;
    textureLong.wrapT = THREE.RepeatWrapping;
    textureShort.wrapS = THREE.RepeatWrapping;
    textureShort.wrapT = THREE.RepeatWrapping;

    // Create an array of materials to be used in a cube, one for each side
    var cubeMaterialArray = [];
    var cubeMaterials;

    if (xWidth == 10) { // x is the short side
        // NAMING IS BACKWARDS, WHOOOPS
        textureLong.repeat.set( xWidth/ratio, yWidth/ratio );
        textureShort.repeat.set( zWidth/ratio, yWidth/ratio );

        if (Game.level == 0) {
            // order to add materials: x+,x-,y+,y-,z+,z-
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureShort } ) ); // red: x
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureShort } ) ); // orange  x
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0xffff33 } ) ); // yellow
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0x33ff33 } ) ); // green
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureLong } ) ); // blue  z
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureLong } ) ); // purple  z

            cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
        } 
        else if (Game.level == 1 || Game.level == 2) {
            // order to add materials: x+,x-,y+,y-,z+,z-
            var randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: textureShort } ) ); // red: x
            randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: textureShort } ) ); // orange  x

            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0xffff33 } ) ); // yellow
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0x33ff33 } ) ); // green

            randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: textureLong } ) ); // blue  z
            randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: textureLong } ) ); // purple  z

            cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
        } 
        else {
            // order to add materials: x+,x-,y+,y-,z+,z-
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureShort } ) ); // red: x
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureShort } ) ); // orange  x
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0xffff33 } ) ); // yellow
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0x33ff33 } ) ); // green
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureLong } ) ); // blue  z
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureLong } ) ); // purple  z

            cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );  
        }
    } 
    else { // z is the short side
        // NAMING IS BACKWARDS
        textureLong.repeat.set( zWidth/ratio, yWidth/ratio );
        textureShort.repeat.set( xWidth/ratio, yWidth/ratio ); 

        if (Game.level == 0) {
            // order to add materials: x+,x-,y+,y-,z+,z-
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureLong } ) ); // red: x
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureLong } ) ); // orange  x
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0xffff33 } ) ); // yellow
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0x33ff33 } ) ); // green
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureShort } ) ); // blue  z
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureShort } ) ); // purple  z
            cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );            
        } 
        else if (Game.level == 1 || Game.level == 2) {
            // order to add materials: x+,x-,y+,y-,z+,z-
            var randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: textureLong } ) ); // red: x
            randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: textureLong } ) ); // orange  x

            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0xffff33 } ) ); // yellow
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0x33ff33 } ) ); // green

            randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: textureShort } ) ); // blue  z
            randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: textureShort } ) ); // purple  z
            cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
        } 
        else {
            // order to add materials: x+,x-,y+,y-,z+,z-
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureLong } ) ); // red: x
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureLong } ) ); // orange  x
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0xffff33 } ) ); // yellow
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0x33ff33 } ) ); // green
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureShort } ) ); // blue  z
            cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: textureShort } ) ); // purple  z
            cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );   
        }
    }
    

    // var material = new THREE.MeshNormalMaterial( {wireframe: false });
    // var material = new THREE.MeshLambertMaterial( {map: texture });

    var wall_geo = new THREE.BoxGeometry(xWidth, yWidth, zWidth);
    var wall = new THREE.Mesh(wall_geo, cubeMaterials);
    wall.position.set( xPos, yPos, zPos);
    return wall;
};

////////////////////////////////////////////////////////////////////////////////
// Level 0: NO GRAVITY - IT CREATES BAD ARTIFACTS/MOVEMENTS
////////////////////////////////////////////////////////////////////////////////

SystemSettings.level0 = {

    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,
    numObjects:         1,

    // Initialization
    initializerFunction : TargetInitializer0,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 0.0, 5.0, 0.0, 1.0 ),
        color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 30.0, 0.0),
        lifetime: 5,
        size:     10.0,
    },

    // Update
    updaterFunction : TargetUpdater0,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 0.8 } ],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    walls         : [],
    createScene : function () {
        // grass texture of plane
        var texture = new THREE.TextureLoader().load( "textures/grasslight-big.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 20, 20 );

        var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
        var phongGray     = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x222222, side: THREE.DoubleSide } );
        var phongGreen     = new THREE.MeshPhongMaterial( {color: 0x003200, emissive: 0x222222, side: THREE.DoubleSide, map: texture} );

        var box_geo   = new THREE.BoxGeometry(10,30,10)

        var plane     = new THREE.Mesh( plane_geo, phongGreen );
        var box       = new THREE.Mesh( box_geo, phongGray );
        box.position.set( 0.0, 15.0, 0.0 );

        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );
        Scene.addObject( box );

        // creating a maze
        this.walls[0] = SystemSettings.createWall(60, 10, 0, 155);
        Scene.addObject( this.walls[0] );

        this.walls[1] = SystemSettings.createWall(10, 80, -25, 110);
        Scene.addObject( this.walls[1] );

        this.walls[2] = SystemSettings.createWall(40, 10, -50, 75);
        Scene.addObject( this.walls[2] );

        this.walls[3] = SystemSettings.createWall( 10, 30, -75, 85);
        Scene.addObject( this.walls[3] );

        this.walls[4] = SystemSettings.createWall( 30, 10, -55, 105);
        Scene.addObject( this.walls[4] );

        this.walls[5] = SystemSettings.createWall( 10, 50, -45, 125);
        Scene.addObject( this.walls[5] );

        this.walls[6] = SystemSettings.createWall( 80, 10, -90, 145);
        Scene.addObject( this.walls[6] );

        this.walls[7] = SystemSettings.createWall( 10, 180, -125, 50);
        Scene.addObject( this.walls[7] );

        this.walls[8] = SystemSettings.createWall( 50, 10, -95, -35);
        Scene.addObject( this.walls[8] );

        this.walls[9] = SystemSettings.createWall( 10, 60, -75, 0);
        Scene.addObject( this.walls[9] );

        this.walls[10] = SystemSettings.createWall( 40, 10, -50, 25);
        Scene.addObject( this.walls[10] );

        this.walls[11] = SystemSettings.createWall( 10, 100, -35, -30);
        Scene.addObject( this.walls[11] );

        this.walls[12] = SystemSettings.createWall( 140, 10, 40, -75);
        Scene.addObject( this.walls[12] );

        this.walls[13] = SystemSettings.createWall( 10, 50, 105, -45);
        Scene.addObject( this.walls[13] );

        this.walls[14] = SystemSettings.createWall( 90, 10, 55, -25);
        Scene.addObject( this.walls[14] );

        this.walls[15] = SystemSettings.createWall( 10, 50, 15, 5);
        Scene.addObject( this.walls[15] );

        this.walls[16] = SystemSettings.createWall( 130, 10, 85, 25);
        Scene.addObject( this.walls[16] );

        this.walls[17] = SystemSettings.createWall( 10, 130, 145, -45);
        Scene.addObject( this.walls[17] );

        this.walls[18] = SystemSettings.createWall( 110, 10, 205, -105);
        Scene.addObject( this.walls[18] );

        this.walls[19] = SystemSettings.createWall( 10, 70, 255, -65);
        Scene.addObject( this.walls[19] );

        this.walls[20] = SystemSettings.createWall( 60, 10, 220, -35);
        Scene.addObject( this.walls[20] );

        this.walls[21] = SystemSettings.createWall( 10, 50, 195, -5);
        Scene.addObject( this.walls[21] );

        this.walls[22] = SystemSettings.createWall( 120, 10, 260, 15);
        Scene.addObject( this.walls[22] );

        this.walls[23] = SystemSettings.createWall( 10, 120, 315, 80);
        Scene.addObject( this.walls[23] );

        this.walls[24] = SystemSettings.createWall( 60, 10, 280, 135);
        Scene.addObject( this.walls[24] );

        this.walls[25] = SystemSettings.createWall( 10, 70, 255, 95);
        Scene.addObject( this.walls[25] );

        this.walls[26] = SystemSettings.createWall( 50, 10, 225, 65);
        Scene.addObject( this.walls[26] );

        this.walls[27] = SystemSettings.createWall( 10, 80, 205, 110)
        Scene.addObject( this.walls[27] );

        this.walls[28] = SystemSettings.createWall( 150, 10, 125, 145);
        Scene.addObject( this.walls[28] );

        this.walls[29] = SystemSettings.createWall( 10, 50, 55, 115);
        Scene.addObject( this.walls[29] );

        this.walls[30] = SystemSettings.createWall( 90, 10, 105, 95);
        Scene.addObject( this.walls[30] );

        this.walls[31] = SystemSettings.createWall( 10, 30, 155, 85);
        Scene.addObject( this.walls[31] );

        this.walls[32] = SystemSettings.createWall( 130, 10, 85, 75);
        Scene.addObject( this.walls[32] );

        this.walls[33] = SystemSettings.createWall( 10, 70, 25, 115);
        Scene.addObject( this.walls[33] );
    },
};

SystemSettings.level1 = {

    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,
    numObjects:         1,

    // Initialization
    initializerFunction : TargetInitializer1,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 0.0, 5.0, 0.0, 1.0 ),
        color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 30.0, 0.0),
        lifetime: 5,
        size:     10.0,
    },

    // Update
    updaterFunction : TargetUpdater1,

    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 0.8 } ],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    walls: [],

    createScene : function () {
        // wood texture of plane
        var texture = new THREE.TextureLoader().load( "textures/wood_floor.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 50, 50 );

        var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
        var phongGray     = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x222222, side: THREE.DoubleSide } );
        var floor_material     = new THREE.MeshPhongMaterial( {emissive: 0x222222, side: THREE.DoubleSide, map: texture} );

        var box_geo   = new THREE.BoxGeometry(10,30,10)

        var plane     = new THREE.Mesh( plane_geo, floor_material );
        var box       = new THREE.Mesh( box_geo, phongGray );
        box.position.set( 0.0, 15.0, 0.0 );

        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );
        Scene.addObject( box );

        // creating eating club
        this.walls[0] = SystemSettings.createWall(10, 290, -195, 15);
        Scene.addObject( this.walls[0] );

        this.walls[1] = SystemSettings.createWall(410, 10, 5, 165);
        Scene.addObject( this.walls[1] );

        this.walls[2] = SystemSettings.createWall(10, 140, -55, 90);
        Scene.addObject( this.walls[2] );

        this.walls[3] = SystemSettings.createWall(10, 100, 35, 110);
        Scene.addObject( this.walls[3] );

        this.walls[4] = SystemSettings.createWall(10, 300, 205, 10);
        Scene.addObject( this.walls[4] );

        this.walls[5] = SystemSettings.createWall(120, 10, 140, 85);
        Scene.addObject( this.walls[5] );

        this.walls[6] = SystemSettings.createWall(170, 10, 115, 15);
        Scene.addObject( this.walls[6] );

        this.walls[7] = SystemSettings.createWall(400, 10, 0, -135);
        Scene.addObject( this.walls[7] );

        this.walls[8] = SystemSettings.createWall(10, 100, 55, -80);
        Scene.addObject( this.walls[8] );

        this.walls[9] = SystemSettings.createWall(10, 110, -55, -75);
        Scene.addObject( this.walls[9] );

        this.walls[10] = SystemSettings.createWall(90, 10, -105, -55);
        Scene.addObject( this.walls[10] );

        this.walls[11] = SystemSettings.createWall(50, 10, -25, -35);
        Scene.addObject( this.walls[11] );
    },
};

SystemSettings.level2 = {

    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,
    numObjects:         1,

    // Initialization
    initializerFunction : TargetInitializer2,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 0.0, 5.0, 0.0, 1.0 ),
        color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 30.0, 0.0),
        lifetime: 5,
        size:     10.0,
    },

    // Update
    updaterFunction : TargetUpdater2,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 0.8 } ],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    walls: [],
    createScene : function () {
        var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
        var phong     = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x222222, side: THREE.DoubleSide } );

        var box_geo   = new THREE.BoxGeometry(10,30,10)

        var plane     = new THREE.Mesh( plane_geo, phong );
        var box       = new THREE.Mesh( box_geo, phong );
        box.position.set( 0.0, 15.0, 0.0 );

        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );
        Scene.addObject( box );

        // creating eating club
        this.walls[0] = SystemSettings.createWall(10, 290, -195, 15);
        Scene.addObject( this.walls[0] );

        this.walls[1] = SystemSettings.createWall(410, 10, 5, 165);
        Scene.addObject( this.walls[1] );

        this.walls[2] = SystemSettings.createWall(10, 140, -55, 90);
        Scene.addObject( this.walls[2] );

        this.walls[3] = SystemSettings.createWall(10, 100, 35, 110);
        Scene.addObject( this.walls[3] );

        this.walls[4] = SystemSettings.createWall(10, 300, 205, 10);
        Scene.addObject( this.walls[4] );

        this.walls[5] = SystemSettings.createWall(120, 10, 140, 85);
        Scene.addObject( this.walls[5] );

        this.walls[6] = SystemSettings.createWall(170, 10, 115, 15);
        Scene.addObject( this.walls[6] );

        this.walls[7] = SystemSettings.createWall(400, 10, 0, -135);
        Scene.addObject( this.walls[7] );

        this.walls[8] = SystemSettings.createWall(10, 100, 55, -80);
        Scene.addObject( this.walls[8] );

        this.walls[9] = SystemSettings.createWall(10, 110, -55, -75);
        Scene.addObject( this.walls[9] );

        this.walls[10] = SystemSettings.createWall(90, 10, -105, -55);
        Scene.addObject( this.walls[10] );

        this.walls[11] = SystemSettings.createWall(50, 10, -25, -35);
        Scene.addObject( this.walls[11] );
    },
};

SystemSettings.level3 = {

    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,
    numObjects:         1,

    // Initialization
    initializerFunction : TargetInitializer3,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 0.0, 5.0, 0.0, 1.0 ),
        color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 30.0, 0.0),
        lifetime: 5,
        size:     10.0,
    },

    // Update
    updaterFunction : TargetUpdater3,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 0.8 } ],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    createScene : function () {
        var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
        var phong     = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x222222, side: THREE.DoubleSide } );

        var box_geo   = new THREE.BoxGeometry(10,30,10)
        var plane     = new THREE.Mesh( plane_geo, phong );

        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );
        Scene.addObject( box );

        // creating sceond campus center
        this.walls[0] = SystemSettings.createWall(350, 10, -135, 235);
        Scene.addObject( this.walls[0] );

        this.walls[1] = SystemSettings.createWall(10, 500, 45, -10);
        Scene.addObject( this.walls[1] );

        this.walls[2] = SystemSettings.createWall(350, 10, -135, -255);
        Scene.addObject( this.walls[2] );

        this.walls[3] = SystemSettings.createWall(10, 480, -305, -10);
        Scene.addObject( this.walls[3] );

        this.walls[4] = SystemSettings.createWall(10, 20, -45, 220);
        Scene.addObject( this.walls[4] );

        this.walls[5] = SystemSettings.createWall(10, 20, -45, 160);
        Scene.addObject( this.walls[5] );

        this.walls[6] = SystemSettings.createWall(220, 10, -150, 145);
        Scene.addObject( this.walls[6] );

        this.walls[7] = SystemSettings.createWall(10, 80, -205, 60);
        Scene.addObject( this.walls[7] );

        this.walls[8] = SystemSettings.createWall(10, 80, -155, 60);
        Scene.addObject( this.walls[8] );

        this.walls[9] = SystemSettings.createWall(70, 10, -75, 95);
        Scene.addObject( this.walls[9] );

        this.walls[10] = SystemSettings.createWall(10, 60, -45, 60);
        Scene.addObject( this.walls[10] );

        this.walls[11] = SystemSettings.createWall(70, 10, -75, 25);
        Scene.addObject( this.walls[11] );

        this.walls[12] = SystemSettings.createWall(30, 10, -285, -25);
        Scene.addObject( this.walls[12] );

        this.walls[13] = SystemSettings.createWall(30, 10, -215, -25);
        Scene.addObject( this.walls[13] );

        this.walls[14] = SystemSettings.createWall(10, 60, -205, -60);
        Scene.addObject( this.walls[14] );

        this.walls[15] = SystemSettings.createWall(130, 10, -25, -35);
        Scene.addObject( this.walls[15] );

        this.walls[16] = SystemSettings.createWall(130, 10, -25, -95);
        Scene.addObject( this.walls[16] );

        this.walls[17] = SystemSettings.createWall(10, 70, -175, -255);
        Scene.addObject( this.walls[17] );

        this.walls[18] = SystemSettings.createWall(30, 10, -235, -145);
        Scene.addObject( this.walls[18] );

        this.walls[19] = SystemSettings.createWall(50, 10, -155, -145);
        Scene.addObject( this.walls[19] );

        this.walls[20] = SystemSettings.createWall(10, 60, -135, -180);
        Scene.addObject( this.walls[20] );

        this.walls[21] = SystemSettings.createWall(10, 70, -35, -175);
        Scene.addObject( this.walls[21] );
    },
};
