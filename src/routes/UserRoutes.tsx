import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserSignup from '../pages/user/auth/UserSignup'
import UserLogin from '../pages/user/auth/UserLogin'
import UserOtp from '../pages/user/auth/UserOtp'
import AlgoNestLanding from '../pages/AlgoNestLanding'
import UserHomePage from "../pages/user/userpages/UserHomePage"
import UserForgotPassword from '../pages/user/auth/UserForgotPassword'
import UserResetPassword from '../pages/user/auth/UserResetPassword'
import { UserPublicRoutes } from './PublicRoutes'
import { UserPrivateRoutes } from './PrivateRoutes'
import UserProfilePage from '../pages/user/userpages/UserProfilePage'
import GitHubCallback from '../component/auth/GitHubCallback'
import LinkedinCallback from '../component/auth/LinkedInCallback'
import SingleProblemPage from '../pages/user/userpages/SingleProblemPage'

const UserRoutes = () => {
  return (
    <Routes>
        <Route element={<UserPublicRoutes/>}>
            <Route  path='/user/signup' element={<UserSignup/>}/>
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/otp" element={<UserOtp />} />
            <Route path="/" element={<AlgoNestLanding />} />
            <Route path="/user/forgot-password" element={<UserForgotPassword />} />
            <Route path='/user/reset-password' element={<UserResetPassword/>}/>
            <Route path="/auth/github/callback" element={<GitHubCallback/>}/>
            <Route path="/auth/linkedin/callback" element={<LinkedinCallback />} />
        </Route>


        <Route element={<UserPrivateRoutes/>}>
        <Route path="/user/home" element={<UserHomePage/>} />
        <Route path='/user/profile' element={<UserProfilePage/>}/>
        <Route path="/user/singleproblem/:problemId" element={<SingleProblemPage/>}/>
        </Route>
        
    </Routes>
  )
}

export default UserRoutes

