import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAsAdmin } from '../access/authenticated'

export const Address: CollectionConfig = {
    slug: 'address',
    access: {
        read: authenticated,
        create: authenticatedAsAdmin,
        update: authenticated,
        delete: authenticatedAsAdmin,
    },
    admin: {
        defaultColumns: ['presentAddress.street', 'presentAddress.city', 'presentAddress.country'],
    },
    fields: [
        {
            name: 'presentAddress',
            type: 'group',
            label: 'Present Address',
            fields: [
                {
                    name: 'street',
                    type: 'text',
                },
                {
                    name: 'city',
                    type: 'text',
                },
                {
                    name: 'state',
                    type: 'text',
                },
                {
                    name: 'postalCode',
                    type: 'text',
                },
                {
                    name: 'country',
                    type: 'text',
                    required: true,
                },
            ],
        },
        {
            name: 'permanentAddress',
            type: 'group',
            label: 'Permanent Address',
            fields: [
                {
                    name: 'street',
                    type: 'text',
                },
                {
                    name: 'city',
                    type: 'text',
                },
                {
                    name: 'state',
                    type: 'text',
                },
                {
                    name: 'postalCode',
                    type: 'text',
                },
                {
                    name: 'country',
                    type: 'text',
                    required: true,
                },
            ],
        },
    ],
    timestamps: true,
}
