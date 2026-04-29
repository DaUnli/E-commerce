import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// User Pages
import Home from "./pages/user/Home/Home";
import Login from "./pages/user/Login/Login";
import Register from "./pages/user/Register/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;