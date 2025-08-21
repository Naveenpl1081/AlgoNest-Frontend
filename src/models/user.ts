export interface IUser {
    _id: string;
    username: string;
    email: string;
    status: "Active" | "InActive";
    createdAt: string;
  }

