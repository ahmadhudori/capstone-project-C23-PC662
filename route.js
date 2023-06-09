const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const pathKey = path.resolve('./credentials.json')


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const storage = new Storage({
  projectId: 'capstone-project-c23-pc662',
  keyFilename: pathKey
});

// Endpoint untuk mengunggah gambar ke cloud storage
router.post('/upload', upload.single('image'), (req, res) => {
  const bucketName = 'capstone-project-c23-pc662.appspot.com'; 
  const file = req.file;

  const blob = storage.bucket(bucketName).file(file.originalname);
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
    res.status(200).json({ imageUrl: publicUrl });
  });

  blobStream.end(file.buffer);
});

// Endpoint untuk melakukan deteksi kalori
router.post('/detect', (req, res) => {
  // Logika deteksi kalori berdasarkan gambar yang diunggah
  // Dapatkan URL gambar dari body permintaan (req.body.imageUrl)

  // Contoh respons dengan hasil deteksi kalori
  const result = {
    food: 'Nasi Goreng',
    calories: 350,
  };

  res.status(200).json(result);
});

// const express = require('express');
// const multer = require('multer');
// const { Storage } = require('@google-cloud/storage');
// const path = require('path');

// const pathKey = path.resolve('./credentials.json')
// // const fs = require('fs');
// // const Jimp = require('jimp')
// // const bodyParser = require('body-parser');
// // const admin = require('firebase-admin');

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });
// const storage = new Storage({
//   projectId: 'capstone-project-c23-pc662',
//   keyFilename: pathKey
// });



// router.post('/upload', upload.single('image'), (req, res) => {
//   const bucketName = 'capstone-project-c23-pc662.appspot.com'; // Ganti dengan nama bucket Anda
//   const file = req.file;

//   const blob = storage.bucket(bucketName).file(file.originalname);
//   const blobStream = blob.createWriteStream({
//     resumable: false,
//     gzip: true,
//   });

//   blobStream.on('error', (err) => {
//     console.error(err);
//     res.status(500).send('Error uploading file.');
//   });

//   blobStream.on('finish', () => {
//     const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
//     res.status(200).json({ imageUrl: publicUrl });
//   });

//   blobStream.end(file.buffer);
// });
// const serviceAccount = require("../serviceAccountKey.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://capstone-project-c23-pc662-default-rtdb.asia-southeast1.firebasedatabase.app"
//   });

// const db = admin.firestore();

// // Konfigurasi multer untuk menyimpan file di direktori 'uploads'
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads');
//   },
//   filename: function (req, file, cb) {
//     // Menggunakan timestamp saat ini sebagai nama file
//     const timestamp = Date.now();
//     cb(null, `${timestamp}_${file.originalname}`);
//   }
// });

// const upload = multer({ storage: storage });

// // Endpoint untuk upload gambar dan pemrosesan gambar
// router.post('/upload-and-process', upload.single('image'), async (req, res) => {
//   try {
//     // Baca gambar menggunakan Jimp
//     const image = await Jimp.read(Buffer.from(req.file.buffer));

//     // Lakukan pemrosesan gambar di sini (misalnya, deteksi kalori)
//     const calorieCount = detectCalories(image);

//     res.status(200).json({ calorieCount });
//   } catch (error) {
//     console.error('Error processing image:', error);
//     res.status(500).json({ error: 'Failed to process image' });
//   }
// });

// // Fungsi untuk mendeteksi jumlah kalori dalam gambar
// function detectCalories(image) {
//   // Logika deteksi kalori
//   // ...
//   // Return jumlah kalori yang dideteksi
//   return 100; // Contoh: Mengembalikan jumlah kalori 100
// }


// // Endpoint untuk mengambil gambar berdasarkan ID atau nama file
// router.get('/image/:id', (req, res) => {
//   const fileId = req.params.id;
//   const imagePath = `uploads/${fileId}`;

//   // Periksa apakah file gambar ada
//   if (fs.existsSync(imagePath)) {
//     // Baca file gambar
//     fs.readFile(imagePath, (err, data) => {
//       if (err) {
//         res.status(500).json({ error: 'Failed to read image file' });
//       } else {
//         // Set header dan kirimkan gambar sebagai respons
//         res.setHeader('Content-Type', 'image/jpeg');
//         res.send(data);
//       }
//     });
//   } else {
//     res.status(404).json({ error: 'Image not found' });
//   }
// });


// //  Middleware untuk parsing body dengan tipe application/json
// router.use(bodyParser.json());

// // Endpoint untuk memulai pendeteksian kalori pada gambar
// router.post('/detect-calories', (req, res) => {
//   // Dapatkan data gambar dari body permintaan
//   const imageData = req.body.imageData;

//   // Lakukan logika pendeteksian kalori pada gambar di sini
//   // Misalnya, dapatkan informasi makanan dari gambar, hitung estimasi kalori, dll.

//   // Contoh respons dengan hasil pendeteksian
//   const detectedFoods = [
//     { name: 'Apple', calories: 52 },
//     { name: 'Banana', calories: 96 },
//     { name: 'Orange', calories: 62 }
//   ];

//   // Kirim respons dengan hasil pendeteksian
//   res.status(200).json({ foods: detectedFoods });
// });


// // Data daftar makanan (contoh)
// const foods = [
//   { id: 1, name: 'Apple', calories: 52 },
//   { id: 2, name: 'Banana', calories: 96 },
//   { id: 3, name: 'Orange', calories: 62 }
// ];

// // Endpoint untuk mengambil daftar makanan
// router.get('/foods', (req, res) => {
//   res.status(200).json({ foods });
// });


// // Endpoint untuk mengambil informasi detail makanan berdasarkan ID
// router.get('/foods/:id', (req, res) => {
//   const foodId = parseInt(req.params.id);

//   // Cari makanan dengan ID yang sesuai
//   const food = foods.find((item) => item.id === foodId);

//   if (food) {
//     res.status(200).json({ food });
//   } else {
//     res.status(404).json({ error: 'Food not found' });
//   }
// });


// // Endpoint untuk menambahkan makanan baru
// router.post('/foods', (req, res) => {
//   const { name, calories } = req.body;

//   // Tambahkan makanan baru ke dalam basis data Firestore
//   db.collection('foods')
//     .add({ name, calories })
//     .then((docRef) => {
//       const newFood = {
//         id: docRef.id,
//         name,
//         calories
//       };
//       res.status(201).json({ food: newFood });
//     })
//     .catch((error) => {
//       console.error('Error adding food:', error);
//       res.status(500).json({ error: 'Failed to add food' });
//     });
// });


// // Endpoint untuk memperbarui informasi makanan berdasarkan ID
// router.put('/foods/:id', (req, res) => {
//   const foodId = req.params.id;
//   const { name, calories } = req.body;

//   // Perbarui informasi makanan di basis data Firestore
//   db.collection('foods')
//     .doc(foodId)
//     .update({ name, calories })
//     .then(() => {
//       res.status(200).json({ message: 'Food updated successfully' });
//     })
//     .catch((error) => {
//       console.error('Error updating food:', error);
//       res.status(500).json({ error: 'Failed to update food' });
//     });
// });


// // Endpoint untuk menghapus makanan berdasarkan ID
// router.delete('/foods/:id', (req, res) => {
//   const foodId = req.params.id;

//   // Hapus makanan dari basis data Firestore
//   db.collection('foods')
//     .doc(foodId)
//     .delete()
//     .then(() => {
//       res.status(200).json({ message: 'Food deleted successfully' });
//     })
//     .catch((error) => {
//       console.error('Error deleting food:', error);
//       res.status(500).json({ error: 'Failed to delete food' });
//     });
// });


// // Endpoint untuk mendeteksi kalori menggunakan kamera
// router.post('/detect-calories', (req, res) => {
//   // Logika untuk mendeteksi kalori menggunakan kamera
//   // Mengambil dataset objek makanan dan kalori
// const foodDataset = require('path/to/foodDataset.json');

// // Mendapatkan daftar objek yang terdeteksi dari hasil prediksi
// const detectedObjects = predictions.filter(obj => obj.confidence > confidenceThreshold);

// // Menghitung total kalori berdasarkan objek yang terdeteksi
// let totalCalories = 0;
// detectedObjects.forEach(obj => {
//   const objectName = obj.name.toLowerCase();
//   const foodData = foodDataset.find(food => food.name.toLowerCase() === objectName);
//   if (foodData) {
//     totalCalories += foodData.calories;
//   }
// });

// // Mengirimkan respons dengan total kalori
// res.json({ calories: totalCalories });
// });


module.exports = router;
