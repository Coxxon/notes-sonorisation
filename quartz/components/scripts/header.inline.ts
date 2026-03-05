let lastScrollY = window.scrollY
let isScrollingUp = false

document.addEventListener("nav", () => {
    const header = document.querySelector(".page-header")
    if (!header) return

    // Reset state on navigation
    header.classList.remove("header-hidden")
    lastScrollY = window.scrollY

    const handleScroll = () => {
        // Ignorer complètement le script si on n'est pas sur mobile
        if (window.innerWidth > 1024) {
            header.classList.remove("header-hidden")
            return
        }

        // Figer l'état actuel du header si le menu est ouvert
        if (document.documentElement.classList.contains("menu-open")) {
            return
        }

        const currentScrollY = window.scrollY

        // Determine scroll direction
        if (currentScrollY > lastScrollY) {
            isScrollingUp = false
        } else if (currentScrollY < lastScrollY) {
            isScrollingUp = true
        }

        // Hide header if scrolling down and past the header's height
        // Show header if scrolling up
        if (!isScrollingUp && currentScrollY > 60) {
            header.classList.add("header-hidden")
        } else if (isScrollingUp) {
            header.classList.remove("header-hidden")
        }

        lastScrollY = currentScrollY
    }

    // Throttle or debounce might be needed for performance, but simple scroll works for now
    window.removeEventListener("scroll", handleScroll)
    window.addEventListener("scroll", handleScroll, { passive: true })

    window.addCleanup(() => window.removeEventListener("scroll", handleScroll))
})
