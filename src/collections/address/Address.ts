import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAsAdmin } from '@/collections/common/access/authenticated'

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
                    label: 'Village/Road/Street'
                },
                {
                    name: 'city',
                    type: 'text',
                    label: 'City or District'
                },
                {
                    name: 'state',
                    type: 'text',
                    label: 'Division or State'
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
                    label: 'Village/Road/Street'
                },
                {
                    name: 'city',
                    type: 'text',
                    label: 'City or District'
                },
                {
                    name: 'state',
                    type: 'text',
                    label: 'Division or State'
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
