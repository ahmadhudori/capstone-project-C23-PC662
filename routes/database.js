//testing {not used}
const { initializeApp } = require( "firebase/app");
//const function = require('./function')

const { getDatabase, ref, set, onValue, remove } = require( "firebase/database");
const firebaseConfig = {
    databaseURL: "https://capstone-project-c23-pc662-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };
  
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const today = new Date(Date.now()+420*60000);

function readAllFromDatabase(){
    const reference = ref(db,'users/')

    onValue(reference, (snapshot) => {
        //snapshot punya banyak object, maka gunakan forEach untuk iterasi setiap object
        snapshot.forEach((booksAll)=>{
            const data = booksAll.val();
            return data;
        })
    })
}

function readOneFromDatabase(bookId){
    const reference = ref(db,'users/user/' + bookId)
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        // return data;
    })
}
readOneFromDatabase(1)

function writeToDatabase(userId, name, usern, pass){
    const reference = ref(db, 'users/user/' + userId);

    set(reference,{
        id : userId,
        dateCreated : today.toISOString(),
        nama : name,
        password : pass,
        username : usern
    })
}
writeToDatabase('abcd123','Dori2','Dori2222','d123');
// console.log(today.toISOString());

// function removeFromDatabase(bookId){
//   const reference = ref(db,'books/'+ bookId);
//     remove(reference).then(() => {
//       console.log(reference+'removed');
//     });
// }
// removeFromDatabase(2)