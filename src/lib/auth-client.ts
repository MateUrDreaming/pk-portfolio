import { nextCookies } from 'better-auth/next-js'
import { createAuthClient } from 'better-auth/react'
import {inferAdditionalFields} from 'better-auth/client/plugins'
import { auth } from './auth'

const getClientBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isDevelopment) {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }
  
  if (isProduction) {
    return process.env.NEXT_PUBLIC_BASE_URL || 
           (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://yourdomain.com');
  }
  
  return 'https://parinkasabia.com'; 
};

export const authClient = createAuthClient({ 
    baseURL: getClientBaseURL(),
    
    plugins: [
        inferAdditionalFields<typeof auth>(),
        nextCookies()
    ],
})