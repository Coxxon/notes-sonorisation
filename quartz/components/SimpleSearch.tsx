import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const SimpleSearch: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "simple-search")}>
      <button 
        class="simple-search-button"
        onClick={() => {
          // Ouvre la recherche native du navigateur (Ctrl+F)
          if (typeof window !== 'undefined' && 'find' in window) {
            (window as any).find("")
          }
        }}
        aria-label="Rechercher"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          width="20" 
          height="20" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </button>
    </div>
  )
}

SimpleSearch.css = `
.simple-search {
  display: flex;
  align-items: center;
}

.simple-search-button {
  background: transparent;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.simple-search-button:hover {
  background: var(--lightgray);
  border-color: var(--darkgray);
}

.simple-search-button svg {
  color: var(--darkgray);
  transition: color 0.2s ease;
}

.simple-search-button:hover svg {
  color: var(--dark);
}

/* Mobile styles */
@media (max-width: 767px) {
  .simple-search {
    order: 3;
    flex: 0 0 auto;
  }
  
  .simple-search-button {
    padding: 6px;
    min-width: 44px;
    height: 44px;
  }
}
`

export default (() => SimpleSearch) satisfies QuartzComponentConstructor
