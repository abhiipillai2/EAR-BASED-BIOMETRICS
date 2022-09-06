//opencv
let capturImg = document.querySelector("#captureBtn")
var capture = document.getElementById( "canvas_output" );
var snapshot = document.getElementById( "snapshot" );
let video = document.getElementById("cam_input"); // video is the id of video tag

//event lisner for capture
capturImg.addEventListener("click", function() {

    document.querySelector("#imgNo2").textContent = "camera opened"
    document.querySelector("#imgNo2").textContent = "Please wait capuring images"
    //opencv event
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
        
    })
    .catch(function(err) {
        console.log("An error occurred! " + err);
    });
    
});

//sleep function
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

//stop function
function stopStreamedVideo(videoElem) {
    
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop())
}

//take snap shot
document.getElementById("click").addEventListener('click', async function (){

        
        //getting img count from loca storage
        imgCount = sessionStorage.getItem('imgCount');

        for (let i = 1; i < imgCount; i++) {
            
        
            captureSnapshot();
            console.log(i)
            await sleep(500);
            
        }

        stopStreamedVideo()

        document.querySelector(".box-form").style.display = "none";
        document.querySelector(".box-form-2").style.display = "none";
        document.querySelector(".box-form-3").style.display = "block";


})

///Api part
async function  captureSnapshot() {
    console.log("in capture snapshot")
    var ctx = capture.getContext( '2d' );
    var img = new Image();

    ctx.drawImage( video, 0, 0, capture.width, capture.height );

    img.src		= capture.toDataURL( "image/png" );
    img.width	= capture.width;

    //snapshot.innerHTML = '';

    snapshot.appendChild( img );

    function dataURItoBlob( dataURI ) {

      var byteString = atob( dataURI.split( ',' )[ 1 ] );
      var mimeString = dataURI.split( ',' )[ 0 ].split( ':' )[ 1 ].split( ';' )[ 0 ];
      
      var buffer	= new ArrayBuffer( byteString.length );
      var data	= new DataView( buffer );
      

      for( var i = 0; i < byteString.length; i++ ) {
            data.setUint8( i, byteString.charCodeAt( i ) );
        }

        return new Blob( [ buffer ], { type: mimeString } );
    }

    var request = new XMLHttpRequest();

    request.open( "POST", flask_http_root + "/imgCapture", true );

    // var data	= new FormData();
    var dataURI	= snapshot.firstChild.getAttribute( "src" );
    var imageData   = dataURItoBlob( dataURI );

    //data.append( "image", imageData, "myimage" );
    request.send( imageData );
   // event.preventDefault();
}