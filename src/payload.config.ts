// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/user/Users'
import { plugins } from './plugins'
import { Experiences } from './collections/experience/Experiences'
import { Media } from './collections/media/Media'
import { Address } from './collections/address/Address'
import { Educations } from './collections/education/Educations'
import { Blogs } from './collections/blog/Blogs'
import { Categories } from './collections/category/Categories'
import { Tags } from './collections/tag/Tags'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Address,
    Educations,
    Experiences,
    Blogs,
    Categories,
    Tags,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET as string,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
      // url: process.env.TURSO_DATABASE_URL || '',
      // authToken: process.env.TURSO_AUTH_TOKEN || ''
    },
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  sharp,
  upload: {
    limits: {
      fileSize: 1000000 // 1MB
    }
  },
  plugins: [
    ...plugins
    // storage-adapter-placeholder
  ],
})
