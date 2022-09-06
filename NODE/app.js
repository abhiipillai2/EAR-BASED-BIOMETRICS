const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
//const logger = require('./logMaster')
const dotenv = require('dotenv').config({ path: './class/sql.env' })
const app = express()
const PORT = process.env.PORT || 5000 //must for production environmentnpm install dotenv --save

//must use body parser for decoding the params from the url
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

//database connection

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});
//for gettng connection stutus
pool.getConnection((err, connection) => {
    if (err) {
        console.log(err)
        //logger.debug("databas is not connected");
        logger.error(err);
    } else {
        console.log("database connection estblished sucessfully!!!")
        //logger.info("database connection estblished sucessfully");

    }
});


//front-end pusher
//index-sat-files
app.use(express.static('PUBLIC'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/index.css'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/index.js'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/js/opencv.js'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/js/utils.js'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/ear_cascade.xml'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/ear_cascade.xml'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/modules/customerOnbording.js'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/modules/apiEngin.js'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/modules/param.js'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/modules/capture.js'))
app.use('/PUBLIC', express.static(__dirname + 'PUBLIC/class/config.js'))

//js config file
app.use('/bin', express.static(__dirname + 'PUBLIC/bin/config.js'))

//general routes
app.get('', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')

});

app.post('/userCreation', (req, res) => {
    
     //ruele check
     pool.getConnection((err, connection) => {
        if (err) {
            logger.error(err);
        }
     
        console.log(`connected id ${connection.threadId}`);
        const param = req.body
        const e_mail = param.e_mail
        const label_max = param.master_label

        connection.query('SELECT * FROM customer_data WHERE e_mail=?', e_mail, (err, rows) => {


            if (!err) {
                let resObj = rows
                if (resObj.length >= 1) {

                    res.send("user allredy exist!")

                } else {

                    //creat new users
                    connection.query('INSERT INTO customer_data SET seq_id =?', param, (err, rows) => {
                        // connection.release()

                        // if (!err) {

                        //     res.send('auth-200')
                        // } else {
                        //     res.send(err)
                        // }
                    });

                    connection.query('update config_parameter set parameter_value = ' + label_max + ' where parameter_name = "label_max"' , param, (err, rows) => {
                        connection.release()

                        if (!err) {

                            res.send('auth-200')
                        } else {
                            res.send(err)
                        }
                    });
                }
            }
        });
        
    });
    
});

app.get('/masterLabel', (req, res) => {
    
    //ruele check
    pool.getConnection((err, connection) => {
       if (err) {
           logger.error(err);
       }
       console.log(`connected id ${connection.threadId}`);
       const param = req.body
       //const label_max = param.master_label

       connection.query('SELECT parameter_value FROM config_parameter where  parameter_name = "label_max"', (err, rows) => {

        if (!err) {
            
           //let data = RowDataPacket[0].parameter_value
            res.send(rows)
            console.log(rows)
            

        } else {
            res.send(err)

            
        }

       });
       //res.send("ok")
   });
   
});



//imgCount
app.get('/imgCount', (req, res) => {
    
    //ruele check
    pool.getConnection((err, connection) => {
       if (err) {
           logger.error(err);
       }
       console.log(`connected id ${connection.threadId}`);
       const param = req.body
       //const label_max = param.master_label

       connection.query('SELECT parameter_value FROM config_parameter where  parameter_name = "img_count"', (err, rows) => {

        if (!err) {
            
           //let data = RowDataPacket[0].parameter_value
            res.send(rows)
            console.log(rows)

        } else {
            res.send(err)

            
        }

       });
       //res.send("ok")
   });
   
});

app.get('/updateParam/:id/:num', (req, res) => {
    
    //ruele check
    pool.getConnection((err, connection) => {
       if (err) {
           logger.error(err);
       }
       console.log(`connected id ${connection.threadId}`);
       const param = req.body
       const value_1 = req.params.num
       const tred = req.params.id
       //console.log(tred)
       console.log(value_1)
       connection.query('update config_parameter set parameter_value = ' + value_1 + ' where parameter_name =  ' + '"' + tred +'"', (err, rows) => {
        connection.release()

        if (!err) {

            res.send('200')
        } else {
            res.send(err)
        }
    });
   });
   
});


//app.listen(port, "Started sucessfully");
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})
