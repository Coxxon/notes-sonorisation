import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.MobileOnly(Component.MobileMenu({ // Menu hamburger à gauche
      recentNotesTitle: "Fondamentaux",
      recentNotesLimit: 10,
      recentNotesFilter: (f: any) => f.frontmatter?.tags?.includes("fondamentaux") === true,
      recentNotesSort: (f1: any, f2: any) => (f1.frontmatter?.order ?? 100) - (f2.frontmatter?.order ?? 100),
      recentNotesShowTags: false,
    })),
    Component.MobileOnly(Component.Search()),   // Recherche à droite du menu hamburger
    Component.PageTitle(),                      // SYNTAX au centre
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
    // Sur Desktop, on garde le titre et les contrôles à gauche
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(
      Component.Flex({
        components: [
          {
            Component: Component.Search(),
            grow: true,
          },
          { Component: Component.Darkmode() },
          { Component: Component.ReaderMode() },
        ],
      })
    ),
    // Ces deux composants sont maintenant dans le menu hamburger sur mobile
    // mais restent dans la sidebar sur desktop
    Component.DesktopOnly(Component.RecentNotes({
      title: "Fondamentaux",
      limit: 10,
      filter: (f: any) => f.frontmatter?.tags?.includes("fondamentaux") === true,
      sort: (f1: any, f2: any) => (f1.frontmatter?.order ?? 100) - (f2.frontmatter?.order ?? 100),
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
          {
            Component: Component.Search(),
            grow: true,
          },
          { Component: Component.Darkmode() },
        ],
      })
    ),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}