import { getPayload } from '@/lib/payload'
import { notFound } from 'next/navigation'
import { PayloadImage } from '@/components/payload/PayloadImage'
import { RichText } from '@/components/payload/RichText'
import type { Blog, Media, User } from '@/payload-types'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Block content renderers
function RichTextBlockRenderer({ content }: any) {
  if (!content) {
    console.warn('RichTextBlockRenderer: No content provided')
    return null
  }
  
  return (
    <div className="my-6">
      <RichText content={content} />
    </div>
  )
}

function ImageBlockRenderer({ block }: any) {
  const image = block.image as Media
  if (!image) return null

  return (
    <figure className="my-8 ">
      <PayloadImage
        image={image}
        alt={block.caption || ''}
        className="w-full h-auto rounded-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
      {block.caption && (
        <figcaption className="text-center text-sm text-gray-600 mt-2">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

function CodeBlockRenderer({ block }: any) {
  if (!block || !block.code) {
    console.warn('CodeBlockRenderer: No code content provided')
    return null
  }
  
  return (
    <div className="my-6 relative">
      <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
        <code className={`language-${block.language || 'text'}`}>{block.code}</code>
      </pre>
    </div>
  )
}

function BlockRenderer({ block }: any) {
  switch (block.blockType) {
    case 'richText':
      return <RichTextBlockRenderer content={block.content} />
    case 'image':
      return <ImageBlockRenderer block={block} />
    case 'code':
      return <CodeBlockRenderer block={block} />
    default:
      return null
  }
}

async function BlogPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload()

  try {
    // Fetch the blog post by slug
    const result = await payload.find({
      collection: 'blogs',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'published',
        }
      },
      depth: 2, // Fetch related data (author, featured image, categories, tags)
    })

    const blog = result.docs[0] as Blog | undefined

    if (!blog) {
      notFound()
    }

    const author = blog.author as User
    const featuredImage = blog.featuredImage as Media

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 ">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-[32px] sm:text-[40px] font-bold mb-3 leading-tight tracking-tight">{blog.title}</h1>
        
        {blog.excerpt && (
          <p className="text-lg text-neutral-400 leading-normal font-light font-source mb-2">{blog.excerpt}</p>
        )}

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-6 pb-6 border-b border-gray-200">
          {author && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">By</span>
              <span className="font-medium text-neutral-800">{author.name}</span>
            </div>
          )}
          {blog.publishedDate && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time className="text-gray-600">
                {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          )}
          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium uppercase tracking-wide">
            {blog.status}
          </span>
        </div>

        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Array.isArray(blog.categories) && blog.categories.length > 0 && (
            <div className="flex gap-2">
              {blog.categories.map((cat: any) => (
                <span
                  key={typeof cat === 'string' ? cat : cat.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {typeof cat === 'string' ? cat : cat.name}
                </span>
              ))}
            </div>
          )}
          {Array.isArray(blog.tags) && blog.tags.length > 0 && (
            <div className="flex gap-2">
              {blog.tags.map((tag: any) => (
                <span
                  key={typeof tag === 'string' ? tag : tag.id}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Featured Image */}
        {featuredImage && (
          <div className="mb-8 flex justify-center">
            <PayloadImage
              image={featuredImage}
              alt={blog.title}
              priority
              className="w-full h-auto rounded-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="max-w-none">
        {Array.isArray(blog.content) && blog.content.length > 0 ? (
          blog.content.map((block: any, index: number) => (
            <BlockRenderer key={block.id || index} block={block} />
          ))
        ) : (
          <p className="text-gray-500">No content available</p>
        )}
      </div>
    </article>
  ) 
  } catch (error) {
    console.error('Error loading blog post:', error)
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog Post</h1>
        <p className="text-gray-600">
          There was an error loading this blog post. The content may be corrupted or improperly formatted.
        </p>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    )
  }
}

export default BlogPage

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  const payload = await getPayload()
  
  const blogs = await payload.find({
    collection: 'blogs',
    where: {
      status: {
        equals: 'published',
      },
    },
    limit: 100,
  })

  return blogs.docs.map((blog) => ({
    slug: blog.slug as string,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'blogs',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const blog = result.docs[0] as Blog | undefined

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  return {
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
  }
}
