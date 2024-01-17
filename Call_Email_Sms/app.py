from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import json
import requests
import subprocess
#from utils import model_predict, save_to_mongodb

app=Flask(__name__)
client = MongoClient('mongodb://localhost:27017/')
db = client['phone_details']
collection = db['details']
import os
import pickle

current_dir = os.path.dirname(__file__)
models_dir = os.path.join(current_dir, "models")

cv_path = os.path.join(models_dir, "cv.pkl")
clf_path = os.path.join(models_dir, "clf.pkl")


cv = pickle.load(open(cv_path, 'rb'))
clf = pickle.load(open(clf_path, 'rb'))

def model_predict(email):
    if email == "":
        return ""
    tokenized_email = cv.transform([email])
    prediction = clf.predict(tokenized_email)
    # If the email is spam, prediction should be 1
    prediction = "Spam" if prediction == 1 else "Not Spam"
    return prediction

def save_to_mongodb(email, prediction):
    document = {'email': email, 'prediction': prediction}
    collection.insert_one(document)
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/callverify', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        phone_number = request.form.get('phone_number')
        command = f"truecallerpy -s {phone_number}"
        result = subprocess.run(command, shell=True, capture_output=True, text=True)

        if result.returncode == 0:
            output = result.stdout

            # Save details to MongoDB
            details_collection = db['phone_details_collection']
            details_collection.insert_one({'phone_number': phone_number, 'details': output})

            return render_template('index_customer.html', phone_number=phone_number, details=output, error_message=None)
        else:
            error_message = f"Error executing the command. Return code: {result.returncode}"
            return render_template('index_customer.html', phone_number=phone_number, details=None, error_message=error_message)

    return render_template('index_customer.html', phone_number=None, details=None, error_message=None)

@app.route('/predict1', methods=['GET','POST'])
def p():
    return render_template('index_email.html')
@app.route('/predict', methods=['GET','POST'])
def predict():
    email = request.form.get('content')
    prediction = model_predict(email)

    # Save the email and prediction to MongoDB
    

    return render_template("index_email.html", prediction=prediction, email=email)

# Create an API endpoint
@app.route('/api/predict', methods=['POST'])
def predict_api():
    data = request.get_json(force=True)
    email = data['content']
    prediction = model_predict(email)

    # Save the email and prediction to MongoDB
    

    return jsonify({'prediction': prediction, 'email': email})


def model_predict(email):
    if email == "":
        return ""
    tokenized_email = cv.transform([email])
    prediction = clf.predict(tokenized_email)
    # If the email is spam, prediction should be 1
    prediction = "Spam" if prediction == 1 else "Not Spam"
    return prediction

@app.route('/sms_spam', methods=['GET','POST'])
def p1():
    return render_template('index_sms.html')
@app.route('/predict_sms', methods=['GET','POST'])
def predict1():
    email = request.form.get('content')
    prediction = model_predict(email)

    # Save the email and prediction to MongoDB
    

    return render_template("index_sms.html", prediction=prediction, email=email)

# Create an API endpoint
@app.route('/api/predict1', methods=['POST'])
def predict_api1():
    data = request.get_json(force=True)
    email = data['content']
    prediction = model_predict(email)

    # Save the email and prediction to MongoDB
    

    return jsonify({'prediction': prediction, 'sms': email})


def model_predict(email):
    if email == "":
        return ""
    tokenized_email = cv.transform([email])
    prediction = clf.predict(tokenized_email)
    # If the email is spam, prediction should be 1
    prediction = "Spam" if prediction == 1 else "Not Spam"
    return prediction

if __name__=="__main__":
    app.run(debug=True)