export interface FrontendEnvConfig {
  VITE_API_URL: string;
}

const getApiUrl = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_URL) {
      return (import.meta as any).env.VITE_API_URL;
    }
  } catch (e) {
    // Fallback if import.meta not available during tests or SSR
  }
  return 'http://localhost:5001/api';
};

export const env: FrontendEnvConfig = {
  VITE_API_URL: getApiUrl()
};

export default env;
