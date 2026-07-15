import dotenv from 'dotenv';

dotenv.config();

export interface BackendEnvConfig {
  PORT: number;
  NODE_ENV: string;
  GEMINI_API_KEY: string;
}

const parsePort = (portStr?: string): number => {
  const parsed = parseInt(portStr || '5001', 10);
  if (isNaN(parsed) || parsed <= 0 || parsed > 65535) {
    return 5001;
  }
  return parsed;
};

export const env: BackendEnvConfig = {
  PORT: parsePort(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'your_gemini_api_key_here'
};

export default env;
