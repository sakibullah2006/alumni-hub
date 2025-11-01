import { CollectionConfig, slugField } from "payload";

export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: 'name',
        listSearchableFields: ['name'],
        hidden: ({ user }) => !user?.role?.match('admin'), // Only admins see this in nav
    },
    access: {
        // Admins can do everything
        create: ({ req: { user } }) => !!user?.role?.match('admin'),
        read: () => true, // Everyone can read categories
        update: ({ req: { user } }) => !!user?.role?.match('admin'),
        delete: ({ req: { user } }) => !!user?.role?.match('admin'),
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            index: true,
        },
        slugField({ fieldToUse: 'name' }),
    ],
}