import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Story } from './sections/Story'
import { HowItWorks } from './sections/HowItWorks'
import { Picks } from './sections/Picks'
import { YourWords } from './sections/YourWords'
import { Faces } from './sections/Faces'
import { Pricing } from './sections/Pricing'
import { MadeWith } from './sections/MadeWith'
import { Team } from './sections/Team'
import { Footer } from './sections/Footer'

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Story />
        <HowItWorks />
        <Picks />
        <YourWords />
        <Faces />
        <Pricing />
        <MadeWith />
        <Team />
      </main>
      <Footer />
    </>
  )
}
