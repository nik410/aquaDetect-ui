import AuthInputs from './components/AuthInputs.jsx';
import Header from './components/Header.jsx';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UploadPage from './components/UploadPage.jsx';
import HomePage from './components/HomePage.jsx';

export default function App() {
  return (
    <>
      <Router>
      {/* You can add a Header component here if you want it to appear on all pages */}
      {/* <Header /> */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        {/* You can add other routes here as needed */}
      </Routes>
    </Router>
     
     
    </>
  );
}



