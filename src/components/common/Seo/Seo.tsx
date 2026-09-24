import { useEffect } from 'react'

const SITE_NAME = 'microurl'
const DEFAULT_TITLE = `${SITE_NAME} · Short links you can track`
const DEFAULT_DESCRIPTION =
  'Turn long URLs into clean short links, protect them with a password or an expiry date, and see who clicks.'

interface SeoProps {
  /** Page title; the site name is added after it. */
  title?: string
  description?: string
  /** Pages behind a login should not show up in search results. */
  noIndex?: boolean
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/**
 * Updates the tags in <head> that index.html already has, instead of adding
 * duplicates, so search engines and link previews always see one title and
 * one description.
 */
export function Seo({ title, description = DEFAULT_DESCRIPTION, noIndex = false }: SeoProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : DEFAULT_TITLE
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, noIndex])

  return null
}
