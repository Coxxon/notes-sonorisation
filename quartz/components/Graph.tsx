import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/graph.inline"
import style from "./styles/graph.scss"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

export interface D3Config {
  drag: boolean
  zoom: boolean
  depth: number
  scale: number
  repelForce: number
  centerForce: number
  linkDistance: number
  fontSize: number
  opacityScale: number
  removeTags: string[]
  showTags: boolean
  focusOnHover?: boolean
  enableRadial?: boolean
}

interface GraphOptions {
  localGraph: Partial<D3Config> | undefined
  globalGraph: Partial<D3Config> | undefined
  collapsed: boolean
}

const defaultOptions: GraphOptions = {
  localGraph: {
    drag: true,
    zoom: true,
    depth: 1,
    scale: 1.1,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: false,
    enableRadial: false,
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.5,
    centerForce: 0.2,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: true,
    enableRadial: true,
  },
  collapsed: true,
}

let numGraphs = 0

export default ((opts?: Partial<GraphOptions>) => {
  const Graph: QuartzComponent = ({ displayClass, fileData, cfg }: QuartzComponentProps) => {
    if (fileData.slug === "index") {
      return <></>
    }

    const localGraph = { ...defaultOptions.localGraph, ...opts?.localGraph }
    const id = `graph-${numGraphs++}`
    return (
      <div class={classNames(displayClass, "graph")}>
        <button
          type="button"
          class="graph-header"
          aria-expanded="true"
          aria-controls={id}
          data-target={id}
        >
          <h3>{i18n(cfg.locale).components.graph.title}</h3>
        </button>
        <div id={id} class="graph-content-container">
          <div class="graph-outer">
            <div class="graph-container" data-cfg={JSON.stringify(localGraph)}></div>
          </div>
        </div>
      </div>
    )
  }

  Graph.css = style + `
  .graph-header {
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
  }
  
  .graph-header h3 {
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 1.4rem !important;
    text-transform: uppercase !important;
    letter-spacing: 1.5px !important;
    font-weight: 500 !important;
    color: var(--dark) !important;
    margin: 0 !important;
  }
  
  .graph-header .fold {
    display: none; /* Chevron supprimé */
  }
  
  .graph-content-container {
    max-height: none;
    opacity: 1;
    overflow: visible;
    margin-top: 0;
  }
  `
  Graph.afterDOMLoaded = script + `
    document.addEventListener('nav', () => {
      /* Toggle désactivé : le graph est toujours visible */
    });
  `

  return Graph
}) satisfies QuartzComponentConstructor
