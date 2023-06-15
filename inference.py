from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import numpy as np
import tensorflow as tf
import urllib.request

app = FastAPI()

origins = ["*"]
methods = ["*"]
headers = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=methods,
    allow_headers=headers,
)

def download_model():
    url = "https://storage.googleapis.com/model-api-c23-pc662/model.h5"
    file_name = "model.h5"

    urllib.request.urlretrieve(url, file_name)
    print("File downloaded successfully.")

download_model()

model = tf.keras.models.load_model('model.h5')
class_names = ['ayam bakar', 'ayam_goreng', 'ayam_pop', 'buncis', 'daging_rendang', 'dendeng_batokok', 'gulai_ikan', 'gulai_tambusu', 'gulai_tunjang', 'mie goreng', 'perkedel', 'sambal goreng kentang', 'sate', 'sayur asam', 'sayur bayam', 'sayur lodeh', 'sayur sop', 'tahu', 'telur_balado', 'telur_dadar', 'terong balado', 'tongkol balado', 'tumis kangkung', 'usus ayam bumbu kuning']
calories_per_class_names = [300, 300, 300, 100, 300, 300, 300, 300, 300, 300, 100, 100, 300, 100, 100, 100, 100, 100, 100, 100, 300, 300, 100, 100]

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/predict")
async def predict(file: UploadFile = None):
    if file is None:
        return {"error": "file is not found"}
    contents = await file.read()
    image = Image.open(BytesIO(contents))
    image = image.resize((224, 224))
    image = tf.keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = tf.keras.applications.efficientnet_v2.preprocess_input(image)
    prediction = model.predict(image)
    class_name_and_probability = []
    class_with_probability_more_than_1 = []
    for i in range(len(prediction[0])):
        if prediction[0][i] > 1.0:
            class_with_probability_more_than_1.append({"class_name": class_names[i], "probability": float(prediction[0][i]), "calories": calories_per_class_names[i]})
    for i in range(len(prediction[0])):
        class_name_and_probability.append({"class_name": class_names[i], "probability": float(prediction[0][i]), "calories": calories_per_class_names[i]})
    predicted_class = class_name_and_probability[np.argmax(prediction[0])]
    total_calories_from_class_with_probability_more_than_1 = 0
    for i in range(len(class_with_probability_more_than_1)):
        total_calories_from_class_with_probability_more_than_1 += class_with_probability_more_than_1[i]["calories"]
    return {"predicted_class": predicted_class, "class_name_and_probability": class_name_and_probability, "class_with_probability_more_than_1": class_with_probability_more_than_1, "total_calories_from_class_with_probability_more_than_1": total_calories_from_class_with_probability_more_than_1}

    

