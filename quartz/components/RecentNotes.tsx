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
                  {/* Symbole technique injecté */}
                  <span class="cyber-bullet">◇</span>
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
    color: var(--dark) !important; /* Adapté au mode clair/sombre */
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
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .recent-container:hover {
    transform: translateX(6px); /* Animation de décalage au survol */
  }

  .cyber-bullet {
    color: var(--secondary); /* Ton bleu d'accentuation */
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.1rem;
    margin-right: 8px;
    font-weight: 700;
    line-height: 1.4;
    user-select: none;
  }

  .recent-li .desc a {
    font-family: 'Rajdhani', sans-serif !important;
    font-weight: 600 !important; /* Plus épais que l'explorateur */
    font-size: 1rem !important;
    color: var(--dark) !important;
    text-decoration: none !important;
    transition: color 0.2s ease;
  }

  .recent-li .desc a:hover {
    color: var(--secondary) !important;
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