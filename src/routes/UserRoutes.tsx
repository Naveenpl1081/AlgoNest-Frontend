import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserSignup from '../pages/user/auth/UserSignup'
import UserLogin from '../pages/user/auth/UserLogin'
import UserOtp from '../pages/user/auth/UserOtp'
import AlgoNestLanding from '../pages/AlgoNestLanding'

const UserRoutes = () => {
  return (
    <Routes>
        <Route>
            <Route  path='/user/signup' element={<UserSignup/>}/>
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/otp" element={<UserOtp />} />
            <Route path="/" element={<AlgoNestLanding />} />

        </Route>
    </Routes>
  )
}

export default UserRoutes