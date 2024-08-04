import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import SignupPage from './pages/Auth/signupPage';
import LoginPage from './pages/Auth/loginPage';
import Dashboard from './pages/dashboard';
import PantryListPage from './pages/pantryListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/pantryList/:pantryName?" element={<PantryListPage pantryName="Default Pantry" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;