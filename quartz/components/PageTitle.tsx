import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? "Untitled"
  const baseDir = pathToRoot(fileData.slug!)

  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>{title}</a>
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

`

PageTitle.afterDOMLoaded = `
  const pageTitle = document.querySelector('.page-title');
  let dashboard = null;
  if (pageTitle) {
    dashboard = pageTitle.closest('.flex-component.desktop-only') || pageTitle.closest('.desktop-only');
    if (dashboard) {
      dashboard.id = 'command-center-header';
    }
  }

  const leftSidebar = document.querySelector('.left');
  
  if (leftSidebar && dashboard) {
    leftSidebar.addEventListener('scroll', () => {
      if (leftSidebar.scrollTop > 10) {
        dashboard.classList.add('is-scrolled');
      } else {
        dashboard.classList.remove('is-scrolled');
      }
    });
  }
`

export default (() => PageTitle) satisfies QuartzComponentConstructor