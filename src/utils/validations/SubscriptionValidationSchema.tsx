import * as Yup from "yup";

export const subscriptionValidationSchema = Yup.object({
  planName: Yup.string()
    .trim()
    .required("Plan name is required")
    .matches(/^[A-Z0-9 ]+$/, "Plan name must be uppercase letters or numbers")
    .min(3, "Plan name must be at least 3 characters long")
    .max(30, "Plan name cannot exceed 30 characters"),

  price: Yup.number()
    .typeError("Price must be a valid number")
    .required("Price is required")
    .positive("Price must be greater than zero")
    .max(999999, "Price cannot exceed ₹9,99,999"),

  durationInMonths: Yup.number()
    .typeError("Duration must be a valid number")
    .required("Duration is required")
    .positive("Duration must be greater than zero")
    .integer("Duration must be a whole number")
    .max(36, "Duration cannot exceed 36 months"),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description cannot exceed 200 characters"),
});
