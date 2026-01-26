import InternshipHero from '@/components/_core/landing-pages/home/hero'
import Partners from '@/components/_core/landing-pages/home/partners/index'
import WhatWeOffer from '@/components/_core/landing-pages/home/what-we-offer/index'
import Testimonial from '@/components/_core/landing-pages/home/testimonial'
import Portfolio from '@/components/_core/landing-pages/home/portfolio'
import WhatOurInternsSays from '@/components/_core/landing-pages/home/what-our-interns-says'
import Experience from '@/components/_core/landing-pages/home/experience'
import RoadMap from '@/components/_core/landing-pages/home/road-map/index'
import SuccessStories from '@/components/_core/landing-pages/home/success-stories/index'
import Faq from '@/components/_core/landing-pages/home/faq'

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
