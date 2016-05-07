// This js file abstracts away the scene setup of three.js
// If you want to change apperance of the materials, or lighting,
// this is the file to look at.
// Important methods include addition and removal of objects from
// three.js scene, that will be used in main.js

"use strict";
var Scene = Scene || {
    _scene     : undefined,
    _materials : [],
    _axis      : undefined,
    _grid      : undefined,
    _light     : [],
    _objects   : [],
};

// creates default scene
Scene.create = function () {
    Scene._scene  = new THREE.Scene();
    Scene.setupLighting();
    Scene.setupMaterials();
};

// Lights
Scene.setupLighting = function() {
    this._light[0] = new THREE.AmbientLight( 0x303030, 2.0 ); // soft white light
    Scene._scene.add(this._light[0]);

    this._light[1]    = new THREE.PointLight( 0xffffff, 2.0, 500.0 );
    this._light[1].position.set( 0, 250, 0 );
    Scene._scene.add( this._light[1]  );
};

// Materials
Scene.setupMaterials = function() {
    var default_mat = new THREE.MeshLambertMaterial( { color : 0x555555 } );
    Scene._materials.push( default_mat );

};

Scene.getDefaultMaterial = function() {
    return Scene._materials[0];
};

Scene.getMaterial = function( id ) {
    if ( id >= Scene._materials.length || id < 0 ) return scene._materials[0];
    return Scene._materials[id];
};

Scene.addMaterial = function( material ) {
    Scene._materials.push ( material );
};


// Objects
Scene.addObject = function ( object ) {
    // object.castShadow    = true;
    // object.receiveShadow = false;
    Scene._scene.add( object );
    Scene._objects.push( object );
    
        var loader = new THREE.OBJLoader();
    loader.load( "animated_models/001.obj", function ( object ) {
        Scene._scene.add( object );
    } );
};

Scene.removeObject = function ( object ) {
    Scene._scene.remove( object );
};

Scene.removeObjects = function ( object ) {
    for ( var i = 0 ; i < Scene._objects.length ; ++i ) {
        if ( Scene._objects[i] != undefined ) {
            Scene._scene.remove( Scene._objects[i] );
        }
    }

    Scene._objects = [];
}

// axis and grid
Scene.addAxis = function() {
    var r = new THREE.LineBasicMaterial( {color: new THREE.Color( 0.850, 0.325, 0.098 ), linewidth: 4, opacity: 0.5, transparent: true });
    var g = new THREE.LineBasicMaterial( {color: new THREE.Color( 0.466, 0.674, 0.188 ), linewidth: 4, opacity: 0.5, transparent: true });
    var b = new THREE.LineBasicMaterial( {color: new THREE.Color( 0.000, 0.447, 0.741 ), linewidth: 4, opacity: 0.5, transparent: true });

    var x_axis_geo = new THREE.Geometry();
    var y_axis_geo = new THREE.Geometry();
    var z_axis_geo = new THREE.Geometry();
    x_axis_geo.vertices.push( new THREE.Vector3( -10.5, 0, 0 ) );
    x_axis_geo.vertices.push( new THREE.Vector3(  10.5, 0, 0 ) );

    y_axis_geo.vertices.push( new THREE.Vector3( 0, -10.5, 0 ) );
    y_axis_geo.vertices.push( new THREE.Vector3( 0,  10.5, 0 ) );

    z_axis_geo.vertices.push( new THREE.Vector3( 0, 0, -10.5 ) );
    z_axis_geo.vertices.push( new THREE.Vector3( 0, 0,  10.5 ) );

    var x_axis = new THREE.Line( x_axis_geo, r );
    var y_axis = new THREE.Line( y_axis_geo, b );
    var z_axis = new THREE.Line( z_axis_geo, g );

    this._scene.add( x_axis );
    this._scene.add( y_axis );
    this._scene.add( z_axis );

    this._axis = [x_axis, y_axis, z_axis];
};

Scene.addGrid = function() {
    var w = new THREE.LineBasicMaterial( {color: new THREE.Color( 0.95, 0.95, 0.95 ), linewidth: 5, opacity: 0.3, transparent: true });

    var grid_geo = new THREE.Geometry();
    for ( var i = -10; i <= 10 ; ++i ) {
        if ( i === 0 ) continue;
        grid_geo.vertices.push( new THREE.Vector3( i,  0, -10 ) );
        grid_geo.vertices.push( new THREE.Vector3( i,  0,  10 ) );
        grid_geo.vertices.push( new THREE.Vector3( -10, 0, i ) );
        grid_geo.vertices.push( new THREE.Vector3( 10,  0,  i ) );
    }
    var grid = new THREE.Line( grid_geo, w, THREE.LinePieces );
    this._scene.add( grid );


    this._grid = grid;
};

Scene.showGrid = function () {
    this._grid.visible = true;
};

Scene.hideGrid = function () {
    this._grid.visible = false;
};

Scene.showAxis = function () {
    this._axis[0].visible = true;
    this._axis[1].visible = true;
    this._axis[2].visible = true;
};

Scene.hideAxis = function (){
    this._axis[0].visible = false;
    this._axis[1].visible = false;
    this._axis[2].visible = false;
};
