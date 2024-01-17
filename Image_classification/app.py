from flask import Flask, render_template, request
from PIL import Image
import torch
from torchvision.transforms import transforms
from test import SimpleCNN  # Import the SimpleCNN model from your test.py file
from data import get_image_information
app = Flask(__name__)

# Load the trained model
model = SimpleCNN()
model.load_state_dict(torch.load('custom_cnn_model.pth'))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

class_labels = ['Fake', 'True']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    
    file = request.files['file']

    if file.filename == '':
        return render_template('result.html', result="No selected file")

    try:
        opt=get_image_information(file)
        # Read the image
        if opt:
            print("Image Information:")
            for key, value in opt.items():
                if key == 'metadata':
                    for x, y in value.items():  # Iterate over 'value' for metadata
                        print(f"{x}: {y}")
                else:
                    print(f"{key}: {value}")
        img = Image.open(file)
        # Preprocess the image
        img_tensor = transform(img).unsqueeze(0)
        # Make the prediction
        with torch.no_grad():
            outputs = model(img_tensor)
            _, predicted = torch.max(outputs, 1)
        # Map the predicted index to the class label
        prediction = class_labels[predicted.item()]
        

        return render_template('result.html', result=f"The image is classified as: {prediction}",opt=opt)

    except Exception as e:
        return render_template('result.html', result=f"Error processing the image: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)