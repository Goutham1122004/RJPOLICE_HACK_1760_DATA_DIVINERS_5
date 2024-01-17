import torch
from torchvision.transforms import transforms
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import numpy as np
from test import SimpleCNN
# Assuming you have a DataLoader for your test dataset
#test_dataloader = ...
import torch
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader

# Define the transformation for the test data
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Define the test dataset using ImageFolder
test_dataset = ImageFolder(root='C:/new/data', transform=transform)

# Create the test data loader
batch_size = 32  # Adjust as needed
test_dataloader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

# Assuming 'path_to_test_data' is the path to the root folder of your test data
# The subfolders within 'path_to_test_data' should represent different classes
# Each image should be in its respective class subfolder

# Function to get predictions from your PyTorch model
def get_predictions(model, dataloader):
    model.eval()
    all_labels = []
    all_predictions = []

    with torch.no_grad():
        for inputs, labels in dataloader:
            outputs = model(inputs)
            _, predictions = torch.max(outputs, 1)
            all_labels.extend(labels.numpy())
            all_predictions.extend(predictions.numpy())

    return all_labels, all_predictions

# Load your trained model
model = SimpleCNN()
model.load_state_dict(torch.load('custom_cnn_model.pth'))
model.eval()

# Get true labels and predicted labels
true_labels, predicted_labels = get_predictions(model, test_dataloader)

# Compute confusion matrix
cm = confusion_matrix(true_labels, predicted_labels)

# Plot confusion matrix
classes = ['Fake', 'True']  # Replace with your actual class labels
plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
plt.title('Confusion Matrix')
plt.colorbar()

tick_marks = np.arange(len(classes))
plt.xticks(tick_marks, classes, rotation=45)
plt.yticks(tick_marks, classes)

plt.xlabel('Predicted Label')
plt.ylabel('True Label')

plt.show()
