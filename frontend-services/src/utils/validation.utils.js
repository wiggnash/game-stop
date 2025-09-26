export const determineLoginType = (identifier) => {
  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;

  if (emailRegex.test(identifier)) {
    return "email";
  } else if (phoneRegex.test(identifier)) {
    return "phone";
  } else {
    throw new Error(
      "Invalid identifier format. Please enter a valid email or phone number.",
    );
  }
};

export const isValidEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};
