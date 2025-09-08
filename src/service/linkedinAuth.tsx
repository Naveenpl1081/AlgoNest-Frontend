class LinkedinAuthService {
  private clientId: string;
  private redirectUri: string;
  private scope: string;

  constructor() {
    this.clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '';

    this.redirectUri = import.meta.env.VITE_LINKEDIN_REDIRECT_URI || `${window.location.origin}/auth/linkedin/callback`;
    
    this.scope = "openid profile email";
    
    console.log('LinkedIn Config:', {
      clientId: this.clientId,
      redirectUri: this.redirectUri,
      scope: this.scope
    });

 
    if (!this.clientId) {
      console.error('LinkedIn Client ID is missing from environment variables');
    }
  }

  redirectToLinkedIn(): void {
    if (!this.clientId) {
      console.error('Cannot redirect: LinkedIn Client ID is not configured');
      return;
    }

    const state = this.generateRandomState();
    console.log("Generated state:", state);
    
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem('linkedin_oauth_state', state);
        console.log("State stored in sessionStorage");
      } catch (error) {
        console.error("Failed to store state in sessionStorage:", error);
      }
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: state,
      scope: this.scope
    });

    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    console.log("Full LinkedIn URL:", linkedinAuthUrl);
    
    if (typeof window !== 'undefined') {
      window.location.href = linkedinAuthUrl;
    }
  }

  private generateRandomState(): string {
    const array = new Uint8Array(32); 
    
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
     
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  verifyState(returnedState: string): boolean {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      console.warn('SessionStorage not available for state verification');
      return false;
    }

    if (!returnedState) {
      console.error('No state parameter returned from LinkedIn');
      return false;
    }

    try {
      const storedState = sessionStorage.getItem('linkedin_oauth_state');
      console.log("State verification:", { 
        stored: storedState ? storedState.substring(0, 8) + '...' : 'null', 
        returned: returnedState.substring(0, 8) + '...',
        match: storedState === returnedState 
      });
      
     
      sessionStorage.removeItem('linkedin_oauth_state');
      
      return storedState === returnedState;
    } catch (error) {
      console.error('Error during state verification:', error);
      return false;
    }
  }

  
  getRedirectUri(): string {
    return this.redirectUri;
  }


  isConfigured(): boolean {
    return !!this.clientId;
  }
}

export const linkedinAuthService = new LinkedinAuthService();