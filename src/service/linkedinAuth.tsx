class LinkedinAuthService {
    private clientId: string;
    private redirectUri: string;
    private scope: string;
  
    constructor() {
      this.clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID; 
      this.redirectUri = import.meta.env.VITE_LINKEDIN_REDIRECT_URI; 
      this.scope = 'openid profile email';
    }
  
    redirectToLinkedIn(): void {
      const state = this.generateRandomState();
      console.log("state",state)
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('linkedin_oauth_state', state);
      }
  
      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${this.clientId}&` +
        `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
        `state=${state}&` +
        `scope=${encodeURIComponent(this.scope)}`;
  
      if (typeof window !== 'undefined') {
        window.location.href = linkedinAuthUrl;
      }
    }
  
    private generateRandomState(): string {
      const array = new Uint8Array(16);
      if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(array);
      } else {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
      }
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
  
    verifyState(returnedState: string): boolean {
      if (typeof window === 'undefined') return false;
      
      const storedState = sessionStorage.getItem('linkedin_oauth_state');
      sessionStorage.removeItem('linkedin_oauth_state');
      
      return storedState === returnedState;
    }
  }
  
  export const linkedinAuthService = new LinkedinAuthService()