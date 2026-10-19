import { BrandBand } from '../../components/home/BrandBand'
import { Featured } from '../../components/home/Featured'
import { Hero } from '../../components/home/Hero'
import { Process } from '../../components/home/Process'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar'
import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'

// Las secciones se separan por el fondo —página, alterno, página, alterno— y no
// por un divisor: cada banda empieza donde el color cambia.
export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Process />
        <Featured />
        <BrandBand />
      </main>
      <Footer />
    </div>
  )
}
