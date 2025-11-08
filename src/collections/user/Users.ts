import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAsAdmin } from '@/collections/common/access/authenticated'
// Addresses are now their own collection; Users will reference addresses via relation fields

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailSubject: ({ user }) => {
        return `Verify your email - Alumni Hub`
      },
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to verify their account
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify?token=${token}`

        return `
          <!doctype html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to Alumni Hub!</h1>
                </div>
                <div class="content">
                  <h2>Hi ${user.name || user.email}!</h2>
                  <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
                  <p style="text-align: center;">
                    <a href="${url}" class="button">Verify Email Address</a>
                  </p>
                  <p>Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #667eea;">${url}</p>
                  <p class="footer">
                    If you didn't create an account, you can safely ignore this email.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `
      },
    },
    forgotPassword: {
      generateEmailHTML: ({ token } = {}) => {
        // Use the token provided to allow your user to reset their password
        // We will send them to the frontend NextJS app instead of sending
        // them to the Payload admin by default
        const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`;

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Hi there</h1>
              <p>Click below to reset your password.</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
            </body>
          </html>
        `;
      }
    },
  },
  access: {
    admin: ({ req: { user } }) => user?.role === 'admin',
    create: () => true,
    readVersions: () => true,
    read: authenticated,
    delete: ({ req: { user }, id }) => {
      if (user?.role?.match('admin')) {
        return true
      }
      // allow any other users to update only oneself
      return user?.id === id
    },
    update: ({ req: { user }, id }) => {
      if (user?.role?.match('admin')) {
        return true
      }
      // allow any other users to update only oneself
      return user?.id === id
    },
  },
  hooks: {
    afterChange: [
      async ({ req: { payload, user }, operation, doc }) => {
        if (operation === 'create') {
          await payload.sendEmail({
            to: user?.email
          })
        }
      }
    ]
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
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
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
                // readOnly: true,
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
        // Contact 
        {
          label: 'Contact',
          fields: [
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
                // readOnly: true,
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
        // Address
        {
          label: 'Address',
          fields: [
            {
              name: 'address',
              type: 'relationship',
              relationTo: 'address',
              admin: {
                description: 'Link to an address document that contains presentAddress and permanentAddress groups',
              },
            },
          ]
        },
      ],
    },
  ],

  timestamps: true,
}



