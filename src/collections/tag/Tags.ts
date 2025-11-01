import { CollectionConfig, slugField } from "payload";

export const Tags: CollectionConfig = {
    slug: 'tags',
    admin: {
        useAsTitle: 'name',
        listSearchableFields: ['name'],
        hidden: ({ user }) => !user?.role?.match('admin'),
    },
    access: {
        // Admins can do everything
        create: ({ req: { user } }) => !!user?.role?.match('admin'),
        read: () => true,
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