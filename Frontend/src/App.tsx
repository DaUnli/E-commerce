import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Login/Login";
import Admin from "./Pages/Admin/Admin";
import Home from "./Pages/Home/Home";
import SignUp from "./Pages/SignUp/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route path="/" element={<Home />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;