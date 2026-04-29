import HeroNAExperience from '../content/hero'
import SocialProof from '../content/social-proof'
import RealProblem from '../content/real-problem'
import WhatYouWillLearn from '../content/what-you-will-learn'
import SessionBreakdown from '../content/session-breakdown'
import MarketExpectations from '../content/market-expectations'
import Faq from '../content/faq'
import FooterCta from '../../real-uk-experience/content/footer-cta'

const AppAndCloudSecurityPage = () => {
    return (
        <div className='bg-[#021013] min-h-screen'>
            <div className="p-3 text-center text-[#FFE082] bg-[#FFE0821A] font-semibold"><span className='text-white'>Only 100 free spots —</span> You have the certification. Now get the North American work experience that actually gets you hired.</div>
            <HeroNAExperience />
            <SocialProof />
            <RealProblem />
            <WhatYouWillLearn />
            <SessionBreakdown />
            <MarketExpectations />
            <Faq />
            <FooterCta
              content={{
                title: "You've done the certification. Now get the experience that gets you hired.",
                description: 'Every week without Canadian/US project experience is another week without interviews.',
                buttonText: 'Save My Spot Now',
                metaText: 'Limited seats | Free | Built for results',
              }}
            />
        </div>
    )
}

export default AppAndCloudSecurityPage
