import { CollectionConfig } from "payload"
import { authenticated } from "@/access/authenticated"

export const Educations: CollectionConfig = {
    slug: 'educations',
    admin: {
        useAsTitle: 'id',
        defaultColumns: ['id', 'institutionName', 'degree', 'user'],
    },
    access: {
        // Publicly readable
        read: authenticated,
        // Any logged-in user can create one
        create: authenticated,
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
            name: 'institutionName',
            type: 'text',
            label: "Name Of Institute",
            required: true,
        },
        {
            name: 'degree',
            type: 'text',
            required: true,
            label: 'Degree (e.g., B.Sc, B.A, M.A.)',
        },
        {
            name: 'fieldOfStudy',
            type: 'text',
            required: true,
            label: 'Field of Study (e.g., Computer Science)',
        },
        {
            name: 'result',
            type: 'group',
            label: 'Result',
            admin: {
                condition: (data) => !data.isOngoing,
            },
            fields: [
                {
                    name: 'gradeType',
                    type: 'select',
                    label: 'Grade Type',
                    options: [
                        { label: 'GPA', value: 'gpa' },
                        { label: 'CGPA', value: 'cgpa' },
                        { label: 'Percentage', value: 'percentage' },
                    ],
                },
                {
                    name: 'grade',
                    type: 'number',
                    label: 'Grade',
                },
                {
                    name: 'scale',
                    type: 'number',
                    label: 'Scale (e.g., 4.0, 10.0)',
                },
            ],
        },
        {
            name: 'startDate',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'monthOnly',
                    displayFormat: 'yyyy'
                },
            },
        },
        {
            name: 'isOngoing',
            type: 'checkbox',
            label: 'Currently Ongoing',
            defaultValue: false,
        },
        {
            name: 'endDate',
            type: 'date',
            label: 'End Date (or Expected)',
            admin: {
                date: {
                    pickerAppearance: 'monthOnly',
                    displayFormat: 'yyyy'
                },
                condition: (data) => !data.isOngoing,
            },
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Activities & Notes',
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            index: true, // Improves query performance
            // Automatically associate the logged-in user when creating
            defaultValue: ({ user }) => user?.id,
            admin: {
                readOnly: true,
                position: 'sidebar',
                description: 'This education entry belongs to this user.',
            },
        },
    ],
}