import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'
import { defaultLexical } from '../fields/defaultLexical'

export const Project: CollectionConfig = {
  slug: 'projects',
  access: {
    create: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  defaultPopulate: {
    title: true,
    slug: true,
    heroImage: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title (e.g., "matilda-demo")',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main image shown on the homepage and at the top of the project page',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        description: 'When this project was published',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      admin: {
        description: 'Year of the project (for display purposes)',
      },
    },
    {
      name: 'newlyAdded',
      type: 'checkbox',
      label: 'Newly added?',
      required: false,
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Content Sections',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'textBody',
          type: 'textarea',
          required: true,
        },
        {
          name: 'media',
          type: 'array',
          label: 'Images & Videos',
          fields: [
            {
              name: 'mediaItem',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
              required: false,
            },
          ],
        },
      ],
    },
  ],
}
