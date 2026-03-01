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
          title="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide-menu"
            fill="none"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span class="mobile-menu-label">Menu</span>
        </button>
        
        {/* Overlay sombre */}
        <div class="mobile-menu-overlay" id={`${id}-overlay`}></div>
        
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
      border: 1px solid var(--lightgray);
      padding: 6px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s ease;
      gap: 6px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--dark);
      white-space: nowrap;
    }

    .mobile-menu-toggle:hover {
      background-color: var(--lightgray);
      border-color: var(--secondary);
      transform: translateY(-1px);
    }

    .mobile-menu-toggle:active {
      transform: translateY(0);
    }

    .mobile-menu-label {
      display: none; /* Masqué par défaut, visible en mode horizontal */
    }

    .mobile-menu-toggle svg {
      color: var(--dark);
      transition: color 0.2s ease;
      stroke: var(--dark); /* Force la couleur du stroke pour les SVG */
    }

    .mobile-menu-toggle:hover svg {
      color: var(--secondary);
      stroke: var(--secondary);
    }

    /* Correction pour le composant Search dans le header mobile */
    header .search {
      min-width: auto !important;
      max-width: none !important;
      flex-grow: 0 !important;
      margin: 0 !important;
      display: flex !important;
    }

    header .search .search-button {
      background-color: transparent !important;
      border: 1px solid var(--lightgray) !important;
      border-radius: 6px !important;
      height: 2.5rem !important;
      padding: 0 12px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      width: auto !important;
      min-width: 44px !important;
    }

    header .search .search-button svg {
      width: 18px !important;
      height: 18px !important;
      min-width: 18px !important;
      margin: 0 !important;
      display: block !important;
    }

    header .search .search-button p {
      display: none !important; /* Masquer le texte "Search" sur mobile */
    }

    /* FORCER l'affichage de la recherche sur mobile */
    @media (max-width: 767px) {
      header .search {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    }

    /* Overlay sombre quand le menu est ouvert */
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .mobile-menu-overlay.active {
      display: block;
      opacity: 1;
    }

    .mobile-menu-content {
      position: fixed;
      top: 0;
      left: -300px; /* Commence hors de l'écran à gauche */
      width: 280px;
      height: 100vh;
      z-index: 1000;
      background: var(--light);
      border-right: 1px solid var(--lightgray);
      box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .mobile-menu-content[aria-expanded="true"] {
      left: 0; /* Glisse vers la droite */
    }

    .mobile-menu-section {
      padding: 1rem;
      border-bottom: 1px solid var(--lightgray);
      flex-shrink: 0;
    }

    .mobile-menu-section:last-child {
      border-bottom: none;
      flex: 1;
      overflow-y: auto;
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
      stroke: var(--secondary); /* Force la couleur du stroke */
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
      stroke: var(--secondary); /* Force la couleur du stroke */
    }

    /* Mode horizontal - utilise le même menu coulissant que le mode vertical */
    @media (min-width: 768px) {
      .mobile-menu-toggle {
        padding: 8px 16px;
      }
      
      .mobile-menu-label {
        display: inline; /* Affiche le libellé "Menu" en horizontal */
      }

      /* En mode horizontal, on garde le menu coulissant mais avec plus de largeur */
      .mobile-menu-content {
        width: 350px; /* Plus large en horizontal */
        left: -350px; /* Commence plus loin à gauche */
      }

      .mobile-menu-content[aria-expanded="true"] {
        left: 0; /* Glisse vers la droite */
      }

      .mobile-menu-overlay {
        display: block !important; /* On garde l'overlay en horizontal aussi */
      }

      /* Afficher le texte "Search" en horizontal */
      header .search .search-button p {
        display: inline !important;
        margin-left: 8px !important;
      }
    }

    /* Mode sombre */
    @media (prefers-color-scheme: dark) {
      .mobile-menu-toggle {
        border-color: var(--darkgray);
        color: var(--light);
      }

      .mobile-menu-content {
        background: var(--dark);
        border-right-color: var(--darkgray);
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

      .mobile-menu-toggle svg {
        color: var(--light);
        stroke: var(--light);
      }

      .mobile-menu-bullet {
        color: var(--secondary);
        stroke: var(--secondary);
      }

      .folder-icon {
        color: var(--secondary);
        stroke: var(--secondary);
      }

      /* Correction pour le mode horizontal en dark */
      @media (min-width: 768px) {
        .mobile-menu-content {
          border-color: var(--darkgray);
        }
      }
    }

    /* Amélioration pour mobile en mode paysage */
    @media (orientation: landscape) and (max-height: 600px) {
      .mobile-menu-content {
        max-height: 60vh;
      }
    }

    /* Corrections globales pour les SVG - PLUS SPÉCIFIQUES */
    svg {
      transition: color 0.2s ease, stroke 0.2s ease, fill 0.2s ease;
      background: transparent !important;
    }

    /* Éviter les fonds blancs sur les SVG en mode sombre */
    @media (prefers-color-scheme: dark) {
      /* CORRECTION AGRESSIVE pour tous les SVG */
      svg {
        background: transparent !important;
        fill: none !important;
        stroke: var(--light) !important;
      }

      /* Correction spécifique pour le composant Search */
      header .search .search-button svg .search-path {
        stroke: var(--light) !important;
        fill: none !important;
        background: transparent !important;
      }
      
      header .search .search-button:hover svg .search-path {
        stroke: var(--secondary) !important;
        fill: none !important;
      }

      /* SVG avec fill spécifique */
      svg[fill]:not([fill="none"]):not(.lucide-menu):not(.mobile-menu-bullet):not(.folder-icon) {
        fill: var(--light) !important;
        stroke: var(--light) !important;
      }
      
      /* SVG avec stroke spécifique */
      svg[stroke]:not([stroke="none"]):not(.lucide-menu):not(.mobile-menu-bullet):not(.folder-icon) {
        stroke: var(--light) !important;
        fill: none !important;
      }

      /* Exceptions pour les SVG qui doivent garder leurs couleurs */
      svg.lucide-menu,
      svg.mobile-menu-bullet,
      svg.folder-icon {
        stroke: var(--secondary) !important;
        fill: none !important;
        background: transparent !important;
      }

      /* Correction pour tous les SVG dans le menu mobile */
      .mobile-menu-content svg {
        background: transparent !important;
        stroke: var(--light) !important;
        fill: none !important;
      }

      .mobile-menu-content svg.mobile-menu-bullet,
      .mobile-menu-content svg.folder-icon {
        stroke: var(--secondary) !important;
        fill: none !important;
      }

      /* Éviter les fonds blancs sur les images SVG */
      img[src$=".svg"] {
        background: transparent !important;
        filter: brightness(0) invert(1) !important;
      }

      /* Corrections pour les SVG dans les boutons */
      button svg {
        background: transparent !important;
        stroke: var(--light) !important;
        fill: none !important;
      }

      button:hover svg {
        stroke: var(--secondary) !important;
      }

      /* Exceptions spécifiques */
      .mobile-menu-toggle:hover svg {
        stroke: var(--secondary) !important;
      }

      /* Correction pour les icônes Darkmode et ReaderMode */
      .darkmode svg,
      .reader-mode svg {
        background: transparent !important;
        stroke: var(--light) !important;
        fill: var(--light) !important;
      }

      .darkmode:hover svg,
      .reader-mode:hover svg {
        stroke: var(--secondary) !important;
        fill: var(--secondary) !important;
      }

      /* Correction pour tous les SVG qui pourraient avoir des fonds blancs */
      * svg {
        background: transparent !important;
      }
    }

    /* Corrections pour le mode light */
    @media (prefers-color-scheme: light) {
      /* Assurer que les SVG sont visibles en mode light */
      svg {
        background: transparent !important;
      }

      .darkmode svg,
      .reader-mode svg {
        background: transparent !important;
        stroke: var(--dark) !important;
        fill: var(--dark) !important;
      }

      .darkmode:hover svg,
      .reader-mode:hover svg {
        stroke: var(--secondary) !important;
        fill: var(--secondary) !important;
      }
    }
  `

  MobileMenu.afterDOMLoaded = concatenateResources(
    `
    // Script pour gérer l'ouverture/fermeture du menu mobile
    document.addEventListener('click', function(e) {
      const toggle = e.target.closest('.mobile-menu-toggle');
      const content = e.target.closest('.mobile-menu-content');
      const overlay = e.target.closest('.mobile-menu-overlay');
      
      if (toggle) {
        const menuId = toggle.getAttribute('aria-controls');
        const menuContent = document.getElementById(menuId);
        const menuOverlay = document.getElementById(\`\${menuId}-overlay\`);
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        // Inverser l'état
        const newExpanded = !isExpanded;
        toggle.setAttribute('aria-expanded', newExpanded);
        menuContent.setAttribute('aria-expanded', newExpanded);
        
        // Gérer l'overlay seulement en mode mobile (pas en horizontal)
        const isMobile = window.innerWidth < 768;
        if (newExpanded) {
          menuOverlay.classList.add('active');
          // Empêcher le scroll du body quand le menu est ouvert
          document.body.style.overflow = 'hidden';
        } else {
          menuOverlay.classList.remove('active');
          // Réactiver le scroll du body
          document.body.style.overflow = '';
        }
        
        // Fermer les autres menus
        document.querySelectorAll('.mobile-menu-toggle').forEach(otherToggle => {
          if (otherToggle !== toggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
            const otherId = otherToggle.getAttribute('aria-controls');
            const otherContent = document.getElementById(otherId);
            const otherOverlay = document.getElementById(\`\${otherId}-overlay\`);
            if (otherContent) {
              otherContent.setAttribute('aria-expanded', 'false');
            }
            if (otherOverlay) {
              otherOverlay.classList.remove('active');
            }
          }
        });
      } else if (!content && !overlay) {
        // Fermer tous les menus si on clique ailleurs
        document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
          const menuId = toggle.getAttribute('aria-controls');
          const menuContent = document.getElementById(menuId);
          const menuOverlay = document.getElementById(\`\${menuId}-overlay\`);
          if (menuContent) {
            menuContent.setAttribute('aria-expanded', 'false');
          }
          if (menuOverlay) {
            menuOverlay.classList.remove('active');
          }
        });
        // Réactiver le scroll du body
        document.body.style.overflow = '';
      }
    });

    // Gérer le clic sur l'overlay pour fermer le menu
    document.addEventListener('click', function(e) {
      if (e.target.closest('.mobile-menu-overlay')) {
        document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
          const menuId = toggle.getAttribute('aria-controls');
          const menuContent = document.getElementById(menuId);
          const menuOverlay = document.getElementById(\`\${menuId}-overlay\`);
          if (menuContent) {
            menuContent.setAttribute('aria-expanded', 'false');
          }
          if (menuOverlay) {
            menuOverlay.classList.remove('active');
          }
        });
        // Réactiver le scroll du body
        document.body.style.overflow = '';
      }
    });

    // Gérer le redimensionnement pour basculer entre les modes
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        const isMobile = window.innerWidth < 768;
        
        // Si on passe en mode desktop, fermer tous les menus et réactiver le scroll
        if (!isMobile) {
          document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
            const menuId = toggle.getAttribute('aria-controls');
            const menuContent = document.getElementById(menuId);
            const menuOverlay = document.getElementById(\`\${menuId}-overlay\`);
            if (menuContent) {
              menuContent.setAttribute('aria-expanded', 'false');
            }
            if (menuOverlay) {
              menuOverlay.classList.remove('active');
            }
          });
          document.body.style.overflow = '';
        }
      }, 150);
    });

    // Gérer la touche Escape pour fermer le menu
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
          const menuId = toggle.getAttribute('aria-controls');
          const menuContent = document.getElementById(menuId);
          const menuOverlay = document.getElementById(\`\${menuId}-overlay\`);
          if (menuContent) {
            menuContent.setAttribute('aria-expanded', 'false');
          }
          if (menuOverlay) {
            menuOverlay.classList.remove('active');
          }
        });
        document.body.style.overflow = '';
      }
    });
    `,
    overflowListAfterDOMLoaded
  )

  return MobileMenu
}) satisfies QuartzComponentConstructor
