const express = require('express');
const router = express.Router();
const { initializeApp } = require( "firebase/app");
//const function = require('./function')

const { getDatabase, ref, set, onValue, remove } = require( "firebase/database");
const firebaseConfig = {
    databaseURL: "https://capstone-project-c23-pc662-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };
  
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const today = new Date(Date.now()+420*60000);

router.get("/dashboard", (req, res) => {
    res.status(200).json({"message": "hi"})
})

router.get("/getAllusers",(req,res) =>{
    const reference = ref(db,'users/user')
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        console.log(typeof(data));
        // console.log(data);
        res.status(200).json({"data":data});
    })
})

router.post("/adduser", (req, res) => {
    const name = req.body.name;
    const usern = req.body.username;
    const pass = req.body.password;
    const userId = req.body.userId;
    const reference = ref(db, 'users/user/' + userId);

    set(reference,{
        id : userId,
        dateCreated : today.toISOString(),
        nama : name,
        password : pass,
        username : usern
    })
    res.send('user added').status(200);
})

router.delete("/deleteUser",(req,res)=>{
    const reference = ref(db,'users/user/'+ '21');
    remove(reference).then(() => {
      console.log(reference+'removed');
    });
    res.status(200).send('user deleted');
})

module.exports = router
