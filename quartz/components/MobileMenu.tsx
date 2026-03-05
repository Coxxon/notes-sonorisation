import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { resolveRelative } from "../util/path"
import style from "./styles/explorer.scss"
import { concatenateResources } from "../util/resources"

import Search from "./Search"

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
  const { overflowListAfterDOMLoaded } = OverflowListFactory()

  const MobileMenu: QuartzComponent = (props: QuartzComponentProps) => {
    const { cfg, displayClass, allFiles, fileData } = props
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
        </button>

        {/* Overlay sombre */}
        <div class="mobile-menu-overlay" id={`${id}-overlay`}></div>

        <div id={id} class="mobile-menu-content" aria-expanded={false} role="group">
          {/* Section Recherche */}
          <div class="mobile-menu-section mobile-menu-search">
            {Search()({ ...props, displayClass: "mobile-only" })}
          </div>

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
                        <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
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

          {/* Section Table des Matières */}
          {fileData.toc && fileData.toc.length > 0 && (
            <div class="mobile-menu-section">
              <h3 class="mobile-menu-section-title">{i18n(cfg.locale).components.tableOfContents.title}</h3>
              <ul class="mobile-menu-toc mobile-explorer-ul">
                {fileData.toc.map((tocEntry) => (
                  <li key={tocEntry.slug} class={`depth-${tocEntry.depth}`}>
                    <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
                      {tocEntry.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
      padding: 0; /* Fully naked button padding */
      margin: 0;
      margin-left: -1rem; /* Symmetric with darkmode button position */
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-radius: 0;
      transition: color 0.2s ease;
      gap: 6px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--dark);
      white-space: nowrap;
      touch-action: manipulation;
    }

    .mobile-menu-toggle:hover {
      background-color: transparent;
      transform: none;
    }

    .mobile-menu-toggle:active {
      background-color: transparent;
      transform: none;
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

    /* Styles pour la barre de recherche intégrée au menu mobile */
    .mobile-menu-search {
      padding: 1rem;
      border-bottom: 1px solid var(--lightgray);
    }

    .mobile-menu-search .search {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      max-width: none !important;
      min-width: 100% !important;
      margin: 0 !important;
    }

    .mobile-menu-search .search-button {
      width: 100% !important;
      justify-content: flex-start !important;
      padding: 8px 12px !important;
      height: 2.5rem !important;
      background-color: var(--light) !important;
      border: 1px solid var(--lightgray) !important;
      border-radius: 6px !important;
      font-size: 16px !important;
    }

    .mobile-menu-search .search-button p {
      display: inline !important;
      margin-left: 8px !important;
      color: var(--gray) !important;
      font-size: 16px !important;
    }

    .mobile-menu-search input {
      font-size: 16px !important;
    }

    /* Correction pour éviter d'afficher d'autres éléments Search dans le header */
    header .search {
      display: none !important;
    }

    /* FORCER l'affichage de la recherche sur mobile UNIQUEMENT DANS LE MENU */
    @media (max-width: 1024px) {
      header > .search {
        display: none !important;
      }
    }

    /* Overlay sombre quand le menu est ouvert */
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      touch-action: none;
    }

    .mobile-menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .mobile-menu-content {
      position: fixed;
      top: 0;
      left: 0;
      width: 280px; /* Restauration de la largeur originale */
      max-width: 85vw; /* Failsafe responsive */
      height: 100%;
      background-color: var(--light);
      z-index: 9999;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      touch-action: manipulation;
    }

    .mobile-menu-content[aria-expanded="true"] {
      transform: translateX(0); /* Glisse vers la droite */
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
      
      /* FIX TEXT WRAPPING OVERRIDING FLEXBOX MIN-WIDTH */
      flex: 1;
      min-width: 0;
      display: inline-block;
      white-space: normal;
      word-break: break-word;
      line-height: 1.3;
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
      
      /* FIX TEXT WRAPPING */
      display: inline-block;
      white-space: normal;
      word-break: break-word;
      line-height: 1.3;
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

    /* Mode horizontal / Desktop (> 1024px) */
    @media (min-width: 1025px) {
      .mobile-menu-toggle {
        display: none !important; /* On cache le hamburger sur Desktop */
      }

      /* Ne plus afficher le texte "Search" en horizontal car la recherche n'est plus dans le header */
    }

    /* Amélioration pour mobile en mode paysage */
    @media (orientation: landscape) and (max-height: 600px) {
      .mobile-menu-content {
        max-height: 60vh;
      }
    }
  `

  MobileMenu.afterDOMLoaded = concatenateResources(
    `
    // Script pour gérer l'ouverture/fermeture du menu mobile
    function lockBody() {
      document.documentElement.classList.add('menu-open');
    }
    
    function unlockBody() {
      document.documentElement.classList.remove('menu-open');
    }
    
    // Fonction de portail pour sortir le menu du header (évite d'être décalé avec lui)
    function portalMenu() {
      document.querySelectorAll('.mobile-menu-content, .mobile-menu-overlay').forEach(el => {
        if (el.parentElement !== document.body) {
          document.body.appendChild(el);
        }
      });
    }
    
    // Initialisation du portail
    portalMenu();
    
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
        
        // Gérer l'overlay en appliquant la transition CSS fluide
        if (newExpanded) {
          menuOverlay.classList.add('active');
          lockBody();
        } else {
          menuOverlay.classList.remove('active');
          unlockBody();
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
        unlockBody();
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
        unlockBody();
      }
    });

    // Gérer le redimensionnement pour basculer entre les modes
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        const isMobile = window.innerWidth <= 1024;
        
        // Si on passe en mode desktop (au-dessus du breakpoint)
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
          unlockBody();
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
        unlockBody();
      }
    });

    // Nettoyer l'état du menu lors d'une navigation interne (SPA)
    document.addEventListener('nav', function() {
      // S'assurer de toujours réactiver le scroll
      document.documentElement.classList.remove('menu-open');
      document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
      // Replacer le menu dans le body au cas où il aurait été re-rendu dans le header
      portalMenu();
    });

    // --- Ajout de la navigation tactile (Swipe Left / Swipe Right) ---
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;
    const swipeThreshold = 50; // Distance horizontale minimum augmentée pour l'intention

    document.addEventListener('touchstart', e => {
      touchstartX = e.changedTouches[0].screenX;
      touchstartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      touchendY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    });

    function handleSwipeGesture() {
      // Ignorer si l'écran est un desktop (>1024)
      if (window.innerWidth > 1024) return;
      
      const toggle = document.querySelector('.mobile-menu-toggle');
      if (!toggle) return;
      
      const menuId = toggle.getAttribute('aria-controls');
      const menuContent = document.getElementById(menuId);
      const menuOverlay = document.getElementById(\`\${menuId}-overlay\`);
      
      if (!menuContent) return;
      
      const isExpanded = menuContent.getAttribute('aria-expanded') === 'true';
      const distanceX = touchendX - touchstartX;
      const distanceY = Math.abs(touchendY - touchstartY);
      
      // Sécurité anti-scroll: Le mouvement doit être principalement horizontal
      // et la distance horizontale doit dépasser le seuil
      if (Math.abs(distanceX) < distanceY) return;

      // Swipe vers la droite (Menu Ouvrir)
      if (distanceX > swipeThreshold && !isExpanded) {
        // Zone d'activation élargie aux deux tiers gauches de l'écran
        if (touchstartX < window.innerWidth * 0.66) {
          toggle.setAttribute('aria-expanded', 'true');
          menuContent.setAttribute('aria-expanded', 'true');
          if (menuOverlay) menuOverlay.classList.add('active');
          lockBody();
        }
      }
      
      // Swipe vers la gauche (Menu Fermer)
      if (distanceX < -swipeThreshold && isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        menuContent.setAttribute('aria-expanded', 'false');
        if (menuOverlay) menuOverlay.classList.remove('active');
        unlockBody();
      }
    }
    `,
    overflowListAfterDOMLoaded
  )

  return MobileMenu
}) satisfies QuartzComponentConstructor
