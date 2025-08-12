import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import RecruiterRoutes from './routes/RecruiterRoutes'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AdminRoutes from './routes/AdminRoutes';


const App:React.FC = () => {
  return (
   <BrowserRouter>
   <ToastContainer position="top-right" autoClose={3000} />
   <UserRoutes/>
   <RecruiterRoutes/>
   <AdminRoutes/>
   </BrowserRouter>
  )
}

export default App