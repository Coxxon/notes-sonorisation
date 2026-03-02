import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.MobileOnly(Component.MobileMenu({ // Menu hamburger à gauche
      recentNotesTitle: "Fondamentaux",
      recentNotesLimit: 10,
      recentNotesFilter: (f: any) => Boolean(f.frontmatter?.tags?.includes("fondamentaux")),
      recentNotesSort: (f1: any, f2: any) => Number((f1.frontmatter?.order ?? 100)) - Number((f2.frontmatter?.order ?? 100)),
      recentNotesShowTags: false,
    })),
    Component.MobileOnly(Component.PageTitle()), // SYNTAX au centre (uniquement mobile)
    Component.MobileOnly(Component.Search()),   // Loupe à droite du titre
    Component.MobileOnly(Component.Darkmode()), // Darkmode à droite
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Me contacter par Email": "mailto:mail",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [],
  left: [
    // Sur Desktop, on garde tout comme avant
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(
      Component.Flex({
        components: [
          { Component: Component.Darkmode() },
        ],
      })
    ),
    // Ces composants restent sur desktop comme avant
    Component.DesktopOnly(Component.RecentNotes({
      title: "Fondamentaux",
      limit: 10,
      filter: (f) => f.frontmatter?.tags?.includes("fondamentaux"),
      sort: (f1, f2) => (f1.frontmatter?.order ?? 100) - (f2.frontmatter?.order ?? 100),
      showTags: false,
    })),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [
    Component.Graph({
      localGraph: { showTags: false },
      globalGraph: { showTags: false }
    }),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(
      Component.Flex({
        components: [
          { Component: Component.Darkmode() },
        ],
      })
    ),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}