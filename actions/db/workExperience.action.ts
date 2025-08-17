'use server';

import { auth } from "@clerk/nextjs/server";
import { WorkExperienceFormData, workExperienceSchema } from "../../validations/workExperience.validation";
import { revalidatePath, revalidateTag } from "next/cache";
import { sheets } from "../../_lib/google/google.lib";
import { v4 as uuidv4 } from 'uuid';


/**
 * Creates a new work experience record in the Google Sheet for the currently logged-in user.
 *
 * @param formData - The data submitted from the work experience form.
 * @returns An object indicating success or failure with a message.
 */
export async function createWorkExperience(formData: WorkExperienceFormData) {
    try {
        // 1. Authenticate the user
        const { userId } = await auth();
        if (!userId) {
            throw new Error('You must be logged in to add work experience.');
        }

        // 2. Validate the incoming form data
        const validation = workExperienceSchema.safeParse({
            ...formData,
            userId, // Add server-side data to the object for validation
            experienceId: `exp_${uuidv4()}`, // Generate a unique ID
        });

        if (!validation.success) {
            console.error('Validation failed:', validation.error.flatten().fieldErrors);
            return { success: false, message: 'Invalid data provided. Please check your entries.' };
        }

        const newExperience = validation.data;

        // 3. Define the header row to ensure correct column order
        const headerRow = [
            'experienceId', 'userId', 'companyName', 'companyAddress',
            'position', 'startDate', 'endDate', 'description'
        ];

        // 4. Map the validated data object to an array
        const dataRow = headerRow.map(header => newExperience[header as keyof typeof newExperience] ?? '');

        // 5. Append the new row to the 'WorkExperience' sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'WorkExperience!A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [dataRow],
            },
        });

        // 6. Revalidate the profile page to show the new entry
        revalidatePath('/profile');
        revalidateTag('workExperience')

        return { success: true, message: 'Work experience added successfully.' };

    } catch (error) {
        console.error('Failed to create work experience:', error);
        return { success: false, message: 'An error occurred on the server.' };
    }
}
