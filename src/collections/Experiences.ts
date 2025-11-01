// src/payload/collections/Experiences.ts

import { CollectionConfig } from "payload"

export const Experiences: CollectionConfig = {
    slug: 'experiences',
    admin: {
        useAsTitle: 'jobTitle',
        defaultColumns: ['jobTitle', 'companyName', 'user'],
    },
    access: {
        // Publicly readable
        read: () => true,
        // Any logged-in user can create one
        create: ({ req }) => !!req.user,
        // Only the user who owns this entry or an admin can update/delete
        update: ({ req: { user }, data }) => {
            if (user?.role?.includes('admin')) {
                return true
            }
            return user?.id === data?.user.id
        },
        delete: ({ req: { user }, data }) => {
            if (user?.role?.includes('admin')) {
                return true
            }
            return user?.id === data?.user.id
        },
    },
    fields: [
        {
            name: 'jobTitle',
            type: 'text',
            required: true,
        },
        {
            name: 'companyName',
            type: 'text',
            required: true,
        },
        {
            name: 'location',
            type: 'text',
        },
        {
            name: 'startDate',
            type: 'date',
            required: true,
        },
        {
            name: 'endDate',
            type: 'date',
            label: 'End Date (Leave blank if current)',
        },
        {
            name: 'description',
            type: 'richText', // Use richText for bullet points, etc.
            label: 'Responsibilities & Achievements',
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            index: true,
            defaultValue: ({ user }) => user?.id,
            admin: {
                readOnly: true,
                position: 'sidebar',
            },
        },
    ],
}