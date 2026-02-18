import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin/AdminDashboard"

const routes = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/Register", element: <Register /> },
  { path: "/home", element: <Home />},
  { path: "/admin", element: <Admin />},
]);

const App = () => <RouterProvider router={routes} />;

export default App;