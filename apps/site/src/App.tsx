import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Story } from './sections/Story'
import { HowItWorks } from './sections/HowItWorks'
import { Picks } from './sections/Picks'
import { YourWords } from './sections/YourWords'
import { Faces } from './sections/Faces'
import { Pricing } from './sections/Pricing'
import { MadeWith } from './sections/MadeWith'
import { Footer } from './sections/Footer'
import { Fold, NothingFits } from './sections/Fold'
import { Scrollbar } from './components/Scrollbar'
import { ToTop } from './components/ToTop'

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Fold variant="hero" pin={<Hero />}>
          <Story />
          <HowItWorks />
          <Fold pin={<NothingFits />}>
            <Picks />
            <YourWords />
            <Faces />
            <Pricing />
            <MadeWith />
          </Fold>
        </Fold>
      </main>
      <Footer />
      <ToTop />
      <Scrollbar />
    </>
  )
}
