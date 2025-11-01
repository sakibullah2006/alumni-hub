// src/payload/collections/Blogs.ts

import { Block, CollectionConfig, slugField } from "payload"

// Let's define our content blocks first
const RichTextBlock: Block = {
    slug: 'richText',
    labels: {
        singular: 'Rich Text Block',
        plural: 'Rich Text Blocks',
    },
    fields: [
        {
            name: 'content',
            type: 'richText',
        },
    ],
}

const ImageBlock: Block = {
    slug: 'image',
    labels: {
        singular: 'Image',
        plural: 'Images',
    },
    fields: [
        {
            name: 'image',
            type: 'relationship',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'caption',
            type: 'text',
        },
    ],
}

const CodeBlock: Block = {
    slug: 'code',
    labels: {
        singular: 'Code Block',
        plural: 'Code Blocks',
    },
    fields: [
        {
            name: 'code',
            type: 'code',
            required: true,
        },
        {
            name: 'language',
            type: 'select',
            options: [
                { label: 'JavaScript', value: 'javascript' },
                { label: 'TypeScript', value: 'typescript' },
                { label: 'Python', value: 'python' },
                { label: 'Go', value: 'go' },
                { label: 'HTML', value: 'html' },
                { label: 'CSS', value: 'css' },
                { label: 'JSON', value: 'json' },
            ],
            defaultValue: 'javascript',
        },
    ],
}

// Now, the main collection
export const Blogs: CollectionConfig = {
    slug: 'blogs',
    // Enable versioning for drafts and auto-save
    versions: {
        drafts: {
            autosave: true,
        },
        maxPerDoc: 10
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'author', 'publishedDate'],
        listSearchableFields: ['title', 'excerpt'],
        // This enables the "Preview" button in the admin panel
        // It assumes your frontend route is /blog/[slug]
        preview: doc => {
            const slug = doc.slug
            // Use process.env.NEXT_PUBLIC_SERVER_URL or a static URL
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

            // Return the URL for the preview
            // The query params are hints for your Next.js page to fetch the draft
            return `${baseUrl}/blog/${slug}?preview=true`
        },
    },
    access: {
        // --- Your Requirement ---
        // Only admins can create, update, delete
        create: ({ req: { user } }) => !!user?.role?.match('admin'),
        update: ({ req: { user } }) => !!user?.role?.match('admin'),
        delete: ({ req: { user } }) => !!user?.role?.match('admin'),

        // --- Public Access ---
        // This is the key:
        // 1. Admins can read everything (including drafts)
        // 2. The public can only read 'published' posts
        read: ({ req: { user } }) => {
            // If user is admin, allow read
            if (user?.role?.match('admin')) {
                return true
            }

            // If user is not admin, only allow read access to 'published' documents
            return {
                status: {
                    equals: 'published',
                },
            }
        },
        // This allows unauthenticated users to read published posts
        readVersions: ({ req: { user } }) => !!user?.role?.match('admin'),
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                // Tab 1: Content
                {
                    label: 'Content',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                        },
                        // The Block-based content editor
                        {
                            name: 'content',
                            label: 'Post Content',
                            type: 'blocks',
                            blocks: [RichTextBlock, ImageBlock, CodeBlock],
                        },
                        {
                            name: 'excerpt',
                            type: 'textarea',
                            maxLength: 200,
                            admin: {
                                description: 'A short summary used for list pages and SEO.',
                            },
                        },
                    ],
                },
                // Tab 2: SEO
                {
                    label: 'SEO',
                    fields: [
                        {
                            name: 'seo',
                            type: 'group',
                            fields: [
                                {
                                    name: 'metaTitle',
                                    type: 'text',
                                    admin: {
                                        description: 'If blank, defaults to post title.',
                                    },
                                },
                                {
                                    name: 'metaDescription',
                                    type: 'textarea',
                                    admin: {
                                        description: 'If blank, defaults to post excerpt.',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        // --- Sidebar Fields ---
        slugField({ fieldToUse: 'title' }), // Our reusable slug field, based on 'title'
        {
            name: 'status',
            type: 'select',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
            ],
            defaultValue: 'draft',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'publishedDate',
            type: 'date',
            admin: {
                position: 'sidebar',
                description: 'Defaults to creation date. You can future-date posts.',
            },
            defaultValue: () => new Date(),
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            // Default to the logged-in user
            defaultValue: ({ user }) => user?.id,
            admin: {
                position: 'sidebar',
                readOnly: true, // Don't let them change the author easily
            },
        },
        {
            name: 'featuredImage',
            type: 'relationship',
            relationTo: 'media',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: {
                position: 'sidebar',
            },
        },
    ],
}