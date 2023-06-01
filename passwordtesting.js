const bcrypt = require("bcrypt");
async function hashPassword(plaintextPassword) {
    bcrypt.hash(plaintextPassword, 10)
        .then(hash => {
            // Store hash in the database
            console.log(hash);
            return hash;
        })
        .catch(err => {
            console.log(err)
        })
}
function comparePassword(plaintextPassword, hash) {
    bcrypt.compare(plaintextPassword, hash, function(err, result){
        if(result) console.log("It matches!");
        else console.log("Invalid")
    });
 }

// console.log("halo");
comparePassword("dori","$2b$10$8qezmAB1UbJCcEuzG4Lh0eCjA1CBXL9H7sOP7yaZJlStwMNgPaq6e");

