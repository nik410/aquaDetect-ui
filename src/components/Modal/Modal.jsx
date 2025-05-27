import React from 'react';

export default function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState({
    title: '',
    message: '',
    imageData: ''
  });

  // Example base64 image data (a small transparent GIF for demonstration)
  // In a real application, this would come from an API or file upload
  const exampleBase64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // A 1x1 transparent GIF

  const openModalWithImage = () => {
    setModalContent({
      title: 'Image Details',
      message: 'Here is the image you requested:',
      imageData: exampleBase64Image // Replace with your actual base64 image data
    });
    setIsModalOpen(true);
  };

  const openModalWithoutImage = () => {
    setModalContent({
      title: 'Information',
      message: 'This is a modal without an image.',
      imageData: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Modal Demonstration</h1>
      <div className="space-x-4">
        <button
          onClick={openModalWithImage}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
        >
          Open Modal with Image
        </button>
        <button
          onClick={openModalWithoutImage}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300"
        >
          Open Modal without Image
        </button>
      </div>

      {isModalOpen && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          imageData={modalContent.imageData}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// Modal Component
function Modal({ title, message, imageData, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      {/* Modal Content Box */}
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none font-light"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">{message}</p>
          {imageData && (
            <div className="mt-4 flex justify-center">
              {/*
                Important: The 'data:image/jpeg;base64,' prefix is crucial.
                You might need to adjust 'jpeg' to 'png', 'gif', etc.,
                depending on the actual image type encoded in base64.
                If the image type is dynamic, you would need to pass it
                as another prop (e.g., `imageMimeType`) and construct
                the src attribute like `data:${imageMimeType};base64,${imageData}`.
              */}
              <img
                src={`data:image/jpeg;base64,${imageData}`}
                alt="Modal content"
                className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null; // Prevents infinite loop if fallback also fails
                  e.target.src = "https://placehold.co/400x300/CCCCCC/333333?text=Image+Load+Error";
                  console.error("Failed to load image:", e.target.src);
                }}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}






// import React from 'react';
// import './Modal.css'; // Make sure you have a Modal.css file

// export default function Modal({ title, message, onClose }) {
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
//         <div className="modal-footer">
//           <button onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React from 'react';

// export default function Modal({ title, message, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 font-inter">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all scale-100 opacity-100">
//         <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
//         <p className="text-gray-700 mb-6">{message}</p>
//         <div className="flex justify-end">
//           <button
//             onClick={onClose}
//             className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
