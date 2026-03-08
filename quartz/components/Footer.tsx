import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? {}
    const linkEntries = Object.entries(links)

    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          <span class="copyright">Contenu rédigé par Allan Le Guyader © {year}</span>
          {linkEntries.map(([text, link]) => (
            <span class="footer-link">
              <span class="footer-separator"> • </span>
              <a href={link}>{text}</a>
            </span>
          ))}
        </p>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor