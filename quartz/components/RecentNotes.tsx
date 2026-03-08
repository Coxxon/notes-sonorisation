import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentNotes.scss"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  linkToMore: SimpleSlug | false
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
  collapsed: boolean
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  showTags: true,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg),
  collapsed: false,
})

let numRecentNotes = 0

export default ((userOpts?: Partial<Options>) => {
  const RecentNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = allFiles.filter(opts.filter).sort(opts.sort)
    const remaining = Math.max(0, pages.length - opts.limit)
    const isCollapsed = opts.collapsed ?? defaultOptions(cfg).collapsed
    const id = `recent-content-${numRecentNotes++}`
    return (
      <div class={classNames(displayClass, "recent-notes")}>
        <button
          type="button"
          class={isCollapsed ? "collapsed recent-header" : "recent-header"}
          aria-expanded={!isCollapsed ? "true" : "false"}
          aria-controls={id}
          data-target={id}
        >
          <h3>{opts.title ?? i18n(cfg.locale).components.recentNotes.title}</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="fold"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div id={id} class={`recent-content-container ${isCollapsed ? "collapsed" : ""}`}>
          <ul class="recent-ul">
            {pages.slice(0, opts.limit).map((page) => {
              const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
              const tags = page.frontmatter?.tags ?? []

              return (
                <li class="recent-li">
                  <div class="recent-container">
                    {/* SVG Diamond avec paramètres de rendu optimisés */}
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
                      class="cyber-bullet"
                    >
                      <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
                    </svg>

                    <div class="section">
                      <div class="desc">
                        <span>
                          <a href={resolveRelative(fileData.slug!, page.slug!)}>
                            {title}
                          </a>
                        </span>
                      </div>
                      {opts.showTags && (
                        <ul class="tags">
                          {tags.map((tag) => (
                            <li>
                              <a
                                class="internal tag-link"
                                href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                              >
                                {tag}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          {opts.linkToMore && remaining > 0 && (
            <p>
              <a href={resolveRelative(fileData.slug!, opts.linkToMore)} class="see-more">
                {i18n(cfg.locale).components.recentNotes.seeRemainingMore({ remaining })}
              </a>
            </p>
          )}
        </div>
      </div>
    )
  }

  RecentNotes.css = style + `
  .recent-header {
    display: flex;
    justify-content: flex-start;
    gap: 0.5rem;
    align-items: center;
    width: 100%;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--dark);
    margin-bottom: 0.75rem;
  }
  
  .recent-header h3 {
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 1.4rem !important;
    text-transform: uppercase !important;
    letter-spacing: 1.5px !important;
    font-weight: 500 !important;
    color: var(--dark) !important;
    margin: 0 !important;
  }

  .recent-header .fold {
    transition: transform 0.2s ease;
    opacity: 0.8;
  }

  .recent-header.collapsed .fold {
    transform: rotate(-90deg);
  }

  .recent-content-container.collapsed {
    display: none;
  }

  .recent-ul {
    list-style: none !important;
    padding: 0 !important;
  }

  .recent-li {
    margin-bottom: 0.8rem !important;
  }

  .recent-container {
    display: flex !important;
    align-items: flex-start !important;
    transition: transform 0.2s ease-out;
  }

  .recent-container:hover {
    transform: translateX(4px);
  }

  .cyber-bullet {
    color: var(--secondary); /* Utilise la couleur d'accent du thème */
    margin-right: 12px;
    flex-shrink: 0;
    margin-top: 5px;
    transform-origin: center;
    will-change: transform, color;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease;
  }

  .recent-container:hover .cyber-bullet {
    transform: scale(1.15) rotate(15deg);
    /* Couleur de l'icône au survol : utilise la variable secondaire */
    color: var(--secondary) !important; 
    filter: drop-shadow(0 0 4px var(--secondary));
  }

  .recent-li .desc a {
    font-family: 'Rajdhani', sans-serif !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    color: var(--dark) !important;
    text-decoration: none !important;
    transition: color 0.2s ease, transform 0.2s ease;
    display: inline-block;
  }

  .recent-li .desc a:hover {
    /* La couleur de texte au survol utilise l'accent secondaire du thème */
    /* C'est la meilleure façon d'être adaptatif propre */
    color: var(--secondary) !important;
  }

  .see-more {
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 0.9rem;
    opacity: 0.7;
    text-decoration: none;
    color: var(--dark);
  }

  .see-more:hover {
    color: var(--secondary);
    opacity: 1;
  }
  `
  RecentNotes.afterDOMLoaded = `
    document.addEventListener('nav', () => {
      const headers = document.querySelectorAll('.recent-header');
      headers.forEach(header => {
        const toggleRecent = (e) => {
          const btn = e.currentTarget;
          btn.classList.toggle('collapsed');
          const contentId = btn.getAttribute('data-target');
          if (contentId) {
            const content = document.getElementById(contentId);
            if (content) {
              content.classList.toggle('collapsed');
              btn.setAttribute('aria-expanded', !btn.classList.contains('collapsed'));
            }
          }
        };
        header.addEventListener('click', toggleRecent);
        window.addCleanup(() => header.removeEventListener('click', toggleRecent));
      });
    });
  `
  return RecentNotes
}) satisfies QuartzComponentConstructor