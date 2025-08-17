import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { sheets } from "../../_lib/google/google.lib";
import { v4 as uuidv4 } from 'uuid';
import { EducationFormData, educationSchema } from "../../validations/education.validation";


const SHEET_NAME = 'education'

/**
 * Creates a new education record in the Google Sheet for the currently logged-in user.
 *
 * @param formData - The data submitted from the education form.
 * @returns An object indicating success or failure with a message.
 */
export async function createEducation(formData: EducationFormData) {
    try {
        // 1. Authenticate the user
        const { userId } = await auth();
        if (!userId) {
            throw new Error('You must be logged in to add education.');
        }

        // 2. Validate the incoming form data
        const validation = educationSchema.safeParse({
            ...formData,
            userId,
            educationId: `edu_${uuidv4()}`, // Generate a unique ID
        });

        if (!validation.success) {
            console.error('Validation failed:', validation.error.flatten().fieldErrors);
            return { success: false, message: 'Invalid data provided. Please check your entries.' };
        }

        const newEducation = validation.data;

        // 3. Define the header row to ensure correct column order
        const headerRow = [
            'educationId', 'userId', 'institutionName', 'degree',
            'fieldOfStudy', 'startDate', 'endDate', 'description', 'grade'
        ];

        // 4. Map the validated data object to an array
        const dataRow = headerRow.map(header => newEducation[header as keyof typeof newEducation] ?? '');

        // 5. Append the new row to the 'Educations' sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `${SHEET_NAME}!A1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [dataRow],
            },
        });

        // 6. Revalidate the profile page to show the new entry
        revalidatePath('/profile');

        return { success: true, message: 'Education added successfully.' };

    } catch (error) {
        console.error('Failed to create education:', error);
        return { success: false, message: 'An error occurred on the server.' };
    }
}

