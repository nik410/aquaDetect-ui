import React from 'react';
import './Modal.css'; // Make sure you have a Modal.css file

export default function Modal({ title, message, onClose }) {
  return (
    <div className="modal-backdrop"> {/* This will cover the entire screen */}
      <div className="modal-content"> {/* This is your actual modal box */}
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}



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
