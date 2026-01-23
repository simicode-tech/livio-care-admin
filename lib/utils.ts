import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const removeInitialsFromName = (name: string): string => {
  if (!name) return name;
  
  // Common titles and initials to remove
  const titlesAndInitials = [
    'mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'sir', 'madam', 'lord', 'lady',
    'jr', 'sr', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'
  ];
  
  // Split the name into words
  const words = name.trim().split(/\s+/);
  
  // Filter out titles, initials, and single letters
  const filteredWords = words.filter(word => {
    const cleanWord = word.toLowerCase().replace(/[.,]/g, ''); // Remove periods and commas
    
    // Remove if it's a known title/initial
    if (titlesAndInitials.includes(cleanWord)) {
      return false;
    }
    
    // Remove single letters (likely initials)
    if (cleanWord.length === 1) {
      return false;
    }
    
    // Remove words that are just periods or single letters with periods (like "J." or "A.")
    if (/^[a-z]\.?$/i.test(word)) {
      return false;
    }
    
    return true;
  });
  
  return filteredWords.join(' ').trim();
};
