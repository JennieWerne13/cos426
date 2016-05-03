window.onload = function() {
    
    var cmd = Parser.getCommands(document.URL)[0];
        
    var height = cmd.height || window.innerHeight;
    var width  = cmd.width  || window.innerWidth;

    var interactive_space_ratio = 0.75;
    height = height*interactive_space_ratio;
    width = window.innerWidth*(interactive_space_ratio) - 50;
        
    var animated= cmd.animated|| 0;
    var paused = false;
    var debug = cmd.debug||false;

    Scene.sceneName = cmd.scene || "default";
    Raytracer.init(height, width, debug);
    Scene.setUniforms();
    
    document.getElementById("topdiv").style.height = window.innerHeight*(1.0 - interactive_space_ratio)/2.0+ "px";
    document.getElementById("bottomdiv").style.height = window.innerHeight*(1.0 - interactive_space_ratio)/2.0+ "px";
    
    document.getElementById("leftdiv").style.width = window.innerWidth*(interactive_space_ratio) - 50 + "px";
    document.getElementById("rightdiv").style.width = window.innerWidth*(1.0 - interactive_space_ratio) - 50 + "px";
    document.getElementById("rightdiv").style.height = height + "px";

    document.getElementById("rightdiv").style.float = "left";
    document.getElementById("leftdiv").style.float = "left";
    document.getElementById("leftdiv").style.marginLeft = "50px";
    document.getElementById("rightdiv").style.marginRight = "50px";

    document.getElementById("rightdiv").style.backgroundColor = "black";


    var drawScene = function() {

        if (!animated || !paused) Raytracer.render(animated);
        
        requestAnimationFrame(drawScene);
    };

    drawScene();
    
    function snapShot() {
        // get the image data
        try {
            var dataURL = document.getElementById('canvas').toDataURL();
        }
        catch( err ) {
            alert('Sorry, your browser does not support capturing an image.');
            return;
        }

        // this will force downloading data as an image (rather than open in new window)
        var url = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        window.open( url );
    }

    // add event listener that will cause 'I' key to download image
    window.addEventListener( 'keyup', function( event ) {
        // only respond to 'I' key
        if ( event.which == 73 ) {
            snapShot();
        }
        else if ( event.which == 32 ) {
            paused = !paused;
        }
    });
    window.addEventListener( 'keydown', function( event ) {
        // only respond to 'I' key
        if (event.which == 38) {
            Raytracer.handleZoom(1.0);  
        }else if (event.which == 40) {
            Raytracer.handleZoom(-1.0); 
        }
    });
}
   