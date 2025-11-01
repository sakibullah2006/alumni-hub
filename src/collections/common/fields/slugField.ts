// This is a helper function to create a slug field

import { Field } from "payload"
import { formatSlug } from "../utils/formatSlug"

// 'fieldToUse' is the name of the field to base the slug on (e.g., 'title')
export const slugField = (fieldToUse: string): Field => ({
    name: 'slug',
    label: 'Slug',
    type: 'text',
    index: true,
    unique: true,
    admin: {
        position: 'sidebar',
        description: 'A unique identifier for the URL. Will be auto-generated if left blank.',
    },
    hooks: {
        beforeValidate: [
            async ({ value, data, operation }) => {
                // Only auto-generate if the value is empty or on create
                if (!value || operation === 'create') {
                    return formatSlug(data![fieldToUse])
                }
                // If user provided a slug, format it
                return formatSlug(value)
            },
        ],
    },
})