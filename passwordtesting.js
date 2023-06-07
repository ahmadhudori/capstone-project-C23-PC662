var jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require("bcrypt");
var secret = "testing-secret";

var token = jwt.sign({ foo: 'bar', test:'barrr'}, secret,{expiresIn: '1d'});
console.log(token);
var x="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJ0ZXN0IjoiYmFycnIiLCJpYXQiOjE2ODYwNzA0OTgsImV4cCI6MTY4NjA3MDQ5OX0.9V6zawpJx9YJcyx2CK3R3ec_yENVNBAvbR7rVjEjX3E";
try {
    var decoded = jwt.verify(x, secret);
    console.log(decoded);
    // tgl = new Date(1685894990);
    // console.log(tgl.toISOString());
} catch(err) {
    // err
        console.log(err);}
// }finally{
//     console.log(Date.now());
// }
