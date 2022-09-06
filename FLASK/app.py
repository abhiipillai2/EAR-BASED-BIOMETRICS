#from crypt import methods
from distutils.log import debug
from flask import Flask, jsonify, request
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import datasets, layers, models
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from keras.models import load_model
from flask_mysqldb import MySQL
import numpy as np
import cv2
import os
import random
import json

app = Flask(__name__)
CORS(app)

#Data base connection
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'circle_master'
 
mysql = MySQL(app)

#mask detection 
@app.route("/img" , methods = ['POST'])
def img():
    
    RANDOM = random.randint(0,1000)
    haar_data = cv2.CascadeClassifier('data.xml')

    image_raw_bytes = request.get_data()
    file_name = "model.h5"
    save_location = (os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{RANDOM}.jpg"))
    
    f = open(save_location, 'wb') # wb for write byte data in the file instead of string
    f.write(image_raw_bytes) #write the bytes from the request body to the file
    f.close()

    img = cv2.imread(os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{RANDOM}.jpg"))
    os.remove(os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{RANDOM}.jpg"))
    # cv2.imshow("out", image)
    
    # face_matrix = cv2.resize(image,(256,256))
    loded_model = load_model(file_name)
    # pred = loded_model(np.expand_dims(face_matrix,0))
    
    face = haar_data.detectMultiScale(img)
    for x,y,w,h in face:
        cv2.rectangle(img,(x,y),(w+x,h+y),(255,0,255),4)
        face_matrix = img[y:y+h,x:x+w,:]
        face_matrix = cv2.resize(face_matrix,(256,256))
        #cv2.imwrite((os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{RANDOM}.jpg")), face_matrix)
        y_predicted = loded_model(np.expand_dims(face_matrix,0))
            
        out = int(np.argmax(y_predicted))
        if out == 0:
            print ('Mask')
            return ("0")
        elif out == 1:
            print ('No- Mask')
            return ("1")
    

#biometrics part 
@app.route("/predctBiometrics" , methods = ['POST'])
def bioMrtrics():
    
    RANDOM = random.randint(0,1000)
    #haar_data = cv2.CascadeClassifier('data.xml')
    haar_data = cv2.CascadeClassifier('haarcascade_mcs_rightear.xml')
    full_name="Not-avilable"
    #haar_data = cv2.CascadeClassifier('ear_data.xml')

    image_raw_bytes = request.get_data()
    file_name = "modelBiometrics.h5"
    save_location = (os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{RANDOM}.jpg"))
    
    f = open(save_location, 'wb') # wb for write byte data in the file instead of string
    f.write(image_raw_bytes) #write the bytes from the request body to the file
    f.close()

    img = cv2.imread(os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{RANDOM}.jpg"))
    #os.remove(os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{RANDOM}.jpg"))
    # # cv2.imshow("out", image)
    
    # # face_matrix = cv2.resize(image,(256,256))
    loded_model = load_model(file_name)
    # # pred = loded_model(np.expand_dims(face_matrix,0))
    
    face = haar_data.detectMultiScale(img)
    for x,y,w,h in face:
        cv2.rectangle(img,(x,y),(w+x,h+y),(255,0,255),4)
        face_matrix = img[y:y+h,x:x+w,:]
        face_matrix = cv2.resize(face_matrix,(256,256))
        cv2.imwrite((os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{RANDOM}.jpg")), face_matrix)
        y_predicted = loded_model(np.expand_dims(face_matrix,0))

        #predicted label    
        out = int(np.argmax(y_predicted))
        print(out)

        #data base part
        #getting full name from data base
        cursor = mysql.connection.cursor()
        cursor.execute(" SELECT FIRST_NAME,LAST_NAME FROM CUSTOMER_DATA WHERE MASTER_LABEL = '%s' " %out)
        #mysql.connection.commit()
        #cursor.close()
        row_headers=[x[0] for x in cursor.description]
        row = cursor.fetchall()
        json_data=[]
        for result in row:
            json_data.append(dict(zip(row_headers,result)))
        first_name = json_data[0]['FIRST_NAME']
        last_name = json_data[0]['LAST_NAME']
        full_name = first_name + " " + last_name

    #     return (full_name)
    return(full_name)

#imageCapture Module
@app.route("/imgCapture" , methods = ['POST'])
def imgCapture():
    
    #getting label max from data base
    cursor = mysql.connection.cursor()
    cursor.execute(''' SELECT PARAMETER_VALUE FROM CONFIG_PARAMETER WHERE PARAMETER_NAME = 'count_max' ''')
    #mysql.connection.commit()
    #cursor.close()
    row_headers=[x[0] for x in cursor.description]
    row = cursor.fetchall()
    json_data=[]
    for result in row:
        json_data.append(dict(zip(row_headers,result)))
    print(json_data[0]['PARAMETER_VALUE'])

    count_max = json_data[0]['PARAMETER_VALUE']
    
    #load haar xml
    haar_data = cv2.CascadeClassifier('haarcascade_mcs_rightear.xml')
    #haar_data = cv2.CascadeClassifier('data.xml')

    #image processing part
    image_raw_bytes = request.get_data()

    save_location = (os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{count_max}.jpg"))
    
    f = open(save_location, 'wb') # wb for write byte data in the file instead of string
    f.write(image_raw_bytes) #write the bytes from the request body to the file
    f.close()

    img = cv2.imread(os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{count_max}.jpg"))
    #os.remove(os.path.join(app.root_path, f"DATA_BUCKET/SAMPLE_{count_max}.jpg"))

    #opencv part   
    face = haar_data.detectMultiScale(img)
    for x,y,w,h in face:
        cv2.rectangle(img,(x,y),(w+x,h+y),(255,0,255),4)
        face_matrix = img[y:y+h,x:x+w,:]
        face_matrix = cv2.resize(face_matrix,(256,256))
        cv2.imwrite(os.path.join(app.root_path, f"ROW_DATA_BUCKET/SAMPLE_{count_max}.jpg"), face_matrix)

    new_count_max = (count_max + 1)

    #svae new count max in DB
    cursor = mysql.connection.cursor()
    cursor.execute(" UPDATE CONFIG_PARAMETER  SET PARAMETER_VALUE = '%s' WHERE PARAMETER_NAME = 'count_max' " %new_count_max)
    mysql.connection.commit()
    cursor.close()
    
    return jsonify({
    "statusCode": "SC0000",
    "statusDesc": "Success",
    })


#data processor
@app.route("/dataProcessor" , methods = ['GET'])
def dataProcessor():
    
    img_arry = []

    path = os.path.join(app.root_path, f"ROW_DATA_BUCKET")

    for img in os.listdir(path):

        img_raw = cv2.imread(os.path.join(path,img), cv2.IMREAD_COLOR)
        img_arry.append(img_raw)
        print ("writed to array")

    #save as a numpyarray
    np.save('master_date.npy',img_arry)

    return jsonify({
    "statusCode": "200",
    "statusDesc": "Success",
    })
    

#CNN model
@app.route("/trainModel" , methods = ['GET'])
def cnnModel():
    
    #getting label max from data base
    cursor = mysql.connection.cursor()
    cursor.execute(''' SELECT PARAMETER_VALUE FROM CONFIG_PARAMETER WHERE PARAMETER_NAME = 'label_max' ''')
    #mysql.connection.commit()
    #cursor.close()
    row_headers=[x[0] for x in cursor.description]
    row = cursor.fetchall()
    json_data=[]
    for result in row:
        json_data.append(dict(zip(row_headers,result)))
    print(json_data[0]['PARAMETER_VALUE'])

    #value of label max
    label_max = json_data[0]['PARAMETER_VALUE']

    #getting img count 
    #getting label max from data base
    cursor = mysql.connection.cursor()
    cursor.execute(''' SELECT PARAMETER_VALUE FROM CONFIG_PARAMETER WHERE PARAMETER_NAME = 'img_count' ''')
    #mysql.connection.commit()
    #cursor.close()
    row_headers=[x[0] for x in cursor.description]
    row = cursor.fetchall()
    json_data=[]
    for result in row:
        json_data.append(dict(zip(row_headers,result)))
    print(json_data[0]['PARAMETER_VALUE'])

    #value of img count
    img_count = json_data[0]['PARAMETER_VALUE']

    #process part
    labels = []

    #getting master data
    master_data = np.load('master_date.npy')
    X = master_data

    #generating labels
    for i in range(1,label_max):
        for j in range(1,img_count):

            labels.append(i)

    x_train,x_test,y_train,y_test = train_test_split(X,labels,test_size=0.21)
    X_train = x_train / 255
    X_test = x_test / 255

    #cnn model creation
    cnn = models.Sequential([
    layers.Conv2D(filters=32, kernel_size=(3, 3), activation='relu', input_shape=(256, 256, 3)),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(filters=64, kernel_size=(3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(label_max, activation='softmax')
    ])

    #cnn compailing
    cnn.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
    
    #cnn fiting
    cnn.fit(X_train, np.array(y_train), epochs=10)

    file_name = "modelBiometrics.h5"
    cnn.save(file_name)

    return jsonify({
    "statusCode": "200",
    "statusDesc": "Success",
    })
    

#all clear
@app.route("/allClear" , methods = ['GET'])
def allClear():
    
    #dlt all file in rawdata buket
    img_arry = []

    path = os.path.join(app.root_path, f"ROW_DATA_BUCKET")

    for img in os.listdir(path):

        #img_raw = cv2.imread(os.path.join(path,img), cv2.IMREAD_COLOR)
        path = os.path.join(os.path.join(app.root_path, f"ROW_DATA_BUCKET"), img)
        os.remove(path)
        print ("deleted")

    #save as a numpyarray
    np.save('master_date.npy',img_arry)

    #svae new count max in DB
    cursor = mysql.connection.cursor()
    cursor.execute(" UPDATE CONFIG_PARAMETER  SET PARAMETER_VALUE = ' 1 ' WHERE PARAMETER_NAME = 'count_max' ")
    mysql.connection.commit()
    cursor.close()

    #svae new count max in DB
    cursor = mysql.connection.cursor()
    cursor.execute(" UPDATE CONFIG_PARAMETER  SET PARAMETER_VALUE = ' 0 ' WHERE PARAMETER_NAME = 'label_max' ")
    mysql.connection.commit()
    cursor.close()

    #truncate userdata table
    cursor = mysql.connection.cursor()
    cursor.execute(" TRUNCATE TABLE CUSTOMER_DATA ")
    mysql.connection.commit()
    cursor.close()


    return jsonify({
    "statusCode": "200",
    "statusDesc": "Success",
    })
    



app.run(host="0.0.0.0",port=5080,debug = True)
# app.run(debug = True)