declare module "*.scss" {
  const content: string
  export = content
}

// dom custom event
interface CustomEventMap {
  prenav: CustomEvent<{}>
  nav: CustomEvent<{ url: FullSlug }>
  themechange: CustomEvent<{ theme: "light" | "dark" }>
  readermodechange: CustomEvent<{ mode: "default" | "light" | "full" }>
}

type ContentIndex = Record<FullSlug, ContentDetails>
declare const fetchData: Promise<ContentIndex>
