import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define the formatDate util
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Determine if the app is running on the deployed domain
export const isProduction = () => {
  return window.location.hostname !== 'localhost' && 
         window.location.hostname !== '127.0.0.1';
};

// Get appropriate GitHub auth redirect URL
export const getGitHubRedirectUrl = () => {
  const baseUrl = window.location.origin;
  
  // Use different callback paths based on production vs development
  if (isProduction()) {
    // For deployed site, specify the auth/callback path
    return `${baseUrl}/auth/callback`;
  } else {
    // For local development, use the standard callback path
    return `${baseUrl}/auth/callback`;
  }
};
