import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        
        {/* Private/Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Fallback (404) */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;