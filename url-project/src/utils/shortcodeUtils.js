export const generateShortCode = (existingCodes = []) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    const length = 6;
  
    do {
      code = "";
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (existingCodes.includes(code));
  
    return code;
  };
  