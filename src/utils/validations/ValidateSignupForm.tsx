
import { SignupFormData } from "../../types/auth.types";

export const validateSignupForm = (formData: SignupFormData): Partial<SignupFormData> => {
  const newErrors: Partial<SignupFormData> = {};

  if (!formData.username.trim()) {
    newErrors.username = "Username is required";
  } else if (formData.username.length < 3) {
    newErrors.username = "Username must be at least 3 characters";
  } else if (/^[0-9\s]/.test(formData.username)) {
    newErrors.username = "Username cannot start with a number or space";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s.][\w.-]*@\w+\.\w+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email (should not start with dot)";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  } else if (!/[A-Z]/.test(formData.password)) {
    newErrors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(formData.password)) {
    newErrors.password = "Password must contain at least one lowercase letter";
  } else if (!/[0-9]/.test(formData.password)) {
    newErrors.password = "Password must contain at least one number";
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  return newErrors;
};
