import { Auth, Role } from "./auth.types";

export interface AuthLayoutProps {
  role?: Role;
  children: React.ReactNode;
  auth?: Auth;
}

export interface UserLayoutProps {
  children: React.ReactNode;
}
export interface RecruiterLayoutProps {
  children: React.ReactNode;
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
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export interface SocialButtonProps {
  provider: "github" | "google";
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
  key: keyof T | "action" | "serial" |"viewDetails" |"problem";
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface Example {
  input: string;
  output: string;
  explanation: string;
}

export interface TestCase {
  input: string[];
  output: string;
}

export interface Parameter {
  name: string;
  type: string;
}

export interface IProblem {
  _id:string
  problemId: string;
  title: string;
  description: string;
  difficulty: string; 
  tags: string[];
  category: {
    _id: string;
    name: string;
  };
  constraints: string[];
  examples: Example[];
  testCases: TestCase[];
  functionName: string; 
  parameters: Parameter[]; 
  returnType: string;
  status: "Active" | "InActive";
  timeLimit:string;
  memoryLimit:string;
  solution: string;
  starterCode: { [key: string]: string };
  hints: string[];
  createdBy: string;
  isPremium: boolean;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface GetProblemsParams {
  page?: number;
  limit?: number;
  difficulty?: string;
  category?: string;
  tags?: string[];
  visible?: boolean;
  search?: string;
}

export interface GetProblemsResponse {
  success: boolean;
  data?: {
    problems: IProblem[];
    total: number;
    currentPage: number;
    totalPages: number;
  };
  message?: string;
}

export interface ProblemDetailsProps {
  problemData: IProblem | null;
  loading: boolean;
  problemId?:string
}

export interface CompilerComponentProps {
  problemData: IProblem | null;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>; 
  onRunCode: (code: string, problemId: string, language: string) => Promise<void>;
  onSubmitCode: (code: string, problemId: string, language: string) => Promise<void>;
  loading: boolean;
}

export interface RunDocument extends Document {
  userId: string;
  problemId: string;
  language: string;
  code: string;
  testResults: Array<{
    caseNumber: number;
    input: string;
    output: string;
    expected: string;
    passed: boolean;
    error?: string;
    executionTime?: number;
    memoryUsed?: number;
  }>;
  overallStatus: 'passed' | 'failed' | 'error';
  createdAt: Date;
}


export interface TestResult {
  caseNumber: number;
  input: string;
  output: string;
  expected: string;
  passed: boolean;
  status?: 'accepted' | 'wrong_answer' | 'timeout' | 'memory_exceeded' | 'runtime_error' | 'system_error' | 'network_error' | 'execution_error' | 'rejected';
  executionTime?: number;
  memoryUsed?: number;
  error?: string;
  consoleOutput?: string;
}

export interface ResultComponentProps {
  testResults: TestResult[];
  loading: boolean;
  overallStatus: 'passed' | 'failed' | 'error' | null;
  error: string | null;
  consoleOutput: string | null;
}