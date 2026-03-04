let visibleHeaders = new Set<string>()

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const slug = entry.target.id
    const tocEntryElements = document.querySelectorAll(`a[data-for="${slug}"]`)
    const windowHeight = entry.rootBounds?.height

    // Quartz legacy in-view logic (keeps tracking all passed headers)
    if (windowHeight && tocEntryElements.length > 0) {
      if (entry.boundingClientRect.y < windowHeight) {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.add("in-view"))
      } else {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.remove("in-view"))
      }
    }

    // True intersection tracking for organic Triple State
    if (entry.isIntersecting) {
      visibleHeaders.add(slug)
    } else {
      visibleHeaders.delete(slug)
    }
  }

  const allLinks = Array.from(document.querySelectorAll('.toc-content a'))
  allLinks.forEach(a => {
    a.classList.remove('is-past', 'is-active', 'is-future', 'active')
    a.removeAttribute('style')
  })

  // .in-view contains all headings we've scrolled past + the current one
  const inViewLinks = Array.from(document.querySelectorAll('.toc-content a.in-view'))

  if (inViewLinks.length === 0) {
    allLinks.forEach(link => link.classList.add('is-future'))
    return
  }

  const activeIndex = inViewLinks.length - 1
  const currentActiveLink = inViewLinks[activeIndex]

  // Filter true visible links from the order of DOM
  const visibleLinkElements = allLinks.filter(link => {
    const slug = link.getAttribute('data-for')
    return slug && visibleHeaders.has(slug)
  })

  // Apply Triple State
  allLinks.forEach((link) => {
    const isVisible = visibleLinkElements.includes(link)
    const idxInView = inViewLinks.indexOf(link)

    if (isVisible) {
      // EN COURS : visible à l'écran
      link.classList.add('is-active')
      const pos = visibleLinkElements.indexOf(link)
      if (pos === 0) {
        link.classList.add('active') // Le plus haut est pur blanc
      } else {
        // Blanc légèrement atténué, uniforme pour tous les titres visibles non-primaires
        link.setAttribute('style', `opacity: 0.75 !important; font-weight: normal;`)
      }
    } else if (idxInView !== -1) {
      // LU / HORS ÉCRAN VERS LE HAUT
      if (link === currentActiveLink && visibleLinkElements.length === 0) {
        // En cours de lecture d'une longue section, aucun nouveau titre à l'écran
        link.classList.add('is-active', 'active')
      } else {
        // Vraiment passé
        link.classList.add('is-past')
      }
    } else {
      // À LIRE : en dessous
      link.classList.add('is-future')
    }
  })

  // Scrolling the TOC container
  const targetScrollLink = visibleLinkElements.length > 0 ? visibleLinkElements[0] : currentActiveLink
  const container = targetScrollLink.closest('.toc-content') as HTMLElement
  if (container) {
    const offsetTop = (targetScrollLink as HTMLElement).offsetTop
    container.scrollTo({ top: offsetTop - container.clientHeight / 2, behavior: 'smooth' })
  }
}, {
  rootMargin: '-5% 0px -20% 0px',
  threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
})

function toggleToc(e: Event) {
  const btn = e.currentTarget as HTMLElement
  btn.classList.toggle("collapsed")
  btn.setAttribute(
    "aria-expanded",
    btn.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const targetId = btn.getAttribute("data-target")
  if (!targetId) return
  const content = document.getElementById(targetId)
  if (!content) return
  content.classList.toggle("collapsed")
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header")
    const content = toc.querySelector(".toc-content")
    if (!button || !content) continue
    button.addEventListener("click", toggleToc)
    window.addCleanup(() => button.removeEventListener("click", toggleToc))
  }
}

document.addEventListener("nav", () => {
  setupToc()
  visibleHeaders.clear() // Reset on page change

  // update toc entry highlighting
  observer.disconnect()
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  headers.forEach((header) => observer.observe(header))
})
