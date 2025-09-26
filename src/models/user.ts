export interface IUser {
  _id: string;
  username: string;
  email: string;
  status: "Active" | "InActive";
  createdAt: string;
}

export interface IUserStats {
  problemsSolved: number;
  acceptanceRate: number;
  currentStreak: number;
  totalSubmissions: number;
  totalProblems: number;
  attempting: number;
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
  recentSubmissions: IRecentSubmission[];
}

export interface IRecentSubmission {
  problemId: string;
  problemTitle?: string;
  difficulty?: string;
  overallStatus: string;
  createdAt: Date;
}