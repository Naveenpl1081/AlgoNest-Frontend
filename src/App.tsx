import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


const App:React.FC = () => {
  return (
   <BrowserRouter>
   <ToastContainer position="top-right" autoClose={3000} />
   <UserRoutes/>
   </BrowserRouter>
  )
}

export default App