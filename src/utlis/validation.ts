export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePassword = (password: string): boolean => {
  return !!password && password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return !!name && name.trim().length >= 2;
};