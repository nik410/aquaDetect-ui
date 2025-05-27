
import React, { useState, useRef } from 'react';
import './UploadPage.css'; // Make sure this CSS file is present for styling
import Modal from './Modal/Modal'; // Assuming your Modal.jsx is in the same 'src' directory

export default function UploadPage() {
  const [previewSrc, setPreviewSrc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the actual file object
  const fileInputRef = useRef(null);
const [processedImage, setProcessedImage] = useState(null);

  // States for displaying messages via the Modal component
  const [modalMessage, setModalMessage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setPreviewSrc('');
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setModalTitle("Invalid File Type");
      setModalMessage("Please upload a valid image file (e.g., JPG, PNG, GIF).");
      event.target.value = ''; // Clear the file input
      setPreviewSrc('');
      setSelectedFile(null);
      return;
    }

    // Set the selected file for later upload
    setSelectedFile(file);

    // Read the file for immediate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleIconKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleIconClick();
    }
  };

  // Function to handle the actual image upload to the backend
  const handleImageUpload = async () => {
    if (!selectedFile) {
      setModalTitle("No File Selected");
      setModalMessage("Please select an image file to upload first.");
      return;
    }

    const formData = new FormData();
    // 'image' is the key that your Flask backend is looking for (request.files['image'])
    formData.append('image', selectedFile);

    try {
      // Make sure this URL matches where your Flask backend is running
      // By default, Flask runs on http://localhost:5000
      const response1 = await fetch('http://127.0.0.1:5000/', {
        method: 'GET',
      });
      console.log("fetch")

      const response = await fetch('http://127.0.0.1:5000/uploadimg', {
        method: 'POST',
        body: formData, // Send FormData directly
      });

      const data = await response.json(); // Parse the JSON response from Flask
      const base64 = data.processing_details.display_image;
      const imageSrc = `data:image/jpeg;base64,${base64}`;
    setProcessedImage(imageSrc);

      if (response.ok) { // Check if the HTTP status code is 2xx (success)
        setModalTitle("Upload Successful");
        setModalMessage(data.message);
        // Clear preview and selected file after successful upload
        setPreviewSrc('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the file input field
        }
      } else {
        // Handle backend errors (e.g., if Flask returned a 400 or 500)
        setModalTitle("Upload Failed");
        setModalMessage(data.error || 'An unknown error occurred during upload.');
      }
    } catch (error) {
      // Handle network errors (e.g., Flask server is not running)
      console.error('Error uploading image:', error);
      setModalTitle("Network Error");
      setModalMessage('Could not connect to the backend. Please ensure your Flask server is running.');
    }
  };


  return (
    <div className="upload-container">
      <header className="upload-header">
        AquaDetect : Fish Disease Detection
      </header>
      <h1 style={{
        color: 'black',
        textAlign: 'center'
      }}>Upload your image</h1>
      <main className="upload-main">
        <div
          role="button"
          tabIndex={0}
          onClick={handleIconClick}
          onKeyDown={handleIconKeyDown}
          aria-label="Upload image"
          title="Click to upload image"
          className="upload-icon"
        >
          &#128247;
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="upload-note">
          Click the camera icon to upload an image
          {selectedFile && <p style={{ fontSize: '0.8rem', marginTop: '5px', color: '#4a90e2' }}>File selected: {selectedFile.name}</p>}
        </div>

        {previewSrc && (
          <img
            src={previewSrc}
            alt="Image preview"
            className="preview-image"
          />
        )}

        {/* New button to trigger the upload to the backend */}
        <button
          onClick={handleImageUpload}
          className="upload-note"
          disabled={!selectedFile} 
        >
          Analyze Image
        </button>
      </main>
      {processedImage && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <h2>Processed Image</h2>
    <img
      src={processedImage}
      alt="Processed result"
      style={{ maxWidth: '100%', height: 'auto', border: '2px solid #4a90e2', borderRadius: '8px' }}
    />
  </div>
)}


      {/* Modal component for showing messages */}
      {modalMessage && (
        <Modal title={modalTitle} message={modalMessage} onClose={() => setModalMessage(null)} />
      )}
    </div>
  );
}
















// import React, { useState, useRef } from 'react';
// import './UploadPage.css';

// export default function UploadPage() {
//   const [previewSrc, setPreviewSrc] = useState('');
//   const fileInputRef = useRef(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       alert('Please upload a valid image file');
//       event.target.value = '';
//       setPreviewSrc('');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreviewSrc(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleIconClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleIconKeyDown = (event) => {
//     if (event.key === 'Enter' || event.key === ' ') {
//       event.preventDefault();
//       handleIconClick();
//     }
//   };

//   return (
//     <div className="upload-container">
//       <header className="upload-header">
//         AquaDetect : Fish Disease Detection
//       </header>
//       <h1 style= {{
//         color:'black',
//         textAlign:'center'
//       }}>Upload your image</h1>
//       <main className="upload-main">
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={handleIconClick}
//           onKeyDown={handleIconKeyDown}
//           aria-label="Upload image"
//           title="Click to upload image"
//           className="upload-icon"
//         >
//           &#128247;
//         </div>
//         <input
//           type="file"
//           accept="image/*"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           style={{ display: 'none' }}
//         />
//         <div className="upload-note">
//           Click the camera icon to upload an image
//         </div>
//         {previewSrc && (
//           <img
//             src={previewSrc}
//             alt="Image preview"
//             className="preview-image"
//           />
//         )}
//       </main>
//     </div>
//   );
// }
