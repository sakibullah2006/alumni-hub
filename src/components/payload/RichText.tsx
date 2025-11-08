import React from 'react'
import { PayloadImage } from './PayloadImage'
import type { Media } from '@/payload-types'

interface RichTextProps {
  content: any
  className?: string
}

export function RichText({ content, className = '' }: RichTextProps) {
  if (!content) return null

  // Parse content if it's a JSON string
  let parsedContent = content
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content)
    } catch (error) {
      console.error('Failed to parse RichText content:', error)
      return <p className="text-red-500">Error: Invalid content format</p>
    }
  }

  const serializeLexical = (node: any): React.ReactNode => {
    if (!node) return null

    // Handle text nodes
    if (node.type === 'text') {
      let text: React.ReactNode = node.text

      // Apply formatting
      if (node.format) {
        if (node.format & 1) text = <strong className="font-bold">{text}</strong> // Bold
        if (node.format & 2) text = <em className="italic">{text}</em> // Italic
        if (node.format & 8) text = <code className="bg-neutral-100 text-red-600 px-1.5 py-0.5 rounded text-[16px] font-mono">{text}</code> // Code
        if (node.format & 4) text = <s className="line-through">{text}</s> // Strikethrough
        if (node.format & 16) text = <u className="underline decoration-1">{text}</u> // Underline
      }

      return text
    }

    const children = node.children
      ? node.children.map((child: any, index: number) => (
          <React.Fragment key={index}>{serializeLexical(child)}</React.Fragment>
        ))
      : null

    // Handle different node types
    switch (node.type) {
      case 'root':
        return <>{children}</>

      case 'paragraph':
        return <p className="mb-7 leading-[1.75] text-[19px] sm:text-[20px] text-neutral-700 font-serif font-normal">{children}</p>

      case 'heading':
        const tag = node.tag || 'h2'
        const headingStyles: Record<string, string> = {
          h1: 'text-[32px] sm:text-[36px] leading-[1.25] font-bold mb-5 mt-12 text-neutral-800 ',
          h2: 'text-[28px] sm:text-[30px] leading-[1.3] font-bold mb-4 mt-10 text-neutral-800 ',
          h3: 'text-[24px] sm:text-[26px] leading-[1.35] font-bold mb-3 mt-8 text-neutral-800 ',
          h4: 'text-[21px] sm:text-[22px] leading-[1.4] font-semibold mb-3 mt-7 text-neutral-800 ',
          h5: 'text-[19px] sm:text-[20px] leading-[1.45] font-semibold mb-2 mt-6 text-neutral-800 ',
          h6: 'text-[18px] leading-[1.5] font-semibold mb-2 mt-5 text-neutral-800 font-serif',
        }
        return React.createElement(tag, { className: headingStyles[tag] || headingStyles.h2 }, children)

      case 'list':
        const listType = node.listType === 'bullet' ? 'ul' : 'ol'
        const listClass = listType === 'ul' 
          ? 'list-disc mb-7 ml-6 space-y-2 marker:text-neutral-400' 
          : 'list-decimal mb-7 ml-6 space-y-2 marker:text-neutral-400'
        return React.createElement(listType, { className: listClass }, children)

      case 'listitem':
        return <li className="text-neutral-700 leading-[1.75] text-[19px] sm:text-[20px] pl-2 font-serif font-normal">{children}</li>

      case 'quote':
        return (
          <blockquote className="border-l-[3px] border-neutral-500 pl-5 py-2 mb-7 italic text-[18px] sm:text-[20px] leading-normal text-neutral-600 font-serif font-normal bg-neutral-100">
            {children}
          </blockquote>
        )

      case 'link':
        return (
          <a
            href={node.fields?.url || node.url || '#'}
            target={node.fields?.newTab ? '_blank' : undefined}
            rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
            className="text-neutral-700 underline decoration-1 hover:text-neutral-900 transition-colors"
          >
            {children}
          </a>
        )

      case 'linebreak':
        return <br />

      case 'horizontalrule':
        return <hr className="my-10 border-t border-neutral-200" />

      case 'upload':
        // Handle uploaded images in rich text
        const uploadValue = node.value as Media
        if (!uploadValue || typeof uploadValue !== 'object') return null
        
        return (
          <figure className="my-8">
            <PayloadImage
              image={uploadValue}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 680px"
            />
            {uploadValue.alt && (
              <figcaption className="text-center text-[14px] text-neutral-500 mt-2 font-sans">
                {uploadValue.alt}
              </figcaption>
            )}
          </figure>
        )

      default:
        return <>{children}</>
    }
  }

  return (
    <div className={`rich-text ${className}`}>
      {serializeLexical(parsedContent.root || parsedContent)}
    </div>
  )
}
