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
  font-weight: 300;
  display: inline-block;
  letter-spacing: -1px;
  /* Aucune transition sur font-size ou transform liés au scroll ratio pour éviter le lag (1:1 direct mapping) */
  transition: filter 0.4s ease-out, transform 0.4s ease;
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
    const handleScroll = () => {
      /* ÉTAT BINAIRE AVEC HYSTÉRÉSIS :
         Shrink à 60px, un-shrink à 20px pour éviter le flickering.
         La bande morte [20px-60px] empêche l'oscillation. */
      const shrinkThreshold = 60;
      const unshrinkThreshold = 20;
      const currentScroll = Math.max(window.scrollY, leftSidebar.scrollTop);
      const isShrunk = dashboard.classList.contains('is-shrunk');
      
      if (!isShrunk && currentScroll > shrinkThreshold) {
        dashboard.classList.add('is-shrunk');
      } else if (isShrunk && currentScroll < unshrinkThreshold) {
        dashboard.classList.remove('is-shrunk');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    leftSidebar.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call just in case
    handleScroll();
  }
`

export default (() => PageTitle) satisfies QuartzComponentConstructor