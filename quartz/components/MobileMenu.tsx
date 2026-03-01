import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { resolveRelative } from "../util/path"
import style from "./styles/explorer.scss"
import { concatenateResources } from "../util/resources"

// @ts-ignore
import script from "./scripts/explorer.inline"
import OverflowListFactory from "./OverflowList"
import { FileTrieNode } from "../util/fileTrie"

// Importer les options par défaut de l'Explorer
type OrderEntries = "sort" | "filter" | "map"

export interface Options {
  title?: string
  folderDefaultState: "collapsed" | "open"
  folderClickBehavior: "collapse" | "link"
  useSavedState: boolean
  sortFn: (a: FileTrieNode, b: FileTrieNode) => number
  filterFn: (node: FileTrieNode) => boolean
  mapFn: (node: FileTrieNode) => void
  order: OrderEntries[]
  recentNotesTitle?: string
  recentNotesLimit: number
  recentNotesFilter: (f: any) => boolean
  recentNotesSort: (f1: any, f2: any) => number
  recentNotesShowTags: boolean
}

const defaultOptions: Options = {
  folderDefaultState: "collapsed",
  folderClickBehavior: "link",
  useSavedState: true,
  mapFn: (node) => node,
  sortFn: (a, b) => {
    if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }
    if (!a.isFolder && b.isFolder) {
      return 1
    } else {
      return -1
    }
  },
  filterFn: (node) => node.slugSegment !== "tags",
  order: ["filter", "map", "sort"],
  recentNotesTitle: "Fondamentaux",
  recentNotesLimit: 10,
  recentNotesFilter: (f) => f.frontmatter?.tags?.includes("fondamentaux") === true,
  recentNotesSort: (f1, f2) => (f1.frontmatter?.order ?? 100) - (f2.frontmatter?.order ?? 100),
  recentNotesShowTags: false,
}

let numMobileMenus = 0
export default ((userOpts?: Partial<Options>) => {
  const opts: Options = { ...defaultOptions, ...userOpts }
  const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory()

  const MobileMenu: QuartzComponent = ({ cfg, displayClass, allFiles, fileData }: QuartzComponentProps) => {
    const id = `mobile-menu-${numMobileMenus++}`

    // Filtrer et trier les notes récentes (Fondamentaux)
    const recentPages = allFiles.filter(opts.recentNotesFilter).sort(opts.recentNotesSort)

    return (
      <div class={classNames(displayClass, "mobile-menu")}>
        <button
          type="button"
          class="mobile-menu-toggle"
          data-mobile={true}
          aria-controls={id}
          aria-expanded={false}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        
        <div id={id} class="mobile-menu-content" aria-expanded={false} role="group">
          {/* Section FONDAMENTAUX */}
          <div class="mobile-menu-section">
            <h3 class="mobile-menu-section-title">{opts.recentNotesTitle}</h3>
            <ul class="mobile-menu-recent-notes">
              {recentPages.slice(0, opts.recentNotesLimit).map((page) => {
                const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
                
                return (
                  <li class="mobile-menu-recent-item">
                    <div class="mobile-menu-recent-container">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="3" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        class="mobile-menu-bullet"
                      >
                        <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/>
                      </svg>
                      <a href={resolveRelative(fileData.slug!, page.slug!)} class="mobile-menu-recent-link">
                        {title}
                      </a>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Section Explorateur */}
          <div class="mobile-menu-section">
            <h3 class="mobile-menu-section-title">Explorateur</h3>
            <div
              class="explorer"
              data-behavior={opts.folderClickBehavior}
              data-collapsed={opts.folderDefaultState}
              data-savestate={opts.useSavedState}
              data-data-fns={JSON.stringify({
                order: opts.order,
                sortFn: opts.sortFn.toString(),
                filterFn: opts.filterFn.toString(),
                mapFn: opts.mapFn.toString(),
              })}
            >
              <OverflowList class="explorer-ul mobile-explorer-ul" />
            </div>
          </div>
        </div>

        {/* Templates pour l'explorateur */}
        <template id="template-file">
          <li>
            <a href="#"></a>
          </li>
        </template>
        <template id="template-folder">
          <li>
            <div class="folder-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="5 8 14 8"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="folder-icon"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <div>
                <button class="folder-button">
                  <span class="folder-title"></span>
                </button>
              </div>
            </div>
            <div class="folder-outer">
              <ul class="content"></ul>
            </div>
          </li>
        </template>
      </div>
    )
  }

  MobileMenu.css = style + `
    .mobile-menu {
      position: relative;
    }

    .mobile-menu-toggle {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .mobile-menu-toggle:hover {
      background-color: var(--lightgray);
    }

    .mobile-menu-content {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      background: var(--light);
      border: 1px solid var(--lightgray);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 280px;
      max-width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
      display: none;
      margin-top: 8px;
    }

    .mobile-menu-content[aria-expanded="true"] {
      display: block;
    }

    .mobile-menu-section {
      padding: 1rem;
      border-bottom: 1px solid var(--lightgray);
    }

    .mobile-menu-section:last-child {
      border-bottom: none;
    }

    .mobile-menu-section-title {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 500;
      color: var(--dark);
      margin: 0 0 0.75rem 0;
    }

    .mobile-menu-recent-notes {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .mobile-menu-recent-item {
      margin-bottom: 0.5rem;
    }

    .mobile-menu-recent-container {
      display: flex;
      align-items: flex-start;
      transition: transform 0.2s ease-out;
    }

    .mobile-menu-recent-container:hover {
      transform: translateX(2px);
    }

    .mobile-menu-bullet {
      color: var(--secondary);
      margin-right: 8px;
      flex-shrink: 0;
      margin-top: 3px;
    }

    .mobile-menu-recent-link {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--dark);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .mobile-menu-recent-link:hover {
      color: var(--secondary);
    }

    .mobile-explorer-ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .mobile-explorer-ul li {
      padding: 0.25rem 0;
    }

    .mobile-explorer-ul a {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 0.9rem;
      color: var(--dark);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .mobile-explorer-ul a:hover {
      color: var(--secondary);
    }

    .folder-container {
      display: flex;
      align-items: center;
      padding: 0.25rem 0;
    }

    .folder-button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 0.9rem;
      color: var(--dark);
      text-align: left;
    }

    .folder-icon {
      margin-right: 8px;
      color: var(--secondary);
    }

    /* Mode sombre */
    @media (prefers-color-scheme: dark) {
      .mobile-menu-content {
        background: var(--dark);
        border-color: var(--darkgray);
      }

      .mobile-menu-section-title {
        color: var(--light);
      }

      .mobile-menu-recent-link {
        color: var(--light);
      }

      .mobile-explorer-ul a {
        color: var(--light);
      }

      .folder-button {
        color: var(--light);
      }
    }
  `

  MobileMenu.afterDOMLoaded = concatenateResources(
    `
    // Script pour gérer l'ouverture/fermeture du menu mobile
    document.addEventListener('click', function(e) {
      const toggle = e.target.closest('.mobile-menu-toggle');
      const content = e.target.closest('.mobile-menu-content');
      
      if (toggle) {
        const menuId = toggle.getAttribute('aria-controls');
        const menuContent = document.getElementById(menuId);
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        toggle.setAttribute('aria-expanded', !isExpanded);
        menuContent.setAttribute('aria-expanded', !isExpanded);
        
        // Fermer les autres menus
        document.querySelectorAll('.mobile-menu-toggle').forEach(otherToggle => {
          if (otherToggle !== toggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
            const otherId = otherToggle.getAttribute('aria-controls');
            const otherContent = document.getElementById(otherId);
            if (otherContent) {
              otherContent.setAttribute('aria-expanded', 'false');
            }
          }
        });
      } else if (!content) {
        // Fermer tous les menus si on clique ailleurs
        document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
          const menuId = toggle.getAttribute('aria-controls');
          const menuContent = document.getElementById(menuId);
          if (menuContent) {
            menuContent.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
    `,
    overflowListAfterDOMLoaded
  )

  return MobileMenu
}) satisfies QuartzComponentConstructor
