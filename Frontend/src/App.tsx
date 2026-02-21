import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Login/Login';
import Admin from './Pages/Admin/Admin';
import Home from './Pages/Home/Home';
import SignUp from './Pages/SignUp/SignUp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />f
      </Routes>
    </BrowserRouter>
  );
};

export default App;