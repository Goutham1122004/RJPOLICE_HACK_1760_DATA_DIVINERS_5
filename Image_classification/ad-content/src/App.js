// import React, { useState } from 'react';
// import './App.css';

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [prediction, setPrediction] = useState(null);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handlePredict = async () => {
//     const formData = new FormData();
//     formData.append('image', selectedFile);

//     try {
//       const response = await fetch('http://localhost:5000/predict', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       setPrediction(data.prediction);
//     } catch (error) {
//       console.error('Error predicting:', error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>PyTorch CNN Image Classifier</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handlePredict}>Predict</button>

//       {prediction && (
//         <div>
//           <h2>Prediction: {prediction}</h2>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;



import React, { useState } from 'react';

const App = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const apiUrl = 'http://localhost:5000/predict';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePredict = () => {
    if (!file) {
      alert('Please choose an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      setPrediction(data.prediction);
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handlePredict}>Predict</button>
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
  );
};

export default App;
