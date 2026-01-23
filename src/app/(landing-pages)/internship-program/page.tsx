import InternshipHero from '@/components/_core/landing-pages/internship-program/hero'
import Partners from '@/components/_core/landing-pages/internship-program/partners'
import WhatWeOffer from '@/components/_core/landing-pages/internship-program/what-we-offer/index'
import Testimonial from '@/components/_core/landing-pages/internship-program/testimonial'
import Portfolio from '@/components/_core/landing-pages/internship-program/portfolio'
import WhatOurInternsSays from '@/components/_core/landing-pages/internship-program/what-our-interns-says'
import Experience from '@/components/_core/landing-pages/internship-program/experience'
import RoadMap from '@/components/_core/landing-pages/internship-program/road-map'
import SuccessStories from '@/components/_core/landing-pages/internship-program/success-stories'
import Faq from '@/components/_core/landing-pages/internship-program/faq'

const InternShipProgram = () => {
  return (
    <div>
      <InternshipHero />
      <WhatWeOffer />
      <Partners />
      <Testimonial />
      <Portfolio />
      <WhatOurInternsSays />
      <Experience />
      <RoadMap />
      <SuccessStories />
      <Faq />
    </div>
  )
}

export default InternShipProgram
