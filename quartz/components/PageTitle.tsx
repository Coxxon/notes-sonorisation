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
  font-family: 'Rajdhani', sans-serif;
}

.page-title a {
  color: #ffffff !important;
  text-decoration: none !important;
  font-weight: 500; /* Passage à 400 pour un aspect plus fin et élégant */
  display: inline-block;
  letter-spacing: -1px;
  text-shadow: 0 0 0px rgba(255, 255, 255, 0);
  transition: all 0.3s ease-in-out;
}

.page-title a:hover {
  color: #ffffff !important;
  /* Halo très discret entourant les lettres */
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.4), 0 0 5px rgba(255, 255, 255, 0.2);
}

.logo-first {
  font-size: 4rem; /* Ajusté légèrement pour l'équilibre */
  line-height: 1;
  vertical-align: baseline;
  margin-right: -2px;
}

.logo-rest {
  font-size: 3rem;
  letter-spacing: 2px;
  opacity: 0.9;
}
`
export default (() => PageTitle) satisfies QuartzComponentConstructor