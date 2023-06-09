
// The ID of your GCS bucket
const bucketName = 'api-image-c23-pc662';

// The path to your file to upload
const filePath = 'img-profile/flower.jpg';

// The new ID for your GCS file
const destFileName = 'abcd.jpg';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
    keyFilename:"./serviceAccountKey.json",
    projectId:"capstone-project-c23-pc662"
});

// storage.getBuckets().then(x=>console.log(x));
const imgbucket = storage.bucket('api-image-c23-pc662');
console.log(imgbucket);