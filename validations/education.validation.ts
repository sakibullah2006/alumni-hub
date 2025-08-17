import { z } from 'zod'

// =================================================================================
// 3. Education Schema and Types
// =================================================================================

export const educationSchema = z.object({
    educationId: z.string().startsWith('edu_', { message: "Invalid Education ID." }),
    userId: z.string().startsWith('user_', { message: "Invalid User ID." }),
    institutionName: z.string().min(3, { message: "Institution name is required." }),
    degree: z.string().min(2, { message: "Degree is required." }),
    fieldOfStudy: z.string().min(2, { message: "Field of study is required." }),

    // Storing dates as strings allows for flexible formats like "YYYY-MM".
    startDate: z.string().min(4, { message: "Start date is required." }),
    endDate: z.string().min(4, { message: "End date is required." }),

    grade: z.string().max(20, { message: "Grade is too long." }).optional(),
    description: z.string().max(500, { message: "Description cannot exceed 500 characters." }).optional(),
});

// Schema for the form when a user adds/edits their education.
export const educationFormSchema = educationSchema.omit({
    educationId: true,
    userId: true,
});

export type Education = z.infer<typeof educationSchema>;
export type EducationFormData = z.infer<typeof educationFormSchema>;
