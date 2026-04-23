import crypto from 'crypto'
export function normalize ( val:any) {
 if (typeof val !== "string") return val;

 const trimmed = val.trim()

 if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
        const parsed = JSON.parse(trimmed.replace(/'/g,'"'));
        return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
        return val;
    }
  
 }
   return val;
}

