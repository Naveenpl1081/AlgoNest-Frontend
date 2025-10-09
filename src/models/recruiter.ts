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

  export interface IJobApplicationPayload {
    jobId: string;
    name: string;
    email: string;
    contactNo: string;
    location: string;
    education: {
      highestQualification: string;
      qualificationName: string;
      institutionName: string;
      yearOfGraduation: string;
      cgpa: string;
    };
    workExperience?: {
      totalExperience?: string;
      previousJobTitles?: string;
      companyNames?: string;
    };
    skills: string[];
    links?: {
      githubProfile?: string;
      linkedinProfile?: string;
      personalWebsite?: string;
    };
    documents: {
      resume: File;  // Changed from string to File
      plusTwoCertificate?: File;  // Changed from string to File
      degreeCertificate?: File;   // Changed from string to File
      pgCertificate?: File;       // Changed from string to File
    };
    aboutYourself: string;
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
    recruiterId: {
      userName: string;
      companyName: string;
      companyType: string;
    };
  }

  
  // export interface IJobApplication {
  //   _id: string;
  //   jobId: string;
  //   userId: string;
  //   recruiterId: string;
  //   name: string;
  //   email: string;
  //   contactNo: string;
  //   location: string;
  //   education: {
  //     highestQualification: string;
  //     qualificationName: string;
  //     institutionName: string;
  //     yearOfGraduation: string;
  //     cgpa: string;
  //   };
  //   workExperience: {
  //     totalExperience?: string;
  //     previousJobTitles?: string;
  //     companyNames?: string;
  //   };
  //   skills: string[];
  //   links: {
  //     githubProfile?: string;
  //     linkedinProfile?: string;
  //     personalWebsite?: string;
  //   };
  //   documents: {
  //     resume: string;
  //     plusTwoCertificate?: string;
  //     degreeCertificate?: string;
  //     pgCertificate?: string;
  //   };
  //   aboutYourself: string;
  //   status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  //   appliedAt: Date;
  //   createdAt?: Date;
  //   updatedAt?: Date;
  // }

  // Base interface - before population
export interface IJobApplication {
  _id: string;
  jobId: string;
  userId: string;
  recruiterId: string;
  name: string;
  email: string;
  contactNo: string;
  location: string;
  education: {
    highestQualification: string;
    qualificationName: string;
    institutionName: string;
    yearOfGraduation: string;
    cgpa: string;
  };
  workExperience: {
    totalExperience?: string;
    previousJobTitles?: string;
    companyNames?: string;
  };
  skills: string[];
  links: {
    githubProfile?: string;
    linkedinProfile?: string;
    personalWebsite?: string;
  };
  documents: {
    resume: string;
    plusTwoCertificate?: string;
    degreeCertificate?: string;
    pgCertificate?: string;
  };
  aboutYourself: string;
  status: "pending" | "scheduled" | "shortlisted" | "rejected" | "accepted";
  appliedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Populated interface - after population
export interface IPopulatedJobApplication extends Omit<IJobApplication, 'jobId' | 'userId'> {
  jobId: {
    _id: string;
   jobrole:string
  };
  userId: {
    _id: string;
    username: string;
    email: string;
  };
}