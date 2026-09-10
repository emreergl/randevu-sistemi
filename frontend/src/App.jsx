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
import AdminServices from "./pages/AdminServices";
import AdminEmployees from "./pages/AdminEmployees";
import AdminAppointments from "./pages/AdminAppointments";
import Services from "./pages/Services";
import Prices from "./pages/Prices";
import AdminCustomers from "./pages/AdminCustomers";
import Footer from "./components/Footer";

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
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/employees" element={<AdminEmployees />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/services" element={<Services />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;