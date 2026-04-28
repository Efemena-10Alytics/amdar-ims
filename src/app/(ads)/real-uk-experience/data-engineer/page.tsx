import FooterCta from '../content/footer-cta'
import HeroDataEngineer from '../content/hero-data-engineer'
import RealIssuesTwo from '../content/real-issues-data-scientist'
import SessionBreakdownDataEngineer from '../content/session-breakdown-data-engineer'
import SocialProof from '../content/social-proof'
import WhatThisUnlocks from '../content/what-this-unlocks'
import YourOutcome from '../content/your-outcome'

const DataEngineerPage = () => {
  return (
    <div className='bg-[#021013] min-h-screen'>
      <div className="p-3 text-center text-[#FFE082] bg-[#FFE0821A] font-semibold">
        Only 100 spots - This is where you stop learning and start becoming the candidate companies trust.
      </div>
      <HeroDataEngineer />
      <YourOutcome />
      <RealIssuesTwo
        title="This Is the Difference Between Learning and Being Hired"
        subtitle="UK companies don't hire based on what you know. They hire based on what you've handled."
        leftLabel="Ignored"
        rightLabel="After This"
        leftPoints={['"I\'ve used Airflow"']}
        rightPoints={['"I built and managed pipelines that moved production data, handled failures, and supported real decisions."']}
      />
      <WhatThisUnlocks
        content={{
          eyebrow: '- What This Unlocks',
          title: "You Don't Leave With Notes, You Leave With Direction",
          items: [
            {
              number: '01',
              title: 'A Data Engineer with real pipeline experience',
              description: 'Not tutorial repetition actual production-level work that holds up in an interview.',
            },
            {
              number: '02',
              title: "Someone who explains systems they've built",
              description: "Not concepts they've studied - real narratives that command respect in any room.",
            },
            {
              number: '03',
              title: 'A candidate with proof of infrastructure work',
              description: 'Not just tools listed on a CV evidence of decisions made and problems solved.',
            },
          ],
        }}
      />
      <SessionBreakdownDataEngineer />
      <SocialProof />
      <FooterCta
        content={{
          title: 'You Can Keep Learning Or You Can Become Hireable.',
          description:
            "Right now, you're one decision away from changing how the market sees you. Not by learning more - by becoming someone who has done the work. This session shows you how to make that shift, fast.",
          buttonText: 'Save My Spot Now',
          metaText: 'Limited seats | Free | Built for results',
        }}
      />
    </div>
  )
}

export default DataEngineerPage
