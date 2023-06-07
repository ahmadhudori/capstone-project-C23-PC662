const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var secret = "testing-secret";
//const function = require('./function')

var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://capstone-project-c23-pc662-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();
let userRef = db.collection("users");

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
//ketika dipanggil harus async()
async function hashPass(plain){
    return bcrypt.hash(plain, 10);
}
//ketika dipanggil harus async()
async function compareHash(plain, hash){
    return bcrypt.compare(plain,hash);
}
/*
router.post("/adduser", (req, res) => {
    const today = new Date(Date.now()+420*60000);
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
                    res.status(400).json({"message":"email already existed"});
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
            res.status(404).json({"message":"user not found"});
          }
        doc.forEach(document =>{
            (async () => {
                if(await compareHash(pass,document.data().pass)){
                    userRef.doc(document.data().id).delete();
                    res.status(200).json({"message":"user deleted"});
                }else{
                    res.status(400).json({"message":"user not deleted, wrong password"});
                }
             })() 
        });
    });
})

router.put("/updateUser", (req, res) => {
    const today = new Date(Date.now()+420*60000);
    const email = req.body.email;
    const pass = req.body.password;
    let Uname = req.body.updatedName;
    let Uemail = req.body.updatedEmail;
    let Upass = req.body.updatedPass;

    userRef.where("email","==",email).get().then(doc=>{
        if (doc.empty) {
            res.status(404).send("user not found");
          }
        doc.forEach(document =>{
            (async () => {
                if(await compareHash(pass,document.data().pass)){
                    if(Uname||Uemail||Upass){
                        Uname = Uname || document.data().name;
                        Uemail = Uemail || document.data().email;
                        if(Upass){
                            (async () => {
                                Upass = await hashPass(Upass);
                                userRef.doc(document.data().id).update({name:Uname, email:Uemail, pass: Upass, updatedAt: today.toISOString()});
                                res.status(200).json({"message":"user updated"});
                            })()
                        }else{
                            Upass = document.data().pass;
                            userRef.doc(document.data().id).update({name:Uname, email:Uemail, pass: Upass, updatedAt: today.toISOString()});
                            res.status(200).json({"message":"user updated"});
                        }
                    }else {
                        res.status(400).json({"message":"please fill updateName/updatedEmail/updatedPass field"});
                    }
                }else{
                    res.status(400).json({"message":"user not updated, wrong password"});
                }
             })() 
        });
    });
})

router.get("/test", async(req,res) =>{
    const token = req.header('authorization').split(" ")[1];
    // console.log(token);
    res.status(200).send(token);
})*/

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
            res.status(404).send("email/password incorrect");
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

module.exports = router
