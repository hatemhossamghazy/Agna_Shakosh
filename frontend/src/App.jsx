import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EquipmentStore from './pages/EquipmentStore';
import Workers from './pages/Workers';
import RentalPage from './pages/RentalPage';
import CompleteProfile from './pages/CompleteProfile';
import AdminApplications from './pages/AdminApplications';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UploadEquipment from './pages/UploadEquipment';
import ProfilePage from './pages/ProfilePage';
import RentalInformation from './pages/RentalInformation';
import WorkerDetails from './pages/WorkerDetails';
import OrderDetails from './pages/OrderDetails';
import WorkersProfile from './pages/WorkersProfile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/equipment-store" element={<EquipmentStore />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/rental" element={<RentalPage />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/admin-applications" element={<AdminApplications />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/upload-equipment" element={<UploadEquipment />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/rental-information/:id" element={<RentalInformation />} />
        
        <Route path="/worker-details/:id" element={<WorkerDetails />} />
        <Route path="/order-details/:id" element={<OrderDetails />} />
        <Route path="/workers-profile" element={<WorkersProfile />} />
      </Routes>
    </Router>
  );
}

export default App;