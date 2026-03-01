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
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  showTags: true,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg),
})

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
    return (
      <div class={classNames(displayClass, "recent-notes")}>
        <h3>{opts.title ?? i18n(cfg.locale).components.recentNotes.title}</h3>
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
                    <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/>
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
    )
  }

  RecentNotes.css = style + `
  .recent-notes > h3 {
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 1.4rem !important;
    text-transform: uppercase !important;
    letter-spacing: 1.5px !important;
    font-weight: 500 !important;
    color: var(--dark) !important;
    margin-bottom: 0.75rem !important;
    margin-top: 0 !important;
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
    color: var(--secondary);
    margin-right: 12px;
    flex-shrink: 0;
    margin-top: 5px;
    transform-origin: center;
    will-change: transform, color; /* Optimisation pour fluidité totale */
    transition: transform 0.3s ease-out, color 0.3s ease-out;
  }

  .recent-container:hover .cyber-bullet {
    transform: scale(1.15) rotate(15deg);
    color: #00f3ff !important; /* Couleur Néon plus appuyée au survol */
    filter: drop-shadow(0 0 5px rgba(0, 243, 255, 0.5)); /* Ajout d'une lueur propre sur l'icône */
  }

  .recent-li .desc a {
    font-family: 'Rajdhani', sans-serif !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    color: var(--dark) !important;
    text-decoration: none !important;
    transition: color 0.2s ease;
  }

  .recent-li .desc a:hover {
    color: #00f3ff !important;
  }

  .see-more {
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 0.9rem;
    opacity: 0.7;
    text-decoration: none;
  }
  `
  return RecentNotes
}) satisfies QuartzComponentConstructor