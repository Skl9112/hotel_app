import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import MainPage from './components/MainPage';
import CategoriesPage from './components/CategoriesPage';
import RoomsPage from './components/RoomsPage'; 
import ClientsPage from './components/ClientsPage'; 
import BookingsPage from './components/BookingsPage'; 
import PaymentsPage from './components/PaymentsPage'; 
import GuestBookingPage from './components/GuestBookingPage'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/main" element={<MainPage />} />
		<Route path="/categories" element={<CategoriesPage />} />
		<Route path="/rooms" element={<RoomsPage />} /> 
		<Route path="/clients" element={<ClientsPage />} />
		<Route path="/bookings" element={<BookingsPage />} />
		<Route path="/payments" element={<PaymentsPage />} />
		<Route path="/guest-booking" element={<GuestBookingPage />} />




      </Routes>
    </Router>
  );
};

export default App;
