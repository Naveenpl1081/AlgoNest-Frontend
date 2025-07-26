export type Role = "USER" | "ADMIN" | "RECRUITER";
export type UserLikeRoles = Extract<Role, "USER" | "RECRUITER">;
export type Auth = "Signup" | "Login" | "forgot password"

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface LginFormData {
  email:string;
  password:string
}

export interface SignupFormProps {
  role: UserLikeRoles;
  onSubmit?: (data: SignupFormData) => Promise<void>;
}

export interface SignupProps {
  role: UserLikeRoles;
  auth:Auth;
  onSubmit?: (data: SignupFormData) => Promise<void>;
}
export interface OtpProps {
  role: UserLikeRoles;
  auth: Auth;
  onSubmit?: (otp: string) => Promise<void>; 
  onResend?:()=>Promise<void>
}

export interface LoginProps {
  role: Role;
  auth:Auth;
  onSubmit?:(data:LoginFormData)=>Promise<void>
}




export interface ResetProps {
  role: Role;
  auth: Auth;
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
}

export interface ForgotProps {
  role: Role;
  auth: Auth;
  onSubmit: (email: string) => Promise<void>;
}


export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  role: Role;
  onSubmit?: (data: LoginFormData) => Promise<void>;
}