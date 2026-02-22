export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const strongPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

export const getInitials = (name: string) => {
  if (!name) return "";

  const words = name.trim().split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};
