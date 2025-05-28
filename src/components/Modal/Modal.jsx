// src/Modal/Modal.jsx
import React from 'react';
import './Modal.css'; // Make sure this CSS file exists

// Change the prop name to match what you're sending from UploadPage
export default function Modal({ title, message, image, resultsMetrics, onClose }) { // Renamed image to image to match prop
  // Helper to determine the image type if your backend doesn't specify (e.g., 'jpeg', 'png')
  // You might need to adjust this based on what your backend actually sends.
  // A common approach is to assume JPEG or PNG based on common use cases.
  // If your base64 string starts with /9j/, it's typically JPEG. If it starts with iVBORw0KGgo, it's PNG.
  const getImageMimeType = (base64String) => {
    if (!base64String) return 'image/jpeg'; // Default or handle null
    if (base64String.startsWith('/9j/')) {
      return 'image/jpeg';
    } else if (base64String.startsWith('iVBORw0KGgo')) {
      return 'image/png';
    }
    // Add more types if needed, or default to a common one
    return 'image/jpeg'; // Fallback
  };

  const imageMimeType = getImageMimeType(image);

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
          {image && ( // Only render the img tag if the 'image' prop has a value
            <img
              // Construct the data URL: data:<MIME_TYPE>;base64,<BASE64_STRING>
              src={`data:${imageMimeType};base64,${image}`}
              alt="Result Image"
              style={{
                maxWidth: '100%',     // Ensures the image fits within the modal width
                height: 'auto',      // Maintains aspect ratio
                display: 'block',    // Removes extra space below inline images
                margin: '15px auto 0 auto', // Adds space above and centers the image
                border: '1px solid #eee' // Optional: subtle border
              }}
            />
          )}

          <p> { resultsMetrics }</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}


// import React from 'react';
// import './Modal.css'; // Make sure you have a Modal.css file

// export default function Modal({ title, message, image, onClose }) {
//   return (
//     <div className="modal-backdrop"> {/* This will cover the entire screen */}
//       <div className="modal-content"> {/* This is your actual modal box */}
//         <div className="modal-header">
//           <h2>{title}</h2>
//           <button className="modal-close-button" onClick={onClose}>&times;</button>
//         </div>
//         <div className="modal-body">
//           <p>{message}</p>
//         </div>
//         <div className='modal-body'>
//           <p> { image } </p>
//         </div>
//         <div className="modal-footer">
//           <button onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }