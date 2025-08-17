import { z } from 'zod'

// =================================================================================
// 1. User Schema and Types
// =================================================================================

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const userRoles = ['pending', 'member', 'admin'] as const;

export const userSchema = z.object({
    userId: z.string().startsWith('user_', { message: "Invalid User ID format." }),
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    profilePictureUrl: z.string().url().optional().or(z.literal('')),
    fbUrl: z.url({ message: "Please enter a valid Facebook URL." }).optional().or(z.literal('')),
    linkedInUrl: z.url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal('')),
    publicEmail: z.email({ message: "Please enter a valid email address." }),
    phoneNumber: z.string().min(10, { message: "Phone number seems too short." }).optional().or(z.literal('')),
    personalBio: z.string().max(500, { message: "Bio cannot exceed 500 characters." }).optional(),
    presentAddress: z.string().min(5, { message: "Please enter a valid address." }),
    presentCountry: z.string().min(2, { message: "Please enter a valid country." }),
    permanentAddress: z.string().min(5, { message: "Please enter a valid address." }),
    permanentCountry: z.string().min(2, { message: "Please enter a valid country." }),
    bloodGroup: z.enum(bloodGroups).optional(),
    role: z.enum(userRoles).default('pending'),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const profileFormSchema = userSchema.pick({
    firstName: true, lastName: true, profilePictureUrl: true, fbUrl: true,
    linkedInUrl: true, publicEmail: true, phoneNumber: true, personalBio: true,
    presentAddress: true, presentCountry: true, permanentAddress: true,
    permanentCountry: true, bloodGroup: true,
});

export type User = z.infer<typeof userSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;