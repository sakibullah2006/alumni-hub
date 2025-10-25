// src/payload/collections/Media.ts

import { CollectionConfig } from "payload"

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Anyone can read images
    read: () => true,
    // Logged-in users can create
    create: ({ req }) => !!req.user,
    // Only the user who uploaded it or an admin can update/delete
    update: ({ req }) => {
      if (req.user?.role?.match('admin')) {
        return true
      }
      return req.user?.id === req.data?.user?.id
    },
    delete: ({ req }) => {
      if (req.user?.role?.match('admin')) {
        return true
      }
      return req.user?.id === req.data?.user?.id
    },
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
        fit: 'cover'
      },
      {
        name: 'profile',
        width: 800,
        height: 800,
        position: 'centre',
        fit: 'contain'
      },
    ],
    adminThumbnail: 'profile',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      // Automatically set the user on upload
      defaultValue: ({ user }) => user?.id,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}