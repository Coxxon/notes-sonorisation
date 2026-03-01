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
  transition: transform 0.3s ease-out, filter 0.3s ease-out;
  transform-origin: center;
  /* Garantit la netteté absolue du texte */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page-title a:hover {
  transform: scale(1.05);
  
  /* HALO SOBRE : Une seule couche large pour ne pas "baver" sur les lettres */
  filter: drop-shadow(0 0 2px var(--secondary));
  
  opacity: 1 !important;
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