export interface IRecruiter {
    _id: string;
    username: string;
    email: string;
    status: "Active" | "InActive" | "pending";
    isVerified?: boolean;
    emailVerify?: boolean;
    companyName?: string;
    companyType?: string;
    yearEstablished?: string;
    phone?: number;
    registrationCertificate?: string;
    createdAt: string;
  }

  export interface JobPost {
    jobrole: string;
    jobLocation: string;
    workTime: string;
    workMode: string;
    minExperience: string;
    minSalary: string;
    maxSalary: string;
    requirements: string[]; 
    responsibilities: string[]; 
   
  }
  
 
  export interface JobPostFormData {
    role: string;
    workTime: string;
    workMode: string;
    jobLocation: string;
    minExperience: string;
    minSalary: string;
    maxSalary: string;
    requirements: string[];
    responsibilities: string[];
 
  }
  
  export interface ApiError {
    response?: {
      data: any;
      status: number;
      statusText: string;
    };
    message: string;
  }
  
  export interface SubmitStatus {
    type: 'success' | 'error';
    message: string;
  }


  export interface Job {
    _id: string;
    jobrole: string;
    workTime: string;
    workMode: string;
    jobLocation: string;
    minExperience: string;
    minSalary: string;
    maxSalary: string;
    status: string;
    requirements: string[];
    responsibilities: string[];
  }