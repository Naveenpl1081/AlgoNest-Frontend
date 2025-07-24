export type Role = "USER" | "ADMIN" | "RECRUITER";
export type UserLikeRoles = Extract<Role, "USER" | "RECRUITER">;
export type Auth = "Signup" | "Login"

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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
}

export interface LoginProps {
  role: Role;
  auth:Auth
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  role: Role;
  onSubmit?: (data: LoginFormData) => Promise<void>;
}