import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MyAppointments from "./pages/MyAppointments";
import AdminDashboard from "./pages/AdminDashboard";
import Booking from "./pages/Booking";
import BookingTime from "./pages/BookingTime";
import BookingSuccess from "./pages/BookingSuccess";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider> 
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/appointments" element={<MyAppointments />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/booking/time" element={<BookingTime />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/booking/success" element={<BookingSuccess />} />
      <Route path ="/profile" element={<Profile />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;