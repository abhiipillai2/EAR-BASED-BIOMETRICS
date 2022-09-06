//param part
let label_max_value = document.querySelector("#labelMax")
let count_max_value = document.querySelector("#countMax")
let img_count = document.querySelector("#imgNo")
//navbar DOM
let reeBoot = document.querySelector("#reeBootTr");
let clr = document.querySelector("#clrTr");
let param = document.querySelector("#paramTr");

//lebel max update API call

document.querySelector("#labelBtn").addEventListener("click",function (){

    let label_max = labelMax.value
    //let label_max = 10
    console.log(label_max)
    sendHttpRequest('GET', node_http_root + '/updateParam/label_max/' + label_max);
})

//count max update
document.querySelector("#countBtn").addEventListener("click",function (){

    let label_max = count_max_value.value
    //let label_max = 10
    console.log(label_max)
    sendHttpRequest('GET', node_http_root + '/updateParam/count_max/' + label_max);
})

//img count max update
document.querySelector("#imgBtn").addEventListener("click",function (){

    let label_max = img_count.value
    //let label_max = 10
    console.log(label_max)
    sessionStorage.setItem('imgCount', label_max);
    sendHttpRequest('GET', node_http_root + '/updateParam/img_count/' + label_max);
})


//reoot
reeBoot.addEventListener('click' , function() {

    //sendHttpRequest('GET', flask_http_root + '/dataProcessor');
    sendHttpRequest('GET', flask_http_root + '/trainModel' ).then(responseData => {

        //get value of power from db
        let ar = JSON.parse(JSON.stringify(responseData))
        res = ar.statusCode
        if (res == 200){

            window.alert("sucessfully trained the model")
        }

    });

})

//clear 
clr.addEventListener('click' , function() {

    //sendHttpRequest('GET', flask_http_root + '/dataProcessor');
    sendHttpRequest('GET', flask_http_root + '/allClear' ).then(responseData => {

        //get value of power from db
        let ar = JSON.parse(JSON.stringify(responseData))
        res = ar.statusCode
        if (res == 200){

            window.alert("sucessfully cleared all data")
            
        }

    });

})

//event lisner of param form 
param.addEventListener("click", function() {

    //css action
    document.querySelector(".connect-div").style.display = "block";
});

document.querySelector("#close2").addEventListener("click", function() {

    //css action
    document.querySelector(".connect-div").style.display = "none";
});
