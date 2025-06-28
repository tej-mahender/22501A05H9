export const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };
  
  export const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);
  