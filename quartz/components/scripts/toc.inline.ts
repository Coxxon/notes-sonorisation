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

  // .in-view contains all headings we've scrolled past (legacy Quartz logic)
  const inViewLinks = Array.from(document.querySelectorAll(".toc-content a.in-view"))

  if (inViewLinks.length === 0) {
    allLinks.forEach((link) => link.classList.add("is-future"))
    return
  }

  // Filter true visible links from the order of DOM
  const visibleLinkElements = allLinks.filter(link => {
    const slug = link.getAttribute('data-for')
    return slug && visibleHeaders.has(slug)
  })

  // Get the slug of the focal header
  // Priority 1: The first header visible at the top of the screen
  // Priority 2: The last header passed (if we are in the middle of a section)
  let activeSlug = ""
  if (visibleLinkElements.length > 0) {
    activeSlug = visibleLinkElements[0].getAttribute("data-for") ?? ""
  } else if (inViewLinks.length > 0) {
    activeSlug = inViewLinks[inViewLinks.length - 1].getAttribute("data-for") ?? ""
  }

  // Apply Triple State
  allLinks.forEach((link) => {
    const slug = link.getAttribute('data-for')
    const isVisible = slug && visibleHeaders.has(slug)
    const isInView = link.classList.contains("in-view")
    const isExactlyActive = slug === activeSlug

    if (isExactlyActive) {
      link.classList.add("is-active", "active")
    } else if (isVisible) {
      // EN COURS : visible à l'écran
      link.classList.add("is-active")
    } else if (isInView) {
      // LU / HORS ÉCRAN VERS LE HAUT
      link.classList.add('is-past')
    } else {
      // À LIRE : en dessous
      link.classList.add('is-future')
    }
  })

  // Scrolling the TOC containers (desktop and mobile can have different containers)
  const containers = new Set<HTMLElement>()
  document.querySelectorAll(`a[data-for="${activeSlug}"]`).forEach(link => {
    const container = link.closest('.toc-content') as HTMLElement
    if (container) containers.add(container)
  })

  containers.forEach(container => {
    const activeLink = container.querySelector(`a[data-for="${activeSlug}"]`) as HTMLElement
    if (activeLink) {
      container.scrollTo({ top: activeLink.offsetTop - container.clientHeight / 2, behavior: 'smooth' })
    }
  })
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
