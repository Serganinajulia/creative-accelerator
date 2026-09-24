import { useEffect } from 'react'
import { initAnchorScroll } from './lib/scrollTo'
import { useSmoothScroll } from './components/useSmoothScroll'
import Header from './sections/Header'
import Hero from './sections/Hero'
import ShortAbout from './sections/ShortAbout'
import ForWhom from './sections/ForWhom'
import WhatYouGet from './sections/WhatYouGet'
import FormatProgram from './sections/FormatProgram'
import Speakers from './sections/Speakers'
import CriteriaSelection from './sections/CriteriaSelection'
import OrganizersPartners from './sections/OrganizersPartners'
import Faq from './sections/Faq'
import ApplicationForm from './sections/ApplicationForm'
import Footer from './sections/Footer'

export default function App() {
  useSmoothScroll()
  useEffect(() => initAnchorScroll(), [])
  
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ForWhom />
        <WhatYouGet />
        <ShortAbout />
        <FormatProgram />
        <Speakers />
        <CriteriaSelection />
        <OrganizersPartners />
        <Faq />
        <ApplicationForm />
      </main>
      <Footer />
    </>
  )
}
