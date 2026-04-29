"use client"

import React from 'react'
import SaveMySpot from '../content/save-my-spot'
import HeroDataAnalytics from '../content/hero-data-analytics'
import RealIssuesTwo from '../content/real-issues-data-scientist'
import YourOutcome from '../content/your-outcome'
import WhatThisUnlocks from '../content/what-this-unlocks'
import RightFit from '../content/right-fit'
import SessionBreakdown from '../content/session-breakdown'
import FooterCta from '../content/footer-cta'

const DataAnalyticsPage = () => {
  const [isSaveMySpotOpen, setIsSaveMySpotOpen] = React.useState(false)

  return (
    <div className='bg-[#021013] min-h-screen'>
      <div className="p-3 text-center text-[#FFE082] bg-[#FFE0821A] font-semibold">Only 100 spots — This is where you stop learning models and start becoming hireable.</div>
      <HeroDataAnalytics onCtaClick={() => setIsSaveMySpotOpen(true)} />
      <YourOutcome />
      <RealIssuesTwo
        title="Why this Session is Important"
        subtitle="One session. A fundamentally different way the market sees you."
        leftPoints={["You've learned the tools", "You've built practice projects", "You're applying but not standing out"]}
        rightPoints={[
          'You have real analytics work on your CV',
          'You speak like someone who has done the job',
          'You become someone UK employers can actually hire',
        ]}
      />
      <WhatThisUnlocks
        content={{
          eyebrow: '- What This Unlocks',
          title: 'Three things this session changes',
          items: [
            {
              number: '01',
              title: 'Learning -> real end-to-end experience',
              description: 'Your existing projects become credible, communicable work - not just notebooks.',
            },
            {
              number: '02',
              title: '"I built a model" -> "I solved a problem"',
              description: "The language shift that moves you from learner to practitioner in every recruiter's mind.",
            },
            {
              number: '03',
              title: 'Deliver value, not experiments',
              description: 'Position yourself as someone who can ship results, not someone still figuring it out.',
            },
          ],
        }}
      />
      <SessionBreakdown
        content={{
          eyebrow: '- Session Breakdown',
          title: "What you'll walk away with",
          subtitle: "Five concrete things you'll know by the end of this session.",
          points: [
            'What UK Data Analytics employers actually look for',
            'What your CV is missing (and why youve being overlooked)',
            'How to get real project experience without a job first',
            'How to talk about your work in interviews with confidence',
            'Your exact next step - based on where you are',
          ],
          imageSrc: '/images/pngs/ads/season-breakdown.png',
          imageAlt: 'Professional woman walking confidently outdoors',
        }}
      />
      <RightFit
        content={{
          eyebrow: '- Right Fit',
          title: 'Who this is for',
          subtitle: 'This session is built for one specific moment in your journey.',
          cards: [
            {
              image: '/images/pngs/ads/right-fit-1.png',
              text: "You've done data analytics courses but feel stuck",
            },
            {
              image: '/images/pngs/ads/right-fit-2.png',
              text: "You're applying and getting no responses",
            },
            {
              image: '/images/pngs/ads/right-fit-3.png',
              text: 'You want to move from learning -> earning',
            },
          ],
          highlightText: 'This is for people ready to become the candidate companies choose.',
          firstStatement: {
            lines: [
              { text: "You didn't invest all that time learning tools to stay stuck in tutorials." },
              { text: '' },
              { text: 'At some point, you have to: ' },
              { text: 'become someone who has actually done the work.', color: 'text-[#32D987]' },
            ],
            chipText: 'This session shows you how.',
          },
          secondStatement: {
            lines: [
              { text: "You don't need more knowledge.", color: 'text-[#FF4A4A]' },
              { text: 'You need:', color: 'text-[#32D987]' },
              { text: 'Experience + proof + positioning' },
            ],
            chipText: "That's what gets you hired.",
          },
          mirrorImageSrc: '/images/pngs/ads/man-in-the-mirror.png',
          mirrorImageAlt: 'Data analytics candidate looking at confident mirror reflection',
        }}
      />
      <FooterCta
        onCtaClick={() => setIsSaveMySpotOpen(true)}
        content={{
          title: "Right now, you're close but not there yet.",
          description: 'This session shows you how to cross that gap and start showing up as someone who can actually be hired.',
          buttonText: 'Save My Spot Now',
          metaText: 'Limited seats | Free | Built for results',
        }}
      />
      <SaveMySpot isOpen={isSaveMySpotOpen} onClose={() => setIsSaveMySpotOpen(false)} />
    </div>
  )
}

export default DataAnalyticsPage
