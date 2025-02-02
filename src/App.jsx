import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import AddProducts from './pages/AddProducts';
import PaymentPage from './pages/PaymentPage';
import TrackingPage from './pages/TrackingPage';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_SECRET_KEY);

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/:id' element={<ProductPage />} />
        <Route path='/u/:userId' element={<ProfilePage />} />
        <Route path='/item/add' element={<AddProducts />} />
        <Route path='/item/track' element={<TrackingPage />} />
        <Route
          path='/item/checkout'
          element={
            <Elements stripe={stripePromise}>
              <PaymentPage />
            </Elements>
          }
        />
      </Routes>
    </>
  );
}

export default App;
