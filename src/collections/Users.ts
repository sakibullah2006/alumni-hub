import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAsAdmin } from '../access/authenticated'
// Addresses are now their own collection; Users will reference addresses via relation fields

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticatedAsAdmin,
    create: authenticatedAsAdmin,
    readVersions: authenticatedAsAdmin,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'name',
      'email',
      'role'
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // Profile Data
        {
          label: 'Profile',
          fields: [
            {
              name: 'profilePicture',
              type: 'relationship',
              relationTo: 'media',
              admin: {
                readOnly: true,
                position: 'sidebar',
              },
            },
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'bio',
              type: 'textarea',
            },
            {
              name: 'dskmPassingYear',
              type: 'number',
              label: 'Graduation Year at DSKM',
              admin: {
                description: 'e.g., 2020',
              },
            },
            {
              name: 'major',
              type: 'text',
              label: 'Major or Field of Study',
            },
          ],
        },
        // Contact & Location
        {
          label: 'Contact',
          fields: [
            {
              name: 'address',
              type: 'relationship',
              relationTo: 'address',
              admin: {
                description: 'Link to an address document that contains presentAddress and permanentAddress groups',
              },
            },
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Your Contact email',
              admin: {
                // readOnly: true,
                position: 'sidebar',
              },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Your Personal Phone Number',
              admin: {
                readOnly: true,
                position: 'sidebar',
              },
            },
            {
              name: 'linkedInUrl',
              type: 'text',
              label: 'LinkedIn Profile URL',
            },
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'FaceBook Profile URL',
            },
            {
              name: 'websiteUrl',
              type: 'text',
              label: 'Personal Website URL',
            },
          ],
        },
      ],
    },
  ],

  timestamps: true,
}



