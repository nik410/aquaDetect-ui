

import React, { useState, useRef } from 'react';
// Assuming your Modal.jsx is in the same 'src' directory,
// and it's named 'Modal.jsx' or 'Modal.js' and exports default as 'Modal'.
// If it's in a subdirectory like 'Modal/Modal.jsx', the import path is correct.
import Modal from './Modal/Modal';

export default function App() {
  const [previewSrc, setPreviewSrc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the actual file object
  const fileInputRef = useRef(null);

  // States for displaying messages via the Modal component, including image data
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    imageData: '' // New state for base64 image data to be shown in modal
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setPreviewSrc('');
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setModalContent({
        title: "Invalid File Type",
        message: "Please upload a valid image file (e.g., JPG, PNG, GIF).",
        imageData: ''
      });
      setIsModalOpen(true);
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
      setModalContent({
        title: "No File Selected",
        message: "Please select an image file to upload first.",
        imageData: ''
      });
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true); // Start loading

    const formData = new FormData();
    // 'image' is the key that your Flask backend is looking for (request.files['image'])
    formData.append('image', selectedFile);

    try {
      // Make sure this URL matches where your Flask backend is running
      // By default, Flask runs on http://localhost:5000
      const response = await fetch('http://localhost:5000/upload-image', {
        method: 'POST',
        body: formData, // Send FormData directly
      });

      const data = await response.json(); // Parse the JSON response from Flask

      if (response.ok) { // Check if the HTTP status code is 2xx (success)
        setModalContent({
          title: "Analysis Result",
          message: data.message || "Image processed successfully!",
          imageData: data.processed_image_data || '' // Assuming backend sends 'processed_image_data'
        });
        setIsModalOpen(true);
        // Clear preview and selected file after successful upload
        setPreviewSrc('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the file input field
        }
      } else {
        // Handle backend errors (e.g., if Flask returned a 400 or 500)
        setModalContent({
          title: "Upload Failed",
          message: data.error || 'An unknown error occurred during upload.',
          imageData: ''
        });
        setIsModalOpen(true);
      }
    } catch (error) {
      // Handle network errors (e.g., Flask server is not running)
      console.error('Error uploading image:', error);
      setModalContent({
        title: "Network Error",
        message: 'Could not connect to the backend. Please ensure your Flask server is running.',
        imageData: ''
      });
      setIsModalOpen(true);
    } finally {
      setIsLoading(false); // End loading regardless of success or failure
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({ title: '', message: '', imageData: '' }); // Clear modal content on close
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans">
      <header className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-8 text-center drop-shadow-sm">
        AquaDetect: Fish Disease Detection
      </header>
      <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 text-center">
        Upload your image
      </h1>
      <main className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl flex flex-col items-center space-y-6 max-w-sm sm:max-w-md w-full border border-gray-200">
        <div
          role="button"
          tabIndex={0}
          onClick={handleIconClick}
          onKeyDown={handleIconKeyDown}
          aria-label="Upload image"
          title="Click to upload image"
          className="cursor-pointer text-6xl p-4 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 active:scale-95"
        >
          &#128247; {/* Camera icon */}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="text-gray-600 text-center">
          Click the camera icon to upload an image
          {selectedFile && (
            <p className="text-sm mt-2 text-blue-600 font-medium">
              File selected: <span className="font-bold">{selectedFile.name}</span>
            </p>
          )}
        </div>

        {previewSrc && (
          <img
            src={previewSrc}
            alt="Image preview"
            className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 mt-4"
          />
        )}

        <button
          onClick={handleImageUpload}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full"
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Image'
          )}
        </button>
      </main>

      {/* Modal component for showing messages */}
      {isModalOpen && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          imageData={modalContent.imageData} // Pass imageData to the Modal
          onClose={closeModal}
        />
      )}
    </div>
  );
}


// import React, { useState, useRef } from 'react';
// import './UploadPage.css'; // Make sure this CSS file is present for styling
// import Modal from './Modal/Modal'; // Assuming your Modal.jsx is in the same 'src' directory

// export default function UploadPage() {
//   const [previewSrc, setPreviewSrc] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null); // State to hold the actual file object
//   const fileInputRef = useRef(null);

//   // States for displaying messages via the Modal component
//   const [modalMessage, setModalMessage] = useState(null);
//   const [modalTitle, setModalTitle] = useState('');

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) {
//       setPreviewSrc('');
//       setSelectedFile(null);
//       return;
//     }

//     if (!file.type.startsWith('image/')) {
//       setModalTitle("Invalid File Type");
//       setModalMessage("Please upload a valid image file (e.g., JPG, PNG, GIF).");
//       event.target.value = ''; // Clear the file input
//       setPreviewSrc('');
//       setSelectedFile(null);
//       return;
//     }

//     // Set the selected file for later upload
//     setSelectedFile(file);

//     // Read the file for immediate preview
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

//   // Function to handle the actual image upload to the backend
//   const handleImageUpload = async () => {
//     if (!selectedFile) {
//       setModalTitle("No File Selected");
//       setModalMessage("Please select an image file to upload first.");
//       return;
//     }

//     const formData = new FormData();
//     // 'image' is the key that your Flask backend is looking for (request.files['image'])
//     formData.append('image', selectedFile);

//     try {
//       // Make sure this URL matches where your Flask backend is running
//       // By default, Flask runs on http://localhost:5000
//       const response = await fetch('http://localhost:5000/upload-image', {
//         method: 'POST',
//         body: formData, // Send FormData directly
//       });

//       const data = await response.json(); // Parse the JSON response from Flask

//       if (response.ok) { // Check if the HTTP status code is 2xx (success)
//         setModalTitle("Upload Successful");
//         setModalMessage(data.message);
//         // Clear preview and selected file after successful upload
//         setPreviewSrc('');
//         setSelectedFile(null);
//         if (fileInputRef.current) {
//           fileInputRef.current.value = ''; // Clear the file input field
//         }
//       } else {
//         // Handle backend errors (e.g., if Flask returned a 400 or 500)
//         setModalTitle("Upload Failed");
//         setModalMessage(data.error || 'An unknown error occurred during upload.');
//       }
//     } catch (error) {
//       // Handle network errors (e.g., Flask server is not running)
//       console.error('Error uploading image:', error);
//       setModalTitle("Network Error");
//       setModalMessage('Could not connect to the backend. Please ensure your Flask server is running.');
//     }
//   };


//   return (
//     <div className="upload-container">
//       <header className="upload-header">
//         AquaDetect : Fish Disease Detection
//       </header>
//       <h1 style={{
//         color: 'black',
//         textAlign: 'center'
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
//           {selectedFile && <p style={{ fontSize: '0.8rem', marginTop: '5px', color: '#4a90e2' }}>File selected: {selectedFile.name}</p>}
//         </div>

//         {previewSrc && (
//           <img
//             src={previewSrc}
//             alt="Image preview"
//             className="preview-image"
//           />
//         )}

//         {/* New button to trigger the upload to the backend */}
//         <button
//           onClick={handleImageUpload}
//           className="upload-note"
//           disabled={!selectedFile} 
//         >
//           Analyze Image
//         </button>
//       </main>

//       {/* Modal component for showing messages */}
//       {modalMessage && (
//         <Modal title={modalTitle} message={modalMessage} onClose={() => setModalMessage(null)} />
//       )}
//     </div>
//   );
// }
















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
