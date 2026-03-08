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
    // Ligne de recherche retirée d'ici pour aller dans le MobileMenu
    Component.MobileOnly(Component.PageTitle()), // NODE au centre (uniquement mobile)
    Component.MobileOnly(Component.Darkmode()), // Darkmode à droite
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Me contacter par mail": "mailto:allan.leguyader.pro@gmail.com",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [],
  left: [
    // Sur Desktop, on garde tout comme avant
    // Commande Center (Sticky)
    Component.DesktopOnly(
      Component.Flex({
        direction: "column",
        components: [
          { Component: Component.PageTitle(), align: "start" },
          {
            Component: Component.Flex({
              direction: "row",
              gap: "1.45rem",
              components: [
                { Component: Component.Search(), grow: true, align: "center", justify: "start" },
                { Component: Component.Darkmode(), align: "center" },
                { Component: Component.ReaderMode(), align: "center" },
              ],
            }),
          },
        ],
      })
    ),
    Component.DesktopOnly(
      Component.Graph({
        localGraph: {
          showTags: false,
          depth: 1,
          focusOnHover: true,
          repelForce: 0.8,
          centerForce: 0.3,
          linkDistance: 40,
          fontSize: 0.5,
          opacityScale: 1,
          scale: 1.2,
        },
        globalGraph: { showTags: false }
      })
    ),
    // Ces composants restent sur desktop comme avant
    Component.DesktopOnly(Component.RecentNotes({
      title: "Fondamentaux",
      limit: 10,
      filter: (f) => f.frontmatter?.tags?.includes("fondamentaux") === true,
      sort: (f1, f2) => (Number(f1.frontmatter?.order) ?? 100) - (Number(f2.frontmatter?.order) ?? 100),
      showTags: false,
    })),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [],
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
  ],
  right: [],
}