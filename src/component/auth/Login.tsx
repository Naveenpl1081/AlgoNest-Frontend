import React from 'react'
import AuthLayouts from '../../layouts/AuthLayouts'
import LoginForm from './LoginForm'
import { LoginProps } from '../../types/auth.types'

const Login:React.FC<LoginProps> =({role,auth}) => {
  return (
    <div>
        <AuthLayouts role={role} auth={auth}>
            <LoginForm role={role}/>
        </AuthLayouts>
    </div>
  )
}

export default Login