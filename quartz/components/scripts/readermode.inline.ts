const VIEW_MODES = ["default", "light", "full"] as const
type ViewMode = (typeof VIEW_MODES)[number]

const getNextMode = (current: ViewMode, isMobile: boolean): ViewMode => {
  const currentIndex = VIEW_MODES.indexOf(current)
  let nextIndex = (currentIndex + 1) % VIEW_MODES.length

  // Sur mobile, on saute le mode "full" (index 2)
  if (isMobile && VIEW_MODES[nextIndex] === "full") {
    nextIndex = (nextIndex + 1) % VIEW_MODES.length
  }

  return VIEW_MODES[nextIndex]
}

const emitReaderModeChangeEvent = (mode: ViewMode) => {
  const event: CustomEventMap["readermodechange"] = new CustomEvent("readermodechange", {
    detail: { mode },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const savedMode = localStorage.getItem("quartz-reader-mode") as ViewMode
  const isMobile = () => window.innerWidth <= 1024
  let currentMode: ViewMode = VIEW_MODES.includes(savedMode) ? savedMode : "default"

  // Sécurité mobile : si on charge en mode "full" sur mobile, on repasse en "light"
  if (isMobile() && currentMode === "full") {
    currentMode = "light"
  }

  const setMode = (newMode: ViewMode) => {
    currentMode = newMode
    document.documentElement.setAttribute("reader-mode", newMode)
    localStorage.setItem("quartz-reader-mode", newMode)
    emitReaderModeChangeEvent(newMode)
  }

  const cycleReaderMode = () => {
    const nextMode = getNextMode(currentMode, isMobile())
    setMode(nextMode)
  }

  for (const readerModeButton of document.getElementsByClassName("readermode")) {
    readerModeButton.addEventListener("click", cycleReaderMode)
    window.addCleanup(() => readerModeButton.removeEventListener("click", cycleReaderMode))
  }

  // --- Gestion du Swipe "Ghost" pour Mobile ---
  let touchstartX = 0
  let touchstartY = 0
  let touchendX = 0
  let touchendY = 0
  const swipeThreshold = 50

  const handleTouchStart = (e: TouchEvent) => {
    touchstartX = e.changedTouches[0].screenX
    touchstartY = e.changedTouches[0].screenY
  }

  const handleTouchEnd = (e: TouchEvent) => {
    touchendX = e.changedTouches[0].screenX
    touchendY = e.changedTouches[0].screenY
    handleSwipeGesture()
  }

  const handleSwipeGesture = () => {
    if (!isMobile()) return

    // Vérifier si le menu mobile est ouvert (on ne change pas de mode si c'est le cas)
    const isMenuOpen = document.documentElement.classList.contains("menu-open")
    if (isMenuOpen) return

    const distanceX = touchendX - touchstartX
    const distanceY = Math.abs(touchendY - touchstartY)

    // Le mouvement doit être principalement horizontal (pour ne pas interférer avec le scroll vertical)
    if (Math.abs(distanceX) < distanceY) return

    // Swipe de DROITE vers la GAUCHE (Intention "Ghost" pour changer de mode)
    if (distanceX < -swipeThreshold) {
      cycleReaderMode()
    }
  }

  document.addEventListener("touchstart", handleTouchStart, { passive: true })
  document.addEventListener("touchend", handleTouchEnd, { passive: true })
  window.addCleanup(() => {
    document.removeEventListener("touchstart", handleTouchStart)
    document.removeEventListener("touchend", handleTouchEnd)
  })

  // Set initial state
  document.documentElement.setAttribute("reader-mode", currentMode)
})
