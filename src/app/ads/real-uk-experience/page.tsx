import FooterCta from './content/footer-cta'
import React from 'react'
import Hero from './content/hero'
import RealIssue from './content/real-issue'
import RightFit from './content/right-fit'
import SessionBreakdown from './content/session-breakdown'
import WhatThisUnlocks from './content/what-this-unlocks'
import YourOutcome from './content/your-outcome'

const RealUkExpPage = () => {
  return (
    <div className='bg-[#021013] min-h-screen'>
      <div className="p-3 text-center text-[#FFE082] bg-[#FFE0821A] font-semibold">Only 100 spots — Stop learning. Start becoming the SOC Analyst UK companies actually hire.</div>
      <Hero />
      <YourOutcome />
      <RealIssue />
      <WhatThisUnlocks />
      <SessionBreakdown />
      <RightFit />
      <FooterCta />
    </div>
  )
}

export default RealUkExpPage
