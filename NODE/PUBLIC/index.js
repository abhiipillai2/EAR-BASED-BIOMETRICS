//onbording flow
//let capturImg = document.querySelector("#captureBtn")
let ruDtaPsr = document.querySelector("#runDtaBtn");
let rebootStm = document.querySelector("#rebootBtn");

//event lister for data prossesor
ruDtaPsr.addEventListener("click", function() {

    document.querySelector(".box-form-3 h5").style.display = "block";

    //sendHttpRequest('GET', flask_http_root + '/dataProcessor');
    sendHttpRequest('GET', flask_http_root + '/dataProcessor' ).then(responseData => {

        //get value of power from db
        let ar = JSON.parse(JSON.stringify(responseData))
        res = ar.statusCode
        if (res == 200){

            document.querySelector(".box-form").style.display = "none";
            document.querySelector(".box-form-2").style.display = "none";
            document.querySelector(".box-form-3").style.display = "none";
            document.querySelector(".box-form-4").style.display = "block";
            document.querySelector(".box-form-3 h5").style.display = "none";
        }

    });

    //css action
    //event.preventDefault();
    
});

//event lisner for reoot
rebootStm.addEventListener("click", function() {


    document.querySelector(".box-form-4 h5").style.display = "block";

    //sendHttpRequest('GET', flask_http_root + '/dataProcessor');
    sendHttpRequest('GET', flask_http_root + '/trainModel' ).then(responseData => {

        //get value of power from db
        let ar = JSON.parse(JSON.stringify(responseData))
        res = ar.statusCode
        if (res == 200){

            document.querySelector(".box-form").style.display = "block";
            document.querySelector(".box-form-2").style.display = "none";
            document.querySelector(".box-form-3").style.display = "none";
            document.querySelector(".box-form-4").style.display = "none";
            document.querySelector(".box-form-4 h5").style.display = "none";
        }

    });


    //css action
    //event.preventDefault();
});


