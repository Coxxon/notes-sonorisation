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
          Contenu rédigé par Allan Le Guyader © {year}
          {linkEntries.length > 0 && <span class="footer-separator"> • </span>}
          {linkEntries.map(([text, link], index) => (
            <>
              <a href={link}>{text}</a>
              {index < linkEntries.length - 1 && <span class="footer-separator"> • </span>}
            </>
          ))}
        </p>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor