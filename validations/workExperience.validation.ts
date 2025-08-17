import { z } from 'zod'

// =================================================================================
// 2. Work Experience Schema and Types
// =================================================================================

export const workExperienceSchema = z.object({
    experienceId: z.string().startsWith('exp_', { message: "Invalid Experience ID." }),
    userId: z.string().startsWith('user_', { message: "Invalid User ID." }),
    companyName: z.string().min(2, { message: "Company name is required." }),
    companyAddress: z.string().min(5, { message: "Company address is required." }),
    position: z.string().min(2, { message: "Position is required." }),

    // Storing dates as strings allows for flexible formats like "YYYY-MM" or "Present".
    startDate: z.string().min(4, { message: "Start date is required." }),
    endDate: z.string().min(4, { message: "End date is required." }),

    description: z.string().max(500, { message: "Description cannot exceed 500 characters." }).optional(),
});

// Schema for the form when a user adds/edits a work experience.
// We omit IDs because they are handled by the system, not the user.
export const workExperienceFormSchema = workExperienceSchema.omit({
    experienceId: true,
    userId: true,
});

export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type WorkExperienceFormData = z.infer<typeof workExperienceFormSchema>;