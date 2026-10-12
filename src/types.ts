export interface Photo {
  /** Unique, URL-safe id. Used in the lightbox link (/?photo=<id>). */
  id: string
  /** File name inside public/photos/large and public/photos/thumb. */
  file: string
  title: string
  /** Alt text for screen readers. Falls back to title. */
  alt?: string
  /** Pixel size of the large file. Optional: measured in the browser if missing. */
  width?: number
  height?: number
}

export interface NavItem {
  label: string
  to: string
}

export interface SocialLink {
  label: string
  url: string
}

export interface SiteData {
  name: string
  tagline: string
  /** Path (inside public/) of a logo image shown instead of the name. Optional. */
  logo?: string
  /** 'left' = logo left, menu right (default). 'center' = logo centred, menu underneath. */
  headerLayout?: 'left' | 'center'
  nav: NavItem[]
  social: SocialLink[]
  statement: string
  statementLink: string
  about: {
    title: string
    paragraphs: string[]
    portrait: string
    portraitAlt: string
  }
  contact: {
    title: string
    intro: string
    email: string
  }
  footer: string
}
