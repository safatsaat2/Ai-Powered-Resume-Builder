import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Portfolio from './pages/portfolio';
import CoverLetter from './pages/cover-letter';
import Resume from './pages/resume';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Resume />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
      </Routes>
    </Router>
  );
}

export default App;
