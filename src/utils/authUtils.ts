import Cookies from "js-cookie";

export const authUtils = {
 
  clearAuthData: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    
    localStorage.clear();
    sessionStorage.clear();
  },


  isAuthenticated: () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    return !!(accessToken || refreshToken);
  },

 
  redirectToLogin: () => {
    authUtils.clearAuthData();
    window.location.href = "/user/login";
  },

  
  setTokens: (accessToken: string, refreshToken?: string) => {
    const inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
    Cookies.set("access_token", accessToken, {
      expires: inOneHour,
    });
    
    if (refreshToken) {
      const inThreeDays = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
      Cookies.set("refresh_token", refreshToken, {
        expires: inThreeDays,
      });
    }
  }
};