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
  perspective: 1000px; /* Prépare l'effet de profondeur */
}

.page-title a {
  color: var(--dark) !important;
  text-decoration: none !important;
  font-weight: 500;
  display: inline-block;
  letter-spacing: -1px;
  /* Transition fluide pour le zoom et l'ombre */
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), text-shadow 0.4s ease;
  transform-origin: left center;
}

.page-title a:hover {
  /* Effet de zoom (approche de l'oeil) */
  transform: scale(1.05) translateZ(20px);
  
  /* Halo propre : on superpose deux ombres très diffuses pour un effet néon propre sans tache */
  text-shadow: 
    0 0 15px var(--dark),
    0 0 30px rgba(var(--dark-rgb), 0.2);
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