
import { Auth, Role } from "./auth.types";

export interface AuthLayoutProps {
  role?: Role;
  children: React.ReactNode;
  auth?:Auth
}

export interface UserLayoutProps{
  children:React.ReactNode
}
export interface RecruiterLayoutProps{
  children:React.ReactNode
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

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  loading?: boolean;
  pageSize?: number;
}
export interface Column<T> {
  key: keyof T | "action" | "serial";
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
}