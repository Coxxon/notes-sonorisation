import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.MobileOnly(Component.Search()), // Loupe à gauche
    Component.PageTitle(),                    // SYNTAX au centre (géré par CSS)
    Component.MobileOnly(Component.Darkmode()), // Darkmode à droite
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Me contacter par Email": "mailto:tonmail",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [],
  left: [
    // Sur Desktop, PageTitle s'affiche ici. Sur mobile, il est déjà dans le header.
    Component.DesktopOnly(Component.PageTitle()), 
    Component.MobileOnly(Component.Spacer()),
    
    // Bloc de recherche et modes uniquement pour le Desktop à gauche
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

    // Menu Hamburger : Fondamentaux + Explorer
    // Ces composants sont dans 'left', donc Quartz les met dans le hamburger sur mobile
    Component.RecentNotes({
      title: "Fondamentaux",
      limit: 10,
      filter: (f) => f.frontmatter?.tags?.includes("fondamentaux") === true,
      sort: (f1, f2) => (f1.frontmatter?.order ?? 100) - (f2.frontmatter?.order ?? 100),
      showTags: false,
    }),
    Component.Explorer(),
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
    Component.MobileOnly(Component.Spacer()),
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
    Component.Explorer(),
  ],
  right: [],
}