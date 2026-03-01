import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? "Untitled"
  const baseDir = pathToRoot(fileData.slug!)
  
  const firstLetter = title.charAt(0).toUpperCase()
  const restOfTitle = title.slice(1).toUpperCase()

  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <span class="logo-first">{firstLetter}</span>
        <span class="logo-rest">{restOfTitle}</span>
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  margin: 0;
  font-family: 'Rajdhani', sans-serif; /* Assure-toi que Rajdhani est dans quartz.config.ts */
}

.page-title a {
  color: #ffffff !important; /* Texte blanc par défaut */
  text-decoration: none !important;
  font-weight: 500;
  display: inline-block;
  letter-spacing: -1px;
  /* Pas de lueur par défaut */
  text-shadow: 0 0 0px rgba(255, 255, 255, 0);
  /* Transition douce de 0.3 secondes sur toutes les propriétés (dont text-shadow) */
  transition: all 0.5s ease-in-out;
}

.page-title a:hover {
  color: #ffffff !important; /* Reste blanc au survol */
  /* Lueur blanche progressive (text-shadow) */
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5);
}

.logo-first {
  font-size: 4rem;
  line-height: 1;
  vertical-align: baseline;
  margin-right: -2px;
}

.logo-rest {
  font-size: 2.9rem;
  letter-spacing: 2px;
  opacity: 0.9;
}
`
export default (() => PageTitle) satisfies QuartzComponentConstructor