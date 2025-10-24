import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAsAdmin } from '../access/authenticated'

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
    defaultColumns: ['name', 'email', 'role'],
  },
  fields: [],
  timestamps: true,
}



