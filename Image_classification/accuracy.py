import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from plotly.subplots import make_subplots
import plotly.graph_objects as go
from PIL import Image
import matplotlib.pyplot as plt

# Define the path to your custom image
custom_image_path = r'C:\new\input'

# SimpleCNN class definition
class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, stride=1, padding=1)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.fc1 = nn.Linear(32 * 56 * 56, 64)
        self.relu3 = nn.ReLU()
        self.fc2 = nn.Linear(64, 2)  # 2 output classes: fake and true

    def forward(self, x):
        x = self.pool1(self.relu1(self.conv1(x)))
        x = self.pool2(self.relu2(self.conv2(x)))
        x = x.view(-1, 32 * 56 * 56)
        x = self.relu3(self.fc1(x))
        x = self.fc2(x)
        return x

# Define the image transformation pipeline
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load the custom dataset
dataset = ImageFolder(root=custom_image_path, transform=transform)

# Split the dataset into training and validation sets (80-20 split)
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])

# Create data loaders
batch_size = 4
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=batch_size)

# Initialize the model
model = SimpleCNN()

# Define the loss function and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
num_epochs = 96  # Set the number of epochs to 96
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Placeholder for accuracy values
accuracy_data = {'epoch': [], 'accuracy': []}

for epoch in range(num_epochs):
    model.train()
    train_loss = 0.0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        train_loss += loss.item() * images.size(0)

    model.eval()
    val_loss = 0.0
    val_corrects = 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            val_corrects += torch.sum(preds == labels.data)

    train_loss = train_loss / len(train_loader.dataset)
    val_loss = val_loss / len(val_loader.dataset)
    val_accuracy = val_corrects.double() / len(val_loader.dataset)

    # Save accuracy data for plotting
    accuracy_data['epoch'].append(epoch + 1)
    accuracy_data['accuracy'].append(val_accuracy.item())

# Save the trained model
torch.save(model.state_dict(), 'custom_cnn_model.pth')

# Print final accuracy score at epoch 96
final_accuracy = accuracy_data['accuracy'][-1]
print(f"Accuracy at Epoch 96: {final_accuracy:.4f}")

# Plot the accuracy graph
plt.figure(figsize=(10, 5))
plt.plot(accuracy_data['epoch'], accuracy_data['accuracy'], marker='o')
plt.title('Validation Accuracy Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.grid(True)
plt.show()

# Create a candlestick graph
fig = make_subplots(rows=1, cols=1, shared_xaxes=True, vertical_spacing=0.02)
fig.add_trace(
    go.Candlestick(x=accuracy_data['epoch'],
                   open=[1.0 for _ in accuracy_data['epoch']],
                   high=accuracy_data['accuracy'],
                   low=accuracy_data['accuracy'],
                   close=accuracy_data['accuracy'],
                   increasing_line_color='green',
                   decreasing_line_color='red'),
    row=1, col=1
)

fig.update_layout(title_text='Accuracy stands at 96',
                #   xaxis_title='Epoch',
                  yaxis_title='Accuracy')

fig.show()
