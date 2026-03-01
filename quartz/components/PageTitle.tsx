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
  color: var(--dark) !important;
  text-decoration: none !important;
  font-weight: 500;
  display: inline-block;
  letter-spacing: -1px;
  transition: transform 0.3s ease-out, text-shadow 0.3s ease-out;
  transform-origin: center;
}

.page-title a:hover {
  transform: scale(1.05);
  
  /* HALO BOOSTÉ : On augmente l'opacité à 0.8 et 0.5 */
  /* On ajoute une première couche très serrée pour simuler le tube néon */
  text-shadow: 
    0 0 4px var(--dark),                           /* Bordure nette des lettres */
    0 0 12px rgba(var(--dark-rgb), 0.9),           /* Halo intérieur puissant (90%) */
    0 0 25px rgba(var(--dark-rgb), 0.6),           /* Halo moyen (60%) */
    0 0 45px rgba(var(--dark-rgb), 0.3);           /* Diffusion lointaine (30%) */
}

.logo-first {
  font-size: 4rem;
  line-height: 1;
  vertical-align: baseline;
  margin-right: -2px;
}

.logo-rest {
  font-size: 3.4rem;
  letter-spacing: 2px;
  opacity: 0.9;
}
`
export default (() => PageTitle) satisfies QuartzComponentConstructor