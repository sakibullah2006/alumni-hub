// app/_actions/users.ts
'use server';

import { revalidatePath } from 'next/cache';
import { User, userSchema } from '../../validations/users.validation';
import { sheets } from '../../_lib/google/google.lib';

// Define the name of the sheet we're working with
const SHEET_NAME = 'users';

/**
 * Creates a new user record in the Google Sheet.
 * This function is designed to be called when an admin approves a new user.
 *
 * @param userData - An object containing the initial user data.
 * At a minimum, it should include `userId`, `publicEmail`,
 * and a `role` of 'member'.
 * @returns An object indicating success or failure.
 */
export async function createUser(userData: {
    userId: string;
    publicEmail: string;

    role: 'member';
}) {
    try {
        const now = new Date();

        // 1. Prepare the full user object with default values
        // This ensures that all columns in our sheet are populated correctly.
        const newUser: User = {
            userId: userData.userId,
            publicEmail: userData.publicEmail,
            role: userData.role,

            // Set sensible defaults for all other required fields
            firstName: 'New',
            lastName: 'User',
            profilePictureUrl: '',
            fbUrl: '',
            linkedInUrl: '',
            phoneNumber: '',
            personalBio: '',
            presentAddress: 'Not Set',
            presentCountry: 'Not Set',
            permanentAddress: 'Not Set',
            permanentCountry: 'Not Set',
            bloodGroup: undefined, // Or a default value if you prefer

            // Set timestamps
            createdAt: now,
            updatedAt: now,
        };

        // 2. Validate the data against our Zod schema
        // This is a critical step to ensure data integrity before sending it to the sheet.
        const validation = userSchema.safeParse(newUser);

        if (!validation.success) {
            // Log the detailed error for debugging
            console.error('Validation failed:', validation.error.flatten().fieldErrors);
            throw new Error('User data validation failed.');
        }

        const validatedData = validation.data;

        // 3. Define the header row to ensure the data is mapped correctly.
        // This MUST match the order of columns in your 'Users' Google Sheet.
        const headerRow = [
            'userId', 'firstName', 'lastName', 'profilePictureUrl', 'publicEmail',
            'phoneNumber', 'fbUrl', 'linkedInUrl', 'personalBio', 'presentAddress',
            'presentCountry', 'permanentAddress', 'permanentCountry', 'createdAt',
            'updatedAt', 'bloodGroup', 'role'
        ];

        // 4. Map the validated data object to an array in the same order as the headers.
        const dataRow = headerRow.map(header => {
            const value = validatedData[header as keyof User];
            // Format Date objects to ISO strings for consistent storage
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value ?? ''; // Use empty string for undefined/null values
        });

        // 5. Append the new row to the Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `${SHEET_NAME}!A1`, // Append to the 'Users' sheet
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [dataRow],
            },
        });

        // 6. Revalidate caches for pages that display user data
        // This tells Next.js to fetch fresh data for the admin page.
        revalidatePath('/admin');

        return { success: true, message: 'User created successfully.' };

    } catch (error) {
        console.error('Failed to create user:', error);
        // Return a generic error message to the client for security
        return { success: false, message: 'An error occurred while creating the user.' };
    }
}


/**
 * Fetches a list of all users from the Google Sheet.
 *
 * @param {object} [options] - Optional parameters.
 * @param {number} [options.limit] - The maximum number of users to retrieve.
 * @returns {Promise<User[]>} A promise that resolves to an array of validated user objects.
 */
export async function getUsers(options: { limit?: number } = {}): Promise<User[]> {
    const { limit } = options;

    try {
        // 1. Fetch the raw data from the Google Sheet.
        // The first row is the header, and subsequent rows are user data.
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            // Fetch the header row + all user data. We'll slice it later if a limit is set.
            range: `${SHEET_NAME}!A1:Q`, // A to Q covers all columns in your user model
        });

        const rows = response.data.values;

        if (!rows || rows.length <= 1) {
            // No data found after the header row
            return [];
        }

        // 2. Extract the header row and the data rows.
        const header = rows[0] as (keyof User)[];
        let dataRows = rows.slice(1);

        // 3. Apply the limit if it was provided.
        if (limit && limit > 0) {
            dataRows = dataRows.slice(0, limit);
        }

        // 4. Map the raw array data to structured objects and validate.
        const users: User[] = dataRows.map((row, rowIndex) => {
            // Create an object from the header and row arrays
            const userObject = header.reduce((obj, key, index) => {
                obj[key] = row[index] || undefined; // Use undefined for empty cells
                return obj;
            }, {} as { [key in keyof User]: any });

            try {
                // 5. Use Zod to parse and validate each user object.
                // This is crucial for type safety and data integrity.
                // It will automatically convert string dates to Date objects, etc.
                return userSchema.parse(userObject);
            } catch (error) {
                // Log a detailed error if a specific row fails validation
                console.error(`Validation failed for user at row ${rowIndex + 2}:`, error);
                // Depending on your needs, you could return null and filter later,
                // or throw an error to fail the whole operation.
                // For now, we'll skip the invalid row.
                return null;
            }
        }).filter((user): user is User => user !== null); // Filter out any nulls from parsing errors

        return users;

    } catch (error) {
        console.error('Failed to fetch users from Google Sheet:', error);
        return [];
    }
}