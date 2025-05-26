import { useState } from 'react';
import loginDetails from '../data/credentials';
import UploadPage from './UploadPage'; // Import the UploadPage component
import Header from './Header';
import Modal from './Modal/Modal'; // Correct import path for your Modal

export default function AuthInputs() {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  // States for displaying messages via the Modal component
  const [modalMessage, setModalMessage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  // Function to close the modal
  const closeModalHandler = () => {
    setModalMessage(null);
    setModalTitle('');
  };

  function handleInputChange(identifier, value) {
    if (identifier === 'email') {
      setEnteredEmail(value);
    } else {
      setEnteredPassword(value);
    }
  }

  function handleCreateAccount() {
    // Clear previous modal messages
    closeModalHandler();

    // Validate entered email and password before creating
    if (!enteredEmail.includes('@')) {
      setModalTitle("Invalid Email");
      setModalMessage("Please enter a valid email ID which contains @.");
      return; // Stop execution if validation fails
    }
    if (enteredPassword.trim().length < 6) {
      setModalTitle("Invalid Password");
      setModalMessage("Please enter a password with at least 6 characters.");
      return; // Stop execution if validation fails
    }

    // Load existing stored accounts or initialize empty array
    const storedAccounts = JSON.parse(localStorage.getItem('createdAccounts')) || [];

    // Check if email already exists in static or stored accounts
    const emailExistsInStatic = loginDetails.some(account => account.username === enteredEmail);
    const emailExistsInStored = storedAccounts.some(account => account.username === enteredEmail);
    if (emailExistsInStatic || emailExistsInStored) {
      setModalTitle("Account Exists");
      setModalMessage("An account with this email already exists. Please sign in or use a different email.");
      return; // Stop execution if validation fails
    }

    // Add new account
    const newAccounts = [...storedAccounts, { username: enteredEmail, password: enteredPassword }];
    // Update localStorage
    localStorage.setItem('createdAccounts', JSON.stringify(newAccounts));

    setModalTitle("Account Created");
    setModalMessage("Your account has been created successfully! You can now sign in.");
    // Optionally clear input fields after successful creation
    setEnteredEmail('');
    setEnteredPassword('');
    setSubmitted(false); // Reset submitted state
  }

  function handleLogin() {
    setSubmitted(true);
    // Clear previous modal messages
    closeModalHandler();

    let foundUser = null;

    // Check static credentials
    foundUser = loginDetails.find(
      (entry) => entry.username === enteredEmail && entry.password === enteredPassword
    );

    // If not found in static, check newly created accounts from localStorage
    if (!foundUser) {
      const storedAccounts = JSON.parse(localStorage.getItem('createdAccounts')) || [];
      foundUser = storedAccounts.find(
        (entry) => entry.username === enteredEmail && entry.password === enteredPassword
      );
    }

    if (foundUser) {
      setIsLoggedIn(true); // Set isLoggedIn to true on successful login
    } else {
      setModalTitle("Invalid Credentials");
      setModalMessage("Please enter valid email and password.");
    }
  }

  const emailNotValid = submitted && !enteredEmail.includes('@');
  const passwordNotValid = submitted && enteredPassword.trim().length < 6;

  return (
    <>
      {isLoggedIn ? (
        <UploadPage /> // Render UploadPage if isLoggedIn is true
      ) : (
        <>
          <Header />
          <div id="auth-inputs">
            <div className="controls">
              <p>
                <label>Email</label>
                <input
                  type="email"
                  className={emailNotValid ? 'invalid' : undefined}
                  onChange={(event) => handleInputChange('email', event.target.value)}
                  value={enteredEmail} // Bind value to state
                />
              </p>
              <p>
                <label>Password</label>
                <input
                  type="password"
                  className={passwordNotValid ? 'invalid' : undefined}
                  onChange={(event) =>
                    handleInputChange('password', event.target.value)
                  }
                  value={enteredPassword} // Bind value to state
                />
              </p>
            </div>
            <div className="actions">
              <button type="button" className="text-button" onClick={handleCreateAccount}>
                Create a new account
              </button>
              <button className='button' onClick={handleLogin}>Sign In</button>
            </div>
          </div>
        </>
      )}

      {/* Conditionally render the Modal based on modalMessage state */}
      {modalMessage && (
        <Modal
          title={modalTitle}
          message={modalMessage}
          onClose={closeModalHandler}
        />
      )}
    </>
  );
}



// import { useState } from 'react';
// import loginDetails from '../data/credentials';
// import UploadPage from './UploadPage'; // Import the UploadPage component
// import Header from './Header';
// import Modal from './Modal/Modal';

// export default function AuthInputs() {
//   const [enteredEmail, setEnteredEmail] = useState('');
//   const [enteredPassword, setEnteredPassword] = useState('');
//   const [submitted, setSubmitted] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

//   function handleInputChange(identifier, value) {
//     if (identifier === 'email') {
//       setEnteredEmail(value);
//     } else {
//       setEnteredPassword(value);
//     }
//   }

//   function handleCreateAccount() {
//     // validate entered email and password before creating
//     if (!enteredEmail.includes('@')) {
//       <Modal title={"Invalid Email"} message={"Please enter valid email id which contains @"} onClose={() => setModalMessage(null)} />

//       return;
//     }
//     if (enteredPassword.trim().length < 6) {
//       <Modal title={"Invalid PAssword"} message={"Please enter a password with atleast 6 characters"} onClose={() => setModalMessage(null)} />

//       return;
//     }

//     // Load existing stored accounts or initialize empty array
//     const storedAccounts = JSON.parse(localStorage.getItem('createdAccounts')) || [];

//     // Check if email already exists in static or stored accounts
//     const emailExistsInStatic = loginDetails.some(account => account.username === enteredEmail);
//     const emailExistsInStored = storedAccounts.some(account => account.username === enteredEmail);
//     if (emailExistsInStatic || emailExistsInStored) {
//       <Modal title={"Invalid Credentials"} message={"Please enter valid login and password"} onClose={() => setModalMessage(null)} />
//       return;
//     }

//     // Add new account
//     const newAccounts = [...storedAccounts, { username: enteredEmail, password: enteredPassword }];
//     // Update localStorage
//     localStorage.setItem('createdAccounts', JSON.stringify(newAccounts));

//     alert('Account created successfully!');
//   }

//   function handleLogin() {
//     setSubmitted(true);
//     let search = loginDetails.find(
//       (entry) => entry.username === enteredEmail && entry.password === enteredPassword
//     );

//     // Also check newly created accounts
//     const storedAccounts = JSON.parse(localStorage.getItem('createdAccounts')) || [];
//     const foundInStored = storedAccounts.find(
//       (entry) => entry.username === enteredEmail && entry.password === enteredPassword
//     );

//     if (search || foundInStored) {
//       setIsLoggedIn(true); // Set isLoggedIn to true on successful login
//     } else {
//       <Modal title={"Invalid Credentials"} message={"Please enter valid login and password"} onClose={() => setModalMessage(null)} />

//     }
//   }

//   const emailNotValid = submitted && !enteredEmail.includes('@');
//   const passwordNotValid = submitted && enteredPassword.trim().length < 6;

//   return (
//     <>
//       {isLoggedIn ? (
//         <UploadPage /> // Render UploadPage if isLoggedIn is true
//       ) : (
//         <>
//         <Header />
//         <div id="auth-inputs">
//           <div className="controls">
//             <p>
//               <label>Email</label>
//               <input
//                 type="email"
//                 className={emailNotValid ? 'invalid' : undefined}
//                 onChange={(event) => handleInputChange('email', event.target.value)}
//               />
//             </p>
//             <p>
//               <label>Password</label>
//               <input
//                 type="password"
//                 className={passwordNotValid ? 'invalid' : undefined}
//                 onChange={(event) =>
//                   handleInputChange('password', event.target.value)
//                 }
//               />
//             </p>
//           </div>
//           <div className="actions">
//             <button type="button" className="text-button" onClick={handleCreateAccount}>
//               Create a new account
//             </button>
//             <button className='button' onClick={handleLogin}>Sign In</button>
//           </div>
//         </div>
//         </>
//       )}
//     </>
//   );
// }  
  
  
  
  
  
//   // import { useState } from 'react';
//   // import loginDetails from '../data/credentials';

//   // export default function AuthInputs() {
//   //   const [enteredEmail, setEnteredEmail] = useState('');
//   //   const [enteredPassword, setEnteredPassword] = useState('');
//   //   const [submitted, setSubmitted] = useState(false);

//   //   function handleInputChange(identifier, value) {
//   //     if (identifier === 'email') {
//   //       setEnteredEmail(value);
//   //     } else {
//   //       setEnteredPassword(value);
//   //     }
//   //   }

//   //   function handleCreateAccount() {
//   //     // validate entered email and password before creating
//   //     if (!enteredEmail.includes('@')) {
//   //       alert('Please enter a valid email.');
//   //       return;
//   //     }
//   //     if (enteredPassword.trim().length < 6) {
//   //       alert('Password must be at least 6 characters.');
//   //       return;
//   //     }
//   //     // Searching the loginDetails for if it contains the existing username 

//   //     let search = loginDetails.find(
//   //       (entry) => entry.username === enteredEmail && entry.password === enteredPassword
//   //     );

//   //     if(search === undefined){
//   //       loginDetails.push({enteredEmail, enteredPassword});
//   //       alert("Entered into array.")
//   //     }

//   //     // Load existing stored accounts or initialize empty array
//   // const storedAccounts = JSON.parse(localStorage.getItem('createdAccounts')) || [];
//   // alert(`The stored Accounts are ${storedAccounts}`)
  
//   // // Check if email already exists in static or stored accounts
//   // const emailExistsInStatic = loginDetails.some(account => account.username === enteredEmail);
//   // const emailExistsInStored = storedAccounts.some(account => account.username === enteredEmail);
//   // if (emailExistsInStatic || emailExistsInStored) {
//   //   alert('Email already exists. Please use a different email.');
//   //   return;
//   // }
  
//   // // Add new account
//   // const newAccounts = [...storedAccounts, { username: enteredEmail, password: enteredPassword }];
//   // // Update localStorage
//   // localStorage.setItem('createdAccounts', JSON.stringify(newAccounts));
  
//   // // If you have a React state managing combined credentials like setAllCredentials,
//   // // update it here. This is optional depending on your app structure
//   // if (typeof setAllCredentials === 'function') {
//   //   setAllCredentials([...loginDetails, ...newAccounts]);
//   // }
  
//   // alert('Account created successfully!');

//   //   }
    

//   //   function handleLogin() {
//   //     setSubmitted(true);
//   //     let search = loginDetails.find(
//   //       (entry) => entry.username === enteredEmail && entry.password === enteredPassword
//   //     );
//   //     let message = `Successfull. The username is ${enteredEmail} and the password is ${enteredPassword}. In the storage or not ${search}`;
//   //     alert(message);
     
      
//   //   }

//   //   const emailNotValid = submitted && !enteredEmail.includes('@');
//   //   const passwordNotValid = submitted && enteredPassword.trim().length < 6;

//   //   return (
//   //     <div id="auth-inputs">
//   //       <div className="controls">
//   //         <p>
//   //           <label>Email</label>
//   //           <input
//   //             type="email"
//   //             className={emailNotValid ? 'invalid' : undefined}
//   //             onChange={(event) => handleInputChange('email', event.target.value)}
//   //           />
//   //         </p>
//   //         <p>
//   //           <label>Password</label>
//   //           <input
//   //             type="password"
//   //             className={passwordNotValid ? 'invalid' : undefined}
//   //             onChange={(event) =>
//   //               handleInputChange('password', event.target.value)
//   //             }
//   //           />
//   //         </p>
//   //       </div>
//   //       <div className="actions">
//   //         <button type="button" className="text-button" onClick = { handleCreateAccount }>
//   //           Create a new account
//   //         </button>
//   //         <button className='button' onClick={handleLogin}>Sign In</button>
//   //       </div>
//   //     </div>
//   //   );
//   // }



