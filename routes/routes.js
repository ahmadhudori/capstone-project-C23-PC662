const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
//const function = require('./function')

var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://capstone-project-c23-pc662-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();
let userRef = db.collection("users");

const today = new Date(Date.now()+420*60000);

router.get("/dashboard", (req, res) => {
    res.status(200).json({"message": "hi"})
})

router.get("/getAllusers", async(req,res) =>{
    let userData=[];
    userRef.get().then((querySnapshot)=>{
        querySnapshot.forEach(document =>{
            // console.log(document.data());
            userData.push(document.data());
        });
    })
    .then(function(){
        res.status(200).json({"data":userData})
    })
    .catch(error=> res.send(error).status(500))
})

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

router.post("/adduser", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;
    const userId = makeid(15);
    if(!req.body.name||!req.body.password||!req.body.email){
        res.status(400).json({"message":"please fill every fields"});
    }else{
        const data = {id:userId, name:name, email:email};
        bcrypt.hash(pass, 10, function(err, hash) {
            userRef.where("email","==",email).get().then(doc=>{
                if (doc.empty) {
                    userRef.doc(data.id.toString()).set({id:userId, name:name, email:email, pass:hash, createdAt:today.toISOString()})
                    .then(res.status(201).json({"message":"user added", "data":data}));
                }
                else{
                    res.status(400).json({"message":"user already existed"});
                }
            });
        })
    }
    
})

router.get("/findUser", (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    userRef.where("email","==",email).get().then(doc=>{
        if (doc.empty) {
            // console.log('No matching documents.');
            res.status(404).send("user not found");
          }
        doc.forEach(document =>{
            console.log(document.data());
            res.status(200).json({"message":"user found","data":document.data()});
        });
    });
})

router.delete("/deleteUser",(req,res)=>{
    const email = req.body.email;
    const pass = req.body.password;
    userRef.where("email","==",email).get().then(doc=>{
        if (doc.empty) {
            // console.log('No matching documents.');
            res.status(404).json({"message":"user not found"});
          }
        doc.forEach(document =>{
            // console.log(document.data());
            bcrypt.compare(pass, document.data().pass, function(err, result){
                if(result){
                    userRef.doc(document.data().id).delete();
                    res.status(200).json({"message":"user deleted"});
                } 
                else res.status(400).json({"message":"user not deleted, wrong password"});
            });  
        });
    });
})

module.exports = router
