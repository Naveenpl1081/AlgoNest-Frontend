import Cookies from "js-cookie"
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

 export const UserPublicRoutes = () => {
    const accessToken = Cookies.get("user_access_token");
    if(accessToken){
        return <Navigate to="/user/home"/>
    }
    return <Outlet/>
}
