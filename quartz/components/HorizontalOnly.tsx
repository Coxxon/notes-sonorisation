import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const HorizontalOnly: QuartzComponent = ({ children, displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "horizontal-only")}>
      {children}
    </div>
  )
}

HorizontalOnly.css = `
  .horizontal-only {
    display: none;
  }

  @media (min-width: 768px) {
    .horizontal-only {
      display: block;
    }
  }
`

export default (() => {
  const HorizontalOnlyWrapper: QuartzComponent = (props: QuartzComponentProps) => {
    return HorizontalOnly(props)
  }
  return HorizontalOnlyWrapper
}) satisfies QuartzComponentConstructor
