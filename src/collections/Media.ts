// src/payload/collections/Media.ts

import { CollectionConfig } from "payload"
import { generateBlurPlaceholder } from "../hooks/media/generateBlurPlaceholder"

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: {
    afterChange: [generateBlurPlaceholder],
  },
  access: {
    // Anyone can read images
    read: () => true,
    // Logged-in users can create
    create: ({ req }) => !!req.user,
    // Only the user who uploaded it or an admin can update/delete
    update: ({ req, data }) => {
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
  admin: {
    useAsTitle: 'alt',
  },
  upload: {
    formatOptions: {
      format: "webp",
      options: {
        quality: 80,
      },
    },
    staticDir: 'media',
    adminThumbnail: 'profile',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      label: "Alt Text",
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
    {
      name: "blurDataURL",
      type: "text",
      label: "Blur Placeholder",
      admin: {
        description: "Base64 encoded blur placeholder (auto-generated)",
        readOnly: true,
        width: 40
      },
    },

  ],
}