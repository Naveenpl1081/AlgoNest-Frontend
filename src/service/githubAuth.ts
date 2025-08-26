export class GitHubAuthService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    
    this.clientId = import.meta.env.VITE_REACT_APP_GITHUB_CLIENT_ID || '';
    this.redirectUri = `${window.location.origin}/auth/github/callback`;
  }

  redirectToGitHub(): void {
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user:email%20read:user`;
    window.location.href = githubUrl;
  }
}
  
  export const githubAuthService = new GitHubAuthService();