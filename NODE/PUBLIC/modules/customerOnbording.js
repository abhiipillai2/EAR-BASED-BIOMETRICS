let regBtn = document.querySelector("#register1");

let label_max = 0

regBtn.addEventListener("click", function() {

    const email = eMail.value;
    const fName = firstName.value;
    const lName = lastName.value;


    //read config parameter from DB
    sendHttpRequest('GET', node_http_root + '/masterLabel' ).then(responseData => {

        //get value of power from db
        let ar = JSON.parse(JSON.stringify(responseData))
        label_max = ar[0].parameter_value

        //increase label max value
        label_max = label_max + 1;
        console.log(label_max)

        sendHttpRequest('POST', node_http_root + '/userCreation', {
            //JSON FILE FOR PUSH
            dummy : "99",
            first_name: fName,
            last_name: lName,
            e_mail: email,
            master_label : label_max

        });
        

    });

    

    //css action
    event.preventDefault();
    document.querySelector(".box-form").style.display = "none";
    document.querySelector(".box-form-2").style.display = "block";
});
