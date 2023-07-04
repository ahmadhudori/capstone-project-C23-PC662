const express = require('express');
const unirest = require('unirest');
const axios = require('axios');
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require('fs');
var jwt = require('jsonwebtoken');
require("dotenv").config();
var secret = process.env.secret_jwt;
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const FormData = require('form-data');
const path = require('path');
const pathKey = path.resolve('./serviceAccountKey.json');
const upload = multer({ storage: multer.memoryStorage() });
const storage = new Storage({
  projectId: 'capstone-project-c23-pc662',
  keyFilename: pathKey
});

var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");
const { BucketExceptionMessages } = require('@google-cloud/storage/build/src/bucket');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://capstone-project-c23-pc662-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();
let userRef = db.collection("users");
let userRef2 = db.collection("food_scanned");

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
//ketika dipanggil harus async()
async function hashPass(plain){
    return bcrypt.hash(plain, 10);
}
//ketika dipanggil harus async()
async function compareHash(plain, hash){
    return bcrypt.compare(plain,hash);
}

// router.get("/getAllusers", async(req,res) =>{
//     let userData=[];
//     userRef.get().then((querySnapshot)=>{
//         querySnapshot.forEach(document =>{
//             // console.log(document.data());
//             userData.push(document.data());
//         });
//     })
//     .then(function(){
//         res.status(200).json({"data":userData})
//     })
//     .catch(error=> res.send(error).status(500))
// })

router.post("/signUp", (req, res) => {
    const today = new Date(Date.now()+420*60000);
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;
    const userId = makeid(15);
    if(!req.body.name||!req.body.password||!req.body.email){
        res.status(400).json({"message":"please fill every fields to sign up"});
    }else{
        const data = {id:userId, name:name, email:email};
        bcrypt.hash(pass, 10, function(err, hash) {
            userRef.where("email","==",email).get().then(doc=>{
                if (doc.empty) {
                    userRef.doc(data.id.toString()).set({id:userId, name:name, email:email, pass:hash, createdAt:today.toISOString()})
                    .then(res.status(201).json({"message":"user added"}));
                }
                else{
                    res.status(400).json({"message":"email already existed"});
                }
            }).catch(error=> res.status(500).send(error));
        })
    }
})

router.post("/login", (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    userRef.where("email","==",email).get().then(doc=>{
        if (doc.empty) {
            res.status(400).json({"message":"email/password incorrect"});
          }
          doc.forEach(document =>{
            (async () => {
                if(await compareHash(pass,document.data().pass)){
                   var token = jwt.sign({ id: document.data().id, email:document.data().email, name:document.data().name}, secret,{expiresIn: '1d'});
                   res.status(200).json({"message":"login succeed","token": token}); 
                }else{
                    res.status(400).json({"message":"email/password incorrect"});
                }
             })() 
        });
    }).catch(error=> res.status(500).send(error));
})

router.put("/updateProfile", (req, res) => {
    const bearer = req.header('authorization');
    const today = new Date(Date.now()+420*60000);
    let Uname = req.body.updatedName;
    let Uemail = req.body.updatedEmail;
    let Upass = req.body.updatedPass;

    if(!bearer){
        res.status(400).json({"message":"token required"});
    }else{
        token = bearer.split(" ")[1];
        try {
            var decoded = jwt.verify(token, secret);
        } catch(err) {
            // console.log(err);
            res.status(400).json(err);
        }
        userRef.where("email","==",decoded.email).get().then(doc=>{
        if (doc.empty) {
            res.status(400).json({"message":"invalid token"})
        }
        doc.forEach(document =>{
            if(Uname||Uemail||Upass){
                Uname = Uname || decoded.name;
                if(Uemail){
                    userRef.where("email","==",Uemail).get().then(doc=>{
                        if (doc.empty) {
                            // res.status(200).send("email belum ada didatabase");
                            console.log("new email");
                            if(Upass){
                                (async () => {
                                    Upass = await hashPass(Upass);
                                    userRef.doc(document.data().id).update({name:Uname, email:Uemail, pass: Upass, updatedAt: today.toISOString()});
                                    res.status(200).json({"message":"user updated"});
                                })()
                            }else{
                                userRef.doc(document.data().id).update({name:Uname, email:Uemail, updatedAt: today.toISOString()});
                                res.status(200).json({"message":"user updated"});
                            }
                          }
                        else{
                            res.status(400).json({"message":"email already existed"}); 
                        }
                    });
                }
                else{
                    Uemail = decoded.email;
                    if(Upass){
                        (async () => {
                            Upass = await hashPass(Upass);
                            userRef.doc(document.data().id).update({name:Uname, email:Uemail, pass: Upass, updatedAt: today.toISOString()});
                            res.status(200).json({"message":"user updated"});
                        })()
                    }else{
                        userRef.doc(document.data().id).update({name:Uname, email:Uemail, updatedAt: today.toISOString()});
                        res.status(200).json({"message":"user updated"});
                    }
                }
            }else {
                res.status(400).json({"message":"please fill updateName/updatedEmail/updatedPass field"});
            }
        });
    }).catch(error=> res.status(500).send(error));;
    }
})

router.post('/uploadProfileImage', upload.single('profile'), (req, res) => {
    const bucketName = 'capstone_profile_image'; 
    const today = new Date(Date.now()+420*60000);
    const file = req.file;
    const bearer = req.header('authorization');

    if(!bearer){
        res.status(400).json({"message":"token required"});
    }else{
        token = bearer.split(" ")[1];
        try {
            var decoded = jwt.verify(token, secret);
        } catch(err) {
            res.status(400).json(err);
        }
        userRef.where("email","==",decoded.email).get().then(doc=>{
            if (doc.empty) {
                res.status(400).json({"message":"invalid token"})
            }else{
                if(!file){
                    res.status(400).json({"message":"please fill profile fields"});
                }else{
                    const filename = file.originalname;
                    const filetype = filename.split(".")[1];
                    if(filetype!=="jpg"&&filetype!=="jpeg"&&filetype!=="png"){
                        res.status(400).json({"message":"image type must be .jpg/.jpeg/.png"})
                    }
                    const blob = storage.bucket(bucketName).file("img_"+makeid(10)+"."+filetype);
                    const blobStream = blob.createWriteStream({
                    resumable: false,
                    gzip: true,
                    });
                
                    blobStream.on('error', (err) => {
                    console.error(err);
                    res.status(500).send('Error uploading file.');
                    });
                
                    blobStream.on('finish', () => {
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
                    doc.forEach(document =>{
                        if(document.data().imageUrl){
                            deleteImg(document.data().imageUrl);
                        }
                        userRef.doc(document.data().id).update({imageUrl:publicUrl, updatedAt: today.toISOString()});
                        res.status(200).json({ "message":"profile image sucessfully updated","imageUrl": publicUrl });
                    });
                    });
                
                    blobStream.end(file.buffer);
                }
            }
        });
    }
  });

  router.get("/profile", (req, res) => {
    const bearer = req.header('authorization');

    if(!bearer){
        res.status(400).json({"message":"token required"});
    }else{
        token = bearer.split(" ")[1];
        try {
            var decoded = jwt.verify(token, secret);
        } catch(err) {
            // console.log(err);
            res.status(400).json(err);
        }
        userRef.where("email","==",decoded.email).get().then(doc=>{
        if (doc.empty) {
            res.status(400).json({"message":"invalid token"})
        }
        doc.forEach(document =>{
            res.status(200).json({
            "id": document.data().id,
            "name": document.data().name,
            "email": document.data().email,
            "imageUrl": document.data().imageUrl,
            "createdAt": document.data().createdAt,
            "updatedAt": document.data().updatedAt});
        });
    }).catch(error=> res.status(500).send(error));;
    }
})

function deleteImg(imgurl){
    var filename = imgurl.split('/')[4];
    const bucketName = 'capstone_profile_image'; 
    storage.bucket(bucketName).file(filename).delete();

}

router.post("/detectFood", upload.single('food_image'), (req, res) => {
    const today = new Date(Date.now()+420*60000);
    const bucketName = 'food_scanned'; 
    const bearer = req.header('authorization');
    const food_file = req.file;
    var predicted, morethan1;

    if(!bearer){
        res.status(400).json({"message":"token required"});
    }else{
        token = bearer.split(" ")[1];
        try {
            var decoded = jwt.verify(token, secret);
        } catch(err) {
            // console.log(err);
            res.status(400).json(err);
        }
        userRef.where("email","==",decoded.email).get().then(doc=>{
        if (doc.empty) {
            res.status(400).json({"message":"invalid token"})
        }
        // console.log(food_file.buffer);
        // console.log(file);
        if(!food_file){
            res.status(400).json({"message":"please fill food_image field"});
        }else{
            const filename = food_file.originalname;
            const filetype = filename.split(".")[1];
            if(filetype!=="jpg"&&filetype!=="jpeg"&&filetype!=="png"){
                res.status(400).json({"message":"image type must be .jpg/.jpeg/.png"})
            }
            const imageData = food_file.buffer;
            const buffer = Buffer.from(imageData, 'base64');
            const data = new FormData();
            data.append('file', buffer, { filename: food_file.originalname });

            const url = 'https://modelml-2ge5ruq6qa-et.a.run.app/predict'; 

            axios.post(url, data, {
            headers:
                data.getHeaders(),
            })
            .then(response => {
                morethan1=[];
                predicted = response.data.predicted_class.class_name;
                morethan1.push(predicted);
                var data_res;
                for (data_res of response.data.class_with_probability_more_than_1){
                    // morethan1.push(data_res.class_name);
                    if ( morethan1.indexOf(data_res.class_name)==-1 ) {
                        morethan1.push(data_res.class_name);
                    }
                }
                console.log(morethan1);
                
                const blob = storage.bucket(bucketName).file("img_"+makeid(10)+"."+filetype);
                    const blobStream = blob.createWriteStream({
                    resumable: false,
                    gzip: true,
                    });
                
                    blobStream.on('error', (err) => {
                    console.error(err);
                    res.status(500).send('Error uploading file.');
                    });
                
                    blobStream.on('finish', () => {
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

                    userRef2.doc(makeid(15)).set({"createdAt":today.toISOString(),"imageUrl":publicUrl,"totalCalorie":response.data.total_calories_from_class_with_probability_more_than_1,
                    "food":morethan1, "user_id":decoded.id})
                    .then(res.status(201).json({"message":"scanned completed","totalCalorie":response.data.total_calories_from_class_with_probability_more_than_1,"food":morethan1,
                        "imageUrl":publicUrl
                    }));

                    });
                
                    blobStream.end(food_file.buffer);
            })
            .catch(error => {
                console.error('Error:',error);
            });
        }
                
    }).catch(error=> res.status(500).send(error));;
    }
})

router.get("/getScanned", (req, res) => {
    const bearer = req.header('authorization');

    if(!bearer){
        res.status(400).json({"message":"token required"});
    }else{
        token = bearer.split(" ")[1];
        try {
            var decoded = jwt.verify(token, secret);
        } catch(err) {
            // console.log(err);
            res.status(400).json(err);
        }
        userRef.where("email","==",decoded.email).get().then(doc=>{
        if (doc.empty) {
            res.status(400).json({"message":"invalid token"})
        }
        
        let predictions = [];
        userRef2.where('user_id', '==', decoded.id).get().then(food=>{
            food.forEach(food_doc =>{
                predictions.push({
                        "createdAt": food_doc.data().createdAt,
                        "totalCalorie": food_doc.data().totalCalorie,
                        "imageUrl": food_doc.data().imageUrl,
                        "food": food_doc.data().food
                    }
                );
            });
            res.status(200).json(predictions);
        });
        
    }).catch(error=> res.status(500).send(error));
    }
})

module.exports = router
