import InternshipHero from '@/components/_core/landing-pages/internship-program/hero'
import Partners from '@/components/_core/landing-pages/internship-program/partners'
import WhatWeOffer from '@/components/_core/landing-pages/internship-program/what-we-offer/index'
import Testimonial from '@/components/_core/landing-pages/internship-program/testimonial'
import Portfolio from '@/components/_core/landing-pages/internship-program/portfolio'
import WhatOurInternsSays from '@/components/_core/landing-pages/internship-program/what-our-interns-says'

const InternShipProgram = () => {
  return (
    <div>
      <InternshipHero />
      <WhatWeOffer/>
      <Partners/>
      <Testimonial/>
      <Portfolio/>
      <WhatOurInternsSays/>
    </div>
  )
}

export default InternShipProgram
