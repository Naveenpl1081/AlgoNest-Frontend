import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import RecruiterRoutes from './routes/RecruiterRoutes'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AdminRoutes from './routes/AdminRoutes';

const App: React.FC = () => {
  
 
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope);
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <UserRoutes />
      <RecruiterRoutes />
      <AdminRoutes />
    </BrowserRouter>
  )
}

export default App