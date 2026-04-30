"use client"

import React from 'react'
import HeroNAExperience from '../content/hero'
import SocialProof from '../content/social-proof'
import RealProblem from '../content/real-problem'
import WhatYouWillLearn from '../content/what-you-will-learn'
import SessionBreakdown from '../content/session-breakdown'
import MarketExpectations from '../content/market-expectations'
import Faq from '../content/faq'
import FooterCta from '../../real-uk-experience/content/footer-cta'
import SaveMySpot from '../../real-uk-experience/content/save-my-spot'
import { FilesSvg, GlobeSvg, MarketSvg, SecuritySvg } from '../../real-uk-experience/content/svg'

const BusinessAnalysisPage = () => {
    const [isSaveMySpotOpen, setIsSaveMySpotOpen] = React.useState(false)

    return (
        <div className='bg-[#021013] min-h-screen'>
            <div className="p-3 text-center text-[#FFE082] bg-[#FFE0821A] font-semibold"><span className='text-white'>Only 100 free spots —</span> You have the certification. Now get the North American work experience that actually gets you hired.</div>
            <HeroNAExperience
              onCtaClick={() => setIsSaveMySpotOpen(true)}
              content={{
                badge: 'Free - Business Analysis Job Readiness Workshop',
                titleBeforeHighlight: "You've done the courses. Learned the frameworks. Applied to",
                titleHighlight: 'Business Analysis roles',
                titleAfterHighlight: 'in Canada or the US.',
                finalHighlight: 'Still no callbacks.',
                descriptionOne:
                  "The issue isn't your knowledge, it's the lack of real Canadian/US business analysis experience on your CV.",
                descriptionTwo:
                  "This free 60-minute workshop shows you how to gain portfolio-ready BA experience, position it properly, and start getting interviews even if you've never held the Business Analyst title.",
                ctaText: 'Save My Free Spot',
                metaItems: ['100% free', '60 minutes', 'Recording included'],
                imageSrc: '/images/pngs/ads/woman.png',
                imageAlt: 'Business analyst applicant feeling stuck despite many applications',
                emojiChip: '🇨🇦🇺🇸',
                stats: [
                  { value: '39%', label: 'SAY "NO LOCAL EXPERIENCE" IS THEIR BIGGEST BARRIER' },
                  { value: '43%', label: 'JOINED AMDARI FOR REAL WORK EXPERIENCE, NOT MORE COURSES' },
                  { value: '29%', label: 'ARE IMMIGRANTS OR CAREER SWITCHERS' },
                  { value: '90%', label: 'WANT RESULTS WITHIN 1-3 MONTHS' },
                ],
              }}
            />
            <SocialProof
              heading="If you're struggling to land Business Analyst roles in Canada or the US:"
              cards={[
                {
                  imageSrc: '/images/pngs/ads/proof-1.png',
                  title: 'Immigrants',
                  subtitle: 'You can break into Canadian experience',
                },
                {
                  imageSrc: '/images/pngs/ads/proof-2.png',
                  title: 'Career switchers',
                  subtitle: 'Moving from no local experience to project roles',
                },
                {
                  imageSrc: '/images/pngs/ads/proof-3.png',
                  title: 'Job seekers',
                  subtitle: 'Applying and still getting no interviews',
                },
                {
                  imageSrc: '/images/pngs/ads/proof-4.png',
                  title: 'Professionals',
                  subtitle: 'Turning skills into confidence that gets noticed',
                },
              ]}
            />
            <RealProblem
              title="Why you're being filtered out"
              firstPoint="You've studied Agile. You understand requirements. You've done courses."
              secondPointPrefix="But hiring managers are filtering for one thing:"
              secondPointHighlight="proof you've worked with real stakeholders and delivered real requirements."
              thirdPoint=""
              calloutText="No local experience = no interviews. This workshop fixes that."
            />
            <WhatYouWillLearn
              title="Five things that change your position in the market"
              points={[
                "Why BA courses and certifications alone don't get you hired",
                'What real Business Analysis experience looks like on a North American CV',
                'How to gain hands-on BA experience without a job first',
                'How to talk about requirements, stakeholders, and projects in interviews',
                'Your next step to start getting interviews within weeks',
              ]}
            />
            <SessionBreakdown
              content={{
                eyebrow: '- Session Breakdown',
                titleLines: ['60 minutes', 'that', 'changes your', 'trajectory'],
                items: [
                  { range: '00-10 min', title: "Why you're being overlooked and why it's fixable" },
                  { range: '10-25 min', title: 'How to build real governance and compliance experience' },
                  { range: '25-40 min', title: 'How to gain hands-on BA experience without a job first' },
                  { range: '40-55 min', title: 'Turning that into interviews and offers' },
                  { range: '55-60 min', title: 'Live Q&A, your situation answered directly' },
                ],
              }}
            />
            <MarketExpectations
              topTitle="This is where people stop being filtered out"
              topItems={[
                { text: 'Real security projects not labs', icon: <SecuritySvg /> },
                { text: 'CV built around actual findings', icon: <FilesSvg /> },
                { text: 'Mentorship from working security professionals', icon: <GlobeSvg /> },
                { text: 'Built for immigrants & career switchers', icon: <MarketSvg /> },
              ]}
              bottomTitle="What employers in Canada & the US expect"
              bottomItems={[
                { text: 'OWASP Top 10', subtext: 'Practical application not just knowing the list' },
                { text: 'Cloud security', subtext: 'AWS, Azure, GCP posture & misconfig analysis' },
                { text: 'SAST & DAST', subtext: 'Burp Suite, Snyk, and real output' },
                { text: 'Secure code review', subtext: 'Finding and documenting flaws in real codebases' },
                { text: 'Threat modelling', subtext: 'STRIDE, attack surface fundamentals' },
                { text: 'API & web security', subtext: 'Auth flaws, injection, and access control issues' },
              ]}
            />
            <Faq
              onCtaClick={() => setIsSaveMySpotOpen(true)}
              ctaTitle="Your free seat is waiting"
              ctaDescription="For aspiring Business Analysis professionals in Canada and the US who are done being overlooked."
              ctaButtonText="Save My Spot Now"
              ctaMeta={['Live on Google Meet Attend from anywhere', '60 minutes (Live Q&A)', 'Free! Limited to 100 spots']}
            />
            <FooterCta
              onCtaClick={() => setIsSaveMySpotOpen(true)}
              content={{
                title: "You've learned the frameworks. Now get the experience that gets you hired.",
                description: 'Without Canadian/US Business Analysis experience, your applications will keep getting filtered.',
                buttonText: 'Save My Spot Now',
                metaText: 'Limited seats | Free | Built for results',
              }}
            />
            <SaveMySpot isOpen={isSaveMySpotOpen} onClose={() => setIsSaveMySpotOpen(false)} region='BA_PM_WhatsappLinkNA' />
        </div>
    )
}

export default BusinessAnalysisPage
