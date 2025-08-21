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

