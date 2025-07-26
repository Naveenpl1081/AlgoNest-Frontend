import React from 'react'
import AuthLayouts from '../../layouts/AuthLayouts'
import LoginForm from './LoginForm'
import { LoginProps } from '../../types/auth.types'

const Login:React.FC<LoginProps> =({role,auth,onSubmit}) => {
  return (
    <div>
        <AuthLayouts role={role} auth={auth}>
            <LoginForm role={role} onSubmit={onSubmit}/>
        </AuthLayouts>
    </div>
  )
}

export default Login