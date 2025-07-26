
import { Auth, Role } from "./auth.types";

export interface AuthLayoutProps {
  role?: Role;
  children: React.ReactNode;
  auth?:Auth
}

export interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  toggleable?: boolean; 
}


export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export interface SocialButtonProps {
  provider: 'github' | 'google';
  onClick: () => void;
}