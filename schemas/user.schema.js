import { z } from "zod";

const createUserSchema = z.object({
    fullName: z
        .string({
            required_error: "Full name is required",
            invalid_type_error: "Full name must be a string",
        })
        .min(3, { message: "Full name must be at least 3 characters long" })
        .max(50, { message: "Full name cannot exceed 50 characters" }),

    age: z
        .number({
            required_error: "Age is required",
            invalid_type_error: "Age must be a number",
        })
        .min(13, { message: "Age must be at least 13" })
        .max(120, { message: "Age cannot exceed 120" }),

    address: z
        .string({
            required_error: "Address is required",
            invalid_type_error: "Address must be a string",
        })
        .min(5, { message: "Address must be at least 5 characters long" })
        .max(255, { message: "Address cannot exceed 255 characters" }),

    phone: z
        .string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string",
        })
        .regex(/^\+?[0-9]{10,15}$/, {
            message: "Phone number must be valid (10 to 15 digits)",
        }),

    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
        .email({ message: "Invalid email address format" }),

    password: z
        .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        })
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
            {
                message:
                    "Password must include uppercase, lowercase, number, and special character",
            }
        )
});

module.exports = {
    createUserSchema,
};

