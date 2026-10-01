import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import { App } from './App'

const root = createRoot(document.getElementById('root')!)

// `?only=<key>` loads and renders one section alone, so a half-written
// section elsewhere can't break a preview.
const PREVIEWS: Record<string, () => Promise<ComponentType>> = {
  nav: () => import('./sections/Nav').then((m) => m.Nav),
  hero: () => import('./sections/Hero').then((m) => m.Hero),
  story: () => import('./sections/Story').then((m) => m.Story),
  how: () => import('./sections/HowItWorks').then((m) => m.HowItWorks),
  picks: () => import('./sections/Picks').then((m) => m.Picks),
  words: () => import('./sections/YourWords').then((m) => m.YourWords),
  faces: () => import('./sections/Faces').then((m) => m.Faces),
  pricing: () => import('./sections/Pricing').then((m) => m.Pricing),
  made: () => import('./sections/MadeWith').then((m) => m.MadeWith),
  footer: () =>
    import('./sections/Footer').then((m) => {
      const Footer = m.Footer
      return function FooterPreview() {
        return (
          <>
            <main style={{ minHeight: '140vh' }} />
            <Footer />
          </>
        )
      }
    })
}

const only = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('only') : null
if (only && PREVIEWS[only]) {
  void PREVIEWS[only]().then((One) => root.render(<One />))
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
