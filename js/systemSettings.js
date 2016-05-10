var SystemSettings = SystemSettings || { };

SystemSettings.standardMaterial = new THREE.ShaderMaterial( {

    uniforms: {
        texture:  { type: 't',  value: new THREE.TextureLoader( 'images/blank.png' ) },
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

SystemSettings.createWall = function(xWidth, zWidth, xPos, zPos, rotate) {
    var yWidth = 60; // standard height for walls
    var yPos = yWidth / 2; // standard center y for walls

    var ratio = 20;

    var texture1; // long
    var texture2; // short

    // setting wall textures for different levels
    if (Game.level == 0) {
        texture1 = new THREE.TextureLoader().load( "textures/wall.jpg" ); 
        texture2 = new THREE.TextureLoader().load( "textures/wall.jpg" ); 
    }
    else if (Game.level == 1 || Game.level == 2) {
        texture1 = new THREE.TextureLoader().load( "textures/terrace.jpg" );  
        texture2 = new THREE.TextureLoader().load( "textures/terrace.jpg" );
    } 
    else {
        texture1 = new THREE.TextureLoader().load( "textures/campus_walls.jpg" );  
        texture2 = new THREE.TextureLoader().load( "textures/campus_walls.jpg" );
    }

    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;

    // Create an array of materials to be used in a cube, one for each side
    var cubeMaterialArray = [];
    var cubeMaterials;

    texture2.repeat.set( xWidth/ratio, yWidth/ratio );
    texture1.repeat.set( zWidth/ratio, yWidth/ratio );

    if (Game.level == 1 || Game.level == 2) {
        var randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: texture1 } ) ); // red: x
        randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: texture1 } ) ); // orange  x

        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0xffff33 } ) ); // yellow
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0x33ff33 } ) ); // green

        randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: texture2 } ) ); // blue  z
        randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: randColor, map: texture2 } ) ); // purple  z

        cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
    }
    else {
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: texture1 } ) ); // red: x
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: texture1 } ) ); // orange  x
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0xffff33 } ) ); // yellow
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: 0x33ff33 } ) ); // green
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: texture2 } ) ); // blue  z
        cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: texture2 } ) ); // purple  z

        cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
    }

    var wall_geo = new THREE.BoxGeometry(xWidth, yWidth, zWidth);
    var wall = new THREE.Mesh(wall_geo, cubeMaterials);
    wall.position.set( xPos, yPos, zPos);
    return wall;
};

SystemSettings.addObjectFromFile = function( fileTexture, fileObj, xPos, yPos, zPos, scale, rotateX, rotateY ) {
    var file_texture = 'textures/' + fileTexture;
    var file_obj = 'animated_models/' + fileObj;
    var texture = THREE.ImageUtils.loadTexture( file_texture );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    var material = new THREE.MeshPhongMaterial( {map: texture});

    var objLoader = new THREE.OBJLoader();
    objLoader.load(file_obj, function (obj) {
            obj.position.set(xPos, yPos, zPos);
            obj.scale.multiplyScalar(scale);
            obj.rotation.x = rotateX * Math.PI / 2;
            obj.rotation.y = rotateY * Math.PI / 2;
            obj.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            obj.name = fileObj;
            Scene.addObject(obj);
        });
}

SystemSettings.addMTLObjectFromFile = function( fileTexture, fileObj, xPos, yPos, zPos, scale, rotateX, rotateY ) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl( 'textures/' );
    mtlLoader.setPath( 'textures/' );
    mtlLoader.load( fileTexture, function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'animated_models/' );
        objLoader.load( fileObj, function ( object ) {

            object.position.set(xPos, yPos, zPos);
            object.scale.multiplyScalar(scale);
            object.rotation.x = rotateX * Math.PI / 2;
            object.rotation.y = rotateY * Math.PI / 2;
            Scene.addObject( object );

        });

    });
}

////////////////////////////////////////////////////////////////////////////////
// Level 0: NO GRAVITY - IT CREATES BAD ARTIFACTS/MOVEMENTS
//////Z//////////////////////////////////////////////////////////////////////////

SystemSettings.level0 = {

    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,
    numObjects:         1,

    // Initialization
    initializerFunction : TargetInitializer0,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 220.0, 0.0, -70.0, 1.0 ),
        color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 0 ),
        velocity: new THREE.Vector3 ( 0.0, 30.0, 0.0),
        lifetime: 5,
        size:     0.0,
    },

    // Update
    updaterFunction : TargetUpdater0,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 1.8 } ],
            bounceBoxes: [ {boxDef: {xmin:-35, xmax:35, ymin:-100, ymax:100, zmin:145, zmax:165}, damping : 1 },
                            {boxDef: {xmin:-35, xmax:-15, ymin:-100, ymax:100, zmin:65, zmax:155}, damping : 1 },
                            {boxDef: {xmin:-75, xmax:-25, ymin:-100, ymax:100, zmin:65, zmax:85}, damping : 1 },
                            {boxDef: {xmin:-85, xmax:-65, ymin:-100, ymax:100, zmin:65, zmax:105}, damping : 1 },
                            {boxDef: {xmin:-75, xmax:-35, ymin:-100, ymax:100, zmin:95, zmax:115}, damping : 1 },
                            {boxDef: {xmin:-55, xmax:-35, ymin:-100, ymax:100, zmin:95, zmax:155}, damping : 1 },
                            {boxDef: {xmin:-135, xmax:-45, ymin:-100, ymax:100, zmin:135, zmax:155}, damping : 1 },
                            {boxDef: {xmin:-135, xmax:-115, ymin:-100, ymax:100, zmin:-45, zmax:145}, damping : 1 },
                            {boxDef: {xmin:-125, xmax:-65, ymin:-100, ymax:100, zmin:-45, zmax:-25}, damping : 1 },
                            {boxDef: {xmin:-85, xmax:-65, ymin:-100, ymax:100, zmin:-35, zmax:35}, damping : 1 },
                            {boxDef: {xmin:-75, xmax:-25, ymin:-100, ymax:100, zmin:15, zmax:35}, damping : 1 },
                            {boxDef: {xmin:-45, xmax:-25, ymin:-100, ymax:100, zmin:-85, zmax:25}, damping : 1 },
                            {boxDef: {xmin:-35, xmax:115, ymin:-100, ymax:100, zmin:-85, zmax:-65}, damping : 1 },
                            {boxDef: {xmin:95, xmax:115, ymin:-100, ymax:100, zmin:-75, zmax:-15}, damping : 1 },
                            {boxDef: {xmin:5, xmax:105, ymin:-100, ymax:100, zmin:-35, zmax:-15}, damping : 1 },
                            {boxDef: {xmin:5, xmax:25, ymin:-100, ymax:100, zmin:-25, zmax:35}, damping : 1 },
                            {boxDef: {xmin:15, xmax:155, ymin:-100, ymax:100, zmin:15, zmax:35}, damping : 1 },
                            {boxDef: {xmin:135, xmax:155, ymin:-100, ymax:100, zmin:-115, zmax:25}, damping : 1 },
                            {boxDef: {xmin:145, xmax:265, ymin:-100, ymax:100, zmin:-115, zmax:-95}, damping : 1 },
                            {boxDef: {xmin:245, xmax:265, ymin:-100, ymax:100, zmin:-105, zmax:-25}, damping : 1 },
                            {boxDef: {xmin:185, xmax:255, ymin:-100, ymax:100, zmin:-45, zmax:-25}, damping : 1 },
                            {boxDef: {xmin:185, xmax:205, ymin:-100, ymax:100, zmin:-35, zmax:25}, damping : 1 },
                            {boxDef: {xmin:195, xmax:325, ymin:-100, ymax:100, zmin:5, zmax:25}, damping : 1 },
                            {boxDef: {xmin:305, xmax:325, ymin:-100, ymax:100, zmin:15, zmax:145}, damping : 1 },
                            {boxDef: {xmin:245, xmax:315, ymin:-100, ymax:100, zmin:125, zmax:145}, damping : 1 },
                            {boxDef: {xmin:245, xmax:265, ymin:-100, ymax:100, zmin:55, zmax:135}, damping : 1 },
                            {boxDef: {xmin:195, xmax:255, ymin:-100, ymax:100, zmin:55, zmax:75}, damping : 1 },
                            {boxDef: {xmin:195, xmax:215, ymin:-100, ymax:100, zmin:65, zmax:155}, damping : 1 },
                            {boxDef: {xmin:45, xmax:205, ymin:-100, ymax:100, zmin:135, zmax:155}, damping : 1 },
                            {boxDef: {xmin:45, xmax:65, ymin:-100, ymax:100, zmin:85, zmax:145}, damping : 1 },
                            {boxDef: {xmin:55, xmax:155, ymin:-100, ymax:100, zmin:85, zmax:105}, damping : 1 },
                            {boxDef: {xmin:145, xmax:165, ymin:-100, ymax:100, zmin:65, zmax:105}, damping : 1 },
                            {boxDef: {xmin:15, xmax:155, ymin:-100, ymax:100, zmin:65, zmax:85}, damping : 1 },
                            {boxDef: {xmin:15, xmax:35, ymin:-100, ymax:100, zmin:75, zmax:155}, damping : 1 }],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    walls         : [],
    createScene : function () {
        // setting up sky
        var skyGeo = new THREE.PlaneBufferGeometry(800, 600, 1, 1);
        var skyTexture = new THREE.TextureLoader().load( "textures/space.jpg" );
        var skyMaterial = new THREE.MeshPhongMaterial({ map: skyTexture, side: THREE.DoubleSide });
        var sky = new THREE.Mesh(skyGeo, skyMaterial);
        sky.rotation.x = -1.57;
        sky.position.y = 60;
        Scene.addObject(sky);


        // grass texture of plane
        var texture = new THREE.TextureLoader().load( "textures/grasslight-big.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 20, 20 );

        var plane_geo = new THREE.PlaneBufferGeometry( 800, 600, 1, 1 );
        var phongGreen     = new THREE.MeshPhongMaterial( {color: 0x003200, emissive: 0x222222, side: THREE.DoubleSide, map: texture} );

        var plane     = new THREE.Mesh( plane_geo, phongGreen );

        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );

      
        // diablo: 
        SystemSettings.addObjectFromFile( 'diablo.jpg', 'diablo.obj', 50, 10, -50, 45, 0, 3);

        // batman
        SystemSettings.addObjectFromFile( 'batman_body.png', 'batman.obj', 35, 1.5, -52, 0.1, 1, 0 );

        // bus
        SystemSettings.addObjectFromFile( 'bus.png', 'bus.obj', -85, 0, 0, 45, 0, 0 );

        // bear
        SystemSettings.addObjectFromFile( 'bear.jpg', 'bear-obj.obj', 290, 0, 90, 1.5, 0, 2.3 );

        // dummy
        SystemSettings.addObjectFromFile( 'dummy.jpg', 'dummy.obj', -65, 0, 125, 0.18, 0, 3 );

        // BB8
        SystemSettings.addObjectFromFile( 'bb8.jpg', 'bb8.obj', 100, 0, 120, 0.25, 0, 3 );

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


        var loader = new THREE.FontLoader();
        loader.load( 'js/helvetiker_regular.typeface.js', function ( font ) {

            var textGeo = new THREE.TextGeometry( "HELP ! !", {

            bevelThickness: 0.5,
            bevelSize: 0.25,
            bevelSegments: 2,
            bevelEnabled: true,
                font: font,

                size: 10,
                height: 5,
                curveSegments: 12,

            });

            textGeo.computeBoundingBox();
            var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

            var textMaterial = new THREE.MeshPhongMaterial( { color: 0x1111ff, specular: 0x00ffff } );

            var mesh = new THREE.Mesh( textGeo, textMaterial );
            mesh.position.x = -20;
            mesh.position.y = 30;
            mesh.position.z = 50;
            mesh.rotation.y = 0;
            mesh.rotation.z = 0.2;
            mesh.rotation.x = 0.1;
            

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            Scene.addObject( mesh );

        } );

// -83.01874854819191, 10, 44.760892769978454
        var loader = new THREE.FontLoader();
        loader.load( 'js/helvetiker_regular.typeface.js', function ( font ) {

            var textGeo = new THREE.TextGeometry( "WHERE", {

            bevelThickness: 0.5,
            bevelSize: 0.25,
            bevelSegments: 2,
            bevelEnabled: true,
                font: font,

                size: 5,
                height: 2.5,
                curveSegments: 12,

            });

            textGeo.computeBoundingBox();
            var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

            var textMaterial = new THREE.MeshPhongMaterial( { color: 0x1111ff, specular: 0x00ffff } );

            var mesh = new THREE.Mesh( textGeo, textMaterial );
            mesh.position.x = -80;
            mesh.position.y = 40;
            mesh.position.z = 70;
            mesh.rotation.y = Math.PI/2.0;
            mesh.rotation.z = -0.2;
            mesh.rotation.x = -0.1;
            

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            Scene.addObject( mesh );

        } );

        var loader = new THREE.FontLoader();
        loader.load( 'js/helvetiker_regular.typeface.js', function ( font ) {

            var textGeo = new THREE.TextGeometry( "ARE YOU ?", {

            bevelThickness: 0.5,
            bevelSize: 0.25,
            bevelSegments: 2,
            bevelEnabled: true,
                font: font,

                size: 5,
                height: 2.5,
                curveSegments: 12,

            });

            textGeo.computeBoundingBox();
            var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

            var textMaterial = new THREE.MeshPhongMaterial( { color: 0x1111ff, specular: 0x00ffff } );

            var mesh = new THREE.Mesh( textGeo, textMaterial );
            mesh.position.x = -80;
            mesh.position.y = 30;
            mesh.position.z = 70;
            mesh.rotation.y = Math.PI/2.0;
            mesh.rotation.z = -0.2;
            mesh.rotation.x = -0.1;
            

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            Scene.addObject( mesh );

        } );



        var loader = new THREE.FontLoader();
        loader.load( 'js/helvetiker_regular.typeface.js', function ( font ) {

            var textGeo = new THREE.TextGeometry( "FIND ME!", {

            bevelThickness: 0.5,
            bevelSize: 0.25,
            bevelSegments: 2,
            bevelEnabled: true,
                font: font,

                size: 7,
                height: 2.5,
                curveSegments: 12,

            });

            textGeo.computeBoundingBox();
            var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

            var textMaterial = new THREE.MeshPhongMaterial( { color: 0x1111ff, specular: 0x00ffff } );

            var mesh = new THREE.Mesh( textGeo, textMaterial );
            mesh.position.x = 200;
            mesh.position.y = 40;
            mesh.position.z = 27;
            mesh.rotation.y = -Math.PI/2.0;

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            Scene.addObject( mesh );

        } );


    },
};

SystemSettings.level1 = {

    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,
    numObjects:         0,

    // Initialization
    initializerFunction : TargetInitializer1,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 0.0, 5.0, 0.0, 1.0 ),
        color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 0 ),
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
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 1.8 } ],
            bounceBoxes: [{boxDef: {xmin:-205, xmax:-185, ymin:-100, ymax:100, zmin:-135, zmax:165}, damping : 1 },
                            {boxDef: {xmin:-205, xmax:215, ymin:-100, ymax:100, zmin:155, zmax:175}, damping : 1 },
                            {boxDef: {xmin:-65, xmax:-45, ymin:-100, ymax:100, zmin:15, zmax:165}, damping : 1 },
                            {boxDef: {xmin:25, xmax:45, ymin:-100, ymax:100, zmin:55, zmax:165}, damping : 1 },
                            {boxDef: {xmin:195, xmax:215, ymin:-100, ymax:100, zmin:-145, zmax:165}, damping : 1 },
                            {boxDef: {xmin:75, xmax:205, ymin:-100, ymax:100, zmin:75, zmax:95}, damping : 1 },
                            {boxDef: {xmin:25, xmax:205, ymin:-100, ymax:100, zmin:5, zmax:25}, damping : 1 },
                            {boxDef: {xmin:-205, xmax:205, ymin:-100, ymax:100, zmin:-145, zmax:-125}, damping : 1 },
                            {boxDef: {xmin:45, xmax:65, ymin:-100, ymax:100, zmin:-135, zmax:-25}, damping : 1 },
                            {boxDef: {xmin:-65, xmax:-45, ymin:-100, ymax:100, zmin:-135, zmax:-15}, damping : 1 },
                            {boxDef: {xmin:-155, xmax:-55, ymin:-100, ymax:100, zmin:-65, zmax:-45}, damping : 1 },
                            {boxDef: {xmin:-55, xmax:5, ymin:-100, ymax:100, zmin:-45, zmax:-25}, damping : 1 }],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    walls: [],

    createScene : function () {
        // setting up sky
        var skyGeo = new THREE.PlaneBufferGeometry(600, 500, 1, 1);
        var skyTexture = new THREE.TextureLoader().load( "textures/sky.jpg" );
        var skyMaterial = new THREE.MeshPhongMaterial({ map: skyTexture, side: THREE.DoubleSide });
        var sky = new THREE.Mesh(skyGeo, skyMaterial);
        sky.rotation.x = -1.57;
        sky.position.y = 60;
        Scene.addObject(sky);

        // wood texture of plane
        var texture = new THREE.TextureLoader().load( "textures/wood_floor.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 50, 50 );

        var plane_geo = new THREE.PlaneBufferGeometry( 600, 500, 1, 1 );
        var floor_material     = new THREE.MeshPhongMaterial( {emissive: 0x222222, side: THREE.DoubleSide, map: texture} );
        var plane     = new THREE.Mesh( plane_geo, floor_material );
        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );

        // create officers
        // Storm
        SystemSettings.addObjectFromFile( 'storm.png', 'storm.obj', 180, 0, 140, 0.1, 0, 2.5); // GOAL
         
        // Iron Man
        SystemSettings.addObjectFromFile( 'iron_man.png', 'iron_man.obj', -170, 0, 140, 17, 0, 1.5);

        // Deadpool
        SystemSettings.addObjectFromFile( 'deadpool.png', 'deadpool.obj', -80, 0, -110, 0.30, 0, 3.25);

        // Flash
        SystemSettings.addObjectFromFile( 'flash.png', 'flash.obj', -30, 0, -110, 3, 0, 3.5);

        // spiderman
        SystemSettings.addObjectFromFile( 'spiderman.jpg', 'spiderman.obj', 170, 0, -110, 7, 0, -0.5);        

        // shockwave
        SystemSettings.addObjectFromFile( 'shockwave.bmp', 'shockwave.obj', 180, 0, 40, 17, 0, 1);

        // pizza
        SystemSettings.addObjectFromFile( 'pizza.png', 'pizza.obj', -10, 0, 130, 23, 0, 2 );

        // main dining area 
        // table #1 
        SystemSettings.addObjectFromFile( 'wood_table.jpg', 'table.obj', 85, 5, -100, 0.125, 0, 1); 

        SystemSettings.addObjectFromFile( 'wood_table.jpg', 'table.obj', 85, 5, -75, 0.125, 0, 1); 

        // table #2
        SystemSettings.addObjectFromFile( 'wood_table.jpg', 'table.obj', 115, 5, -100, 0.125, 0, 1); 

        SystemSettings.addObjectFromFile( 'wood_table.jpg', 'table.obj', 115, 5, -75, 0.125, 0, 1);

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


        var loader = new THREE.FontLoader();
        loader.load( 'js/helvetiker_regular.typeface.js', function ( font ) {

            var textGeo = new THREE.TextGeometry( "PIZZA", {

            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 2,
            bevelEnabled: true,
                font: font,

                size: 15,
                height: 5,
                curveSegments: 12,

            });

            textGeo.computeBoundingBox();
            var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

            var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0011, specular: 0x00ffff } );

            var mesh = new THREE.Mesh( textGeo, textMaterial );
            mesh.position.x = -40;
            mesh.position.y = 30;
            mesh.position.z = 15;
            mesh.rotation.y = 0;

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            Scene.addObject( mesh );

        } );

        var loader = new THREE.FontLoader();
        loader.load( 'js/helvetiker_regular.typeface.js', function ( font ) {

            var textGeo = new THREE.TextGeometry( "WE WANT", {

            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 2,
            bevelEnabled: true,
                font: font,

                size: 10,
                height: 5,
                curveSegments: 12,

            });

            textGeo.computeBoundingBox();
            var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

            var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0011, specular: 0x00ffff } );

            var mesh = new THREE.Mesh( textGeo, textMaterial );
            mesh.position.x = -45;
            mesh.position.y = 50;
            mesh.position.z = 15;
            mesh.rotation.y = 0;

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            Scene.addObject( mesh );

        } );


    },
};

SystemSettings.level2 = {

    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,
    numObjects:         0,

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
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 1.8 } ],
            bounceBoxes: [{boxDef: {xmin:-205, xmax:-185, ymin:-100, ymax:100, zmin:-135, zmax:165}, damping : 1 },
                            {boxDef: {xmin:-205, xmax:215, ymin:-100, ymax:100, zmin:155, zmax:175}, damping : 1 },
                            {boxDef: {xmin:-65, xmax:-45, ymin:-100, ymax:100, zmin:15, zmax:165}, damping : 1 },
                            {boxDef: {xmin:25, xmax:45, ymin:-100, ymax:100, zmin:55, zmax:165}, damping : 1 },
                            {boxDef: {xmin:195, xmax:215, ymin:-100, ymax:100, zmin:-145, zmax:165}, damping : 1 },
                            {boxDef: {xmin:75, xmax:205, ymin:-100, ymax:100, zmin:75, zmax:95}, damping : 1 },
                            {boxDef: {xmin:25, xmax:205, ymin:-100, ymax:100, zmin:5, zmax:25}, damping : 1 },
                            {boxDef: {xmin:-205, xmax:205, ymin:-100, ymax:100, zmin:-145, zmax:-125}, damping : 1 },
                            {boxDef: {xmin:45, xmax:65, ymin:-100, ymax:100, zmin:-135, zmax:-25}, damping : 1 },
                            {boxDef: {xmin:-65, xmax:-45, ymin:-100, ymax:100, zmin:-135, zmax:-15}, damping : 1 },
                            {boxDef: {xmin:-155, xmax:-55, ymin:-100, ymax:100, zmin:-65, zmax:-45}, damping : 1 },
                            {boxDef: {xmin:-55, xmax:5, ymin:-100, ymax:100, zmin:-45, zmax:-25}, damping : 1 }],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    walls: [],
    createScene : function () {
        // setting up sky
        var skyGeo = new THREE.PlaneBufferGeometry(600, 500, 1, 1);
        var skyTexture = new THREE.TextureLoader().load( "textures/sky.jpg" );
        var skyMaterial = new THREE.MeshPhongMaterial({ map: skyTexture, side: THREE.DoubleSide });
        var sky = new THREE.Mesh(skyGeo, skyMaterial);
        sky.rotation.x = -1.57;
        sky.position.y = 60;
        Scene.addObject(sky);

        // wood texture of plane
        var texture = new THREE.TextureLoader().load( "textures/wood_floor.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 50, 50 );

        var plane_geo = new THREE.PlaneBufferGeometry( 600, 500, 1, 1 );
        var floor_material     = new THREE.MeshPhongMaterial( {emissive: 0x222222, side: THREE.DoubleSide, map: texture} );
        var plane     = new THREE.Mesh( plane_geo, floor_material );
        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );

        // create officers

        // Storm
        SystemSettings.addObjectFromFile( 'storm.png', 'storm.obj', 180, 0, 140, 0.1, 0, 2.5); // GOAL
         
        // Iron Man
        SystemSettings.addObjectFromFile( 'iron_man.png', 'iron_man.obj', -170, 0, 140, 17, 0, 1.5);

        // Deadpool
        SystemSettings.addObjectFromFile( 'deadpool.png', 'deadpool.obj', -80, 0, -110, 0.30, 0, 3.25);

        // Flash
        SystemSettings.addObjectFromFile( 'flash.png', 'flash.obj', -30, 0, -110, 3, 0, 3.5);

        // spiderman
        SystemSettings.addObjectFromFile( 'spiderman.jpg', 'spiderman.obj', 170, 0, -110, 7, 0, -0.5);        

        // shockwave
        SystemSettings.addObjectFromFile( 'shockwave.bmp', 'shockwave.obj', 180, 0, 40, 17, 0, 1);

        // main dining area 
        // table #1 
        SystemSettings.addObjectFromFile( 'wood_table.jpg', 'table.obj', 85, 5, -100, 0.125, 0, 1); 

        SystemSettings.addObjectFromFile( 'wood_table.jpg', 'table.obj', 85, 5, -75, 0.125, 0, 1); 

        // table #2
        SystemSettings.addObjectFromFile( 'wood_table.jpg', 'table.obj', 115, 5, -100, 0.125, 0, 1); 

        SystemSettings.addObjectFromFile( 'wood_table.jpg', 'table.obj', 115, 5, -75, 0.125, 0, 1); 

        // desk -30 -25
        SystemSettings.addObjectFromFile( 'desk.jpg', 'desk.obj', -30, 0, -25, 0.1, 0, 0 ); 

        // printer: +3, +8, +5, 0.13, 0, 0 (relative to desk) -- FINAL GOAL
        SystemSettings.addObjectFromFile( 'printer.jpg', 'printer.obj', -33, 8, -20, 0.13, 0, 0 );

        // computer: -3, +6.8, +2, 0.7, 0, 0 (relative to desk)
        SystemSettings.addObjectFromFile( 'computer.jpg', 'computer.obj', -27, 6.8, -22.5, 0.7, 0, 0 );


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
        sphere:   new THREE.Vector4 ( -190, 0.0, -60.0, 1.0 ),
        color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 0.0 ),
        velocity: new THREE.Vector3 ( 0.0, 30.0, 0.0),
        lifetime: 5,
        size:     0.0,
    },

    // Update
    updaterFunction : TargetUpdater3,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 1.8 } ],
            bounceBoxes: [{boxDef: {xmin:-315, xmax:45, ymin:-100, ymax:100, zmin:225, zmax:245}, damping : 1 },
                            {boxDef: {xmin:35, xmax:55, ymin:-100, ymax:100, zmin:-265, zmax:245}, damping : 1 },
                            {boxDef: {xmin:-315, xmax:45, ymin:-100, ymax:100, zmin:-265, zmax:-245}, damping : 1 },
                            {boxDef: {xmin:-315, xmax:-295, ymin:-100, ymax:100, zmin:-255, zmax:235}, damping : 1 },
                            {boxDef: {xmin:-55, xmax:-35, ymin:-100, ymax:100, zmin:205, zmax:235}, damping : 1 },
                            {boxDef: {xmin:-55, xmax:-35, ymin:-100, ymax:100, zmin:145, zmax:175}, damping : 1 },
                            {boxDef: {xmin:-265, xmax:-35, ymin:-100, ymax:100, zmin:135, zmax:155}, damping : 1 },
                            {boxDef: {xmin:-215, xmax:-195, ymin:-100, ymax:100, zmin:15, zmax:105}, damping : 1 },
                            {boxDef: {xmin:-165, xmax:-145, ymin:-100, ymax:100, zmin:15, zmax:105}, damping : 1 },
                            {boxDef: {xmin:-115, xmax:-35, ymin:-100, ymax:100, zmin:85, zmax:105}, damping : 1 },
                            {boxDef: {xmin:-55, xmax:-35, ymin:-100, ymax:100, zmin:25, zmax:95}, damping : 1 },
                            {boxDef: {xmin:-115, xmax:-35, ymin:-100, ymax:100, zmin:15, zmax:35}, damping : 1 },
                            {boxDef: {xmin:-305, xmax:-265, ymin:-100, ymax:100, zmin:-35, zmax:-15}, damping : 1 },
                            {boxDef: {xmin:-235, xmax:-195, ymin:-100, ymax:100, zmin:-35, zmax:-15}, damping : 1 },
                            {boxDef: {xmin:-215, xmax:-195, ymin:-100, ymax:100, zmin:-95, zmax:-25}, damping : 1 },
                            {boxDef: {xmin:-95, xmax:45, ymin:-100, ymax:100, zmin:-45, zmax:-25}, damping : 1 },
                            {boxDef: {xmin:-95, xmax:45, ymin:-100, ymax:100, zmin:-105, zmax:-85}, damping : 1 },
                            {boxDef: {xmin:-185, xmax:-165, ymin:-100, ymax:100, zmin:-295, zmax:-215}, damping : 1 },
                            {boxDef: {xmin:-255, xmax:-215, ymin:-100, ymax:100, zmin:-155, zmax:-135}, damping : 1 },
                            {boxDef: {xmin:-185, xmax:-125, ymin:-100, ymax:100, zmin:-155, zmax:-135}, damping : 1 },
                            {boxDef: {xmin:-145, xmax:-125, ymin:-100, ymax:100, zmin:-215, zmax:-145}, damping : 1 },
                            {boxDef: {xmin:-45, xmax:-25, ymin:-100, ymax:100, zmin:-215, zmax:-135}, damping : 1 }],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    walls : [],
    createScene : function () {
        // setting up sky
        var skyGeo = new THREE.PlaneBufferGeometry(700, 900, 1, 1);
        var skyTexture = new THREE.TextureLoader().load( "textures/sky.jpg" );
        var skyMaterial = new THREE.MeshPhongMaterial({ map: skyTexture, side: THREE.DoubleSide });
        var sky = new THREE.Mesh(skyGeo, skyMaterial);
        sky.rotation.x = -1.57;
        sky.position.y = 60;
        Scene.addObject(sky);
        
        // wood texture of plane
        var texture = new THREE.TextureLoader().load( "textures/campus_floor.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 50, 50 );

        var plane_geo = new THREE.PlaneBufferGeometry( 700, 900, 1, 1 );
        var floor_material     = new THREE.MeshPhongMaterial( {emissive: 0x222222, side: THREE.DoubleSide, map: texture} );
        var plane     = new THREE.Mesh( plane_geo, floor_material );
        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );

        // desk
        SystemSettings.addObjectFromFile( 'desk.jpg', 'desk.obj', 20, 0, -115, 0.1, 0, 2 ); 

        // printer: +3, +8.5, +5, 0.13, 0, 0 (relative to desk) -- 
        SystemSettings.addObjectFromFile( 'printer.jpg', 'printer.obj', 23, 8, -120, 0.13, 0, 2 );

        // computer: -3, +6.8, +2, 0.7, 0, 0 (relative to desk)
        SystemSettings.addObjectFromFile( 'computer.jpg', 'computer.obj', 17, 6.8, -117.5, 0.7, 0, 2 );

        // Mario
        SystemSettings.addObjectFromFile( 'mario.jpg', 'mario.obj', -150, 0, -170, 0.25, 0, 3 );

        // Luigi
        SystemSettings.addObjectFromFile( 'luigi.jpg', 'luigi.obj', -230, 0, -180, 0.25, 0, 1 );        

        // chair
        SystemSettings.addObjectFromFile( 'chair.jpg', 'chair.obj', -220, 7.5, -65, 0.75, 0, 3 ); 

        // spongebob
        SystemSettings.addObjectFromFile( 'spongebob.jpg', 'spongebob.obj', -30, 0, -70, 23, 0, 3 );

        // mr. krabs
        SystemSettings.addObjectFromFile( 'mr_krabs.png', 'mr_krabs.obj', -75, 0, 60, 17, 0, 3 );

        // patrick
        SystemSettings.addObjectFromFile( 'patrick.jpg', 'patrick.obj', -50, 0, -180, 18, 0, 3 );

        // // Professor -- GOAL
        // SystemSettings.addObjectFromFile( 'professor.png', 'professor.obj', -190, 0, -60, 10, 0, 1 );


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
