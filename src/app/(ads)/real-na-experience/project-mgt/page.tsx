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

const ProjectManagement = () => {
    const [isSaveMySpotOpen, setIsSaveMySpotOpen] = React.useState(false)

    return (
        <div className='bg-[#021013] min-h-screen'>
            <div className="p-3 text-center text-[#FFE082] bg-[#FFE0821A] font-semibold"><span className='text-white'>Only 100 free spots —</span> You have the certification. Now get the North American work experience that actually gets you hired.</div>
            <HeroNAExperience
              onCtaClick={() => setIsSaveMySpotOpen(true)}
              content={{
                badge: 'Free - Project Management Job Readiness Workshop',
                titleBeforeHighlight: "You've got the certification. You've applied to dozens of",
                titleHighlight: 'Project Management roles',
                titleAfterHighlight: 'in Canada or the US.',
                finalHighlight: 'Still no callbacks.',
                descriptionOne:
                  "The issue isn't your PMP, PRINCE2, or Agile certification, it's the lack of local (Canadian/US) project experience on your CV.",
                descriptionTwo:
                  'This free 60-minute workshop shows you how to gain portfolio-ready North American PM experience, position it correctly, and start getting interviews even as an immigrant or career switcher.',
                ctaText: 'Save My Free Spot',
                metaItems: ['100% free', '60 minutes', 'Recording included'],
                imageSrc: '/images/pngs/ads/woman.png',
                imageAlt: 'Project manager applicant feeling stuck despite many applications',
                emojiChip: '🇨🇦🇺🇸',
                stats: [
                  { value: '39%', label: 'SAY "NO LOCAL EXPERIENCE" IS THEIR #1 BARRIER' },
                  { value: '43%', label: 'JOINED AMDARI FOR EXPERIENCE, NOT MORE COURSES' },
                  { value: '29%', label: 'ARE IMMIGRANTS OR CAREER SWITCHERS' },
                  { value: '90%', label: 'WANT RESULTS WITHIN 1-3 MONTHS' },
                ],
              }}
            />
            <SocialProof heading="If you're struggling to land Project Management roles in Canada or the US:" />
            <RealProblem
              title="Why you're being filtered out"
              firstPoint="You've did the certifications. You learned the frameworks. You applied."
              secondPointPrefix="But hiring managers are filtering for one thing:"
              secondPointHighlight="proof of real project delivery in a North American context."
              thirdPoint=""
              calloutText="No local experience = no interviews. This workshop fixes that."
            />
            <WhatYouWillLearn
              title="Five things that change your position in the market"
              points={[
                "Why certifications alone don't get you hired in Canada/US",
                'What "real PM experience" looks like on a North American CV',
                'How to gain project experience without a job first',
                'How to talk about your work in interviews (not just your certification)',
                'Your exact next step to start getting interviews within weeks',
              ]}
            />
            <SessionBreakdown
              content={{
                eyebrow: '- Session Breakdown',
                titleLines: ['60 minutes', 'that', 'changes your', 'trajectory'],
                items: [
                  { range: '00-10 min', title: "Why you're being overlooked and why it's fixable" },
                  { range: '10-25 min', title: 'How to build real governance and compliance experience' },
                  { range: '25-40 min', title: 'How to build real PM experience (fast)' },
                  { range: '40-55 min', title: 'Turning that into interviews and offers' },
                  { range: '55-60 min', title: 'Live Q&A, your situation answered directly' },
                ],
              }}
            />
            <MarketExpectations
              topTitle="This is where people stop being filtered out"
              topItems={[
                { text: 'Real project experience (not simulations)', icon: <SecuritySvg /> },
                { text: 'CVs rewritten around actual deliverables', icon: <FilesSvg /> },
                { text: 'Mentorship from working PMs in global markets', icon: <GlobeSvg /> },
                { text: 'Built for immigrants trying to break into Canada/US job markets', icon: <MarketSvg /> },
              ]}
              bottomTitle="What employers in Canada & the US expect"
              bottomItems={[
                { text: 'Project planning & scheduling' },
                { text: 'Risk & issue management (RAID logs)' },
                { text: 'Stakeholder communication' },
                { text: 'Agile (Scrum, standups, sprint planning)' },
                { text: 'Tools: Jira, MS Project, Excel, Confluence' },
              ]}
            />
            <Faq
              onCtaClick={() => setIsSaveMySpotOpen(true)}
              ctaTitle="Your free seat is waiting"
              ctaDescription="For aspiring Project Management professionals in Canada and the US who are done being overlooked."
              ctaButtonText="Save My Spot Now"
              ctaMeta={['Live on Google Meet Attend from anywhere', '60 minutes (Live Q&A)', 'Free! Limited to 100 spots']}
            />
            <FooterCta
              onCtaClick={() => setIsSaveMySpotOpen(true)}
              content={{
                title: "You've done the certification. Now get the experience that gets you hired.",
                description: 'Every week without Canadian/US project experience is another week without interviews.',
                buttonText: 'Save My Spot Now',
                metaText: 'Limited seats | Free | Built for results',
              }}
            />
            <SaveMySpot isOpen={isSaveMySpotOpen} onClose={() => setIsSaveMySpotOpen(false)} region='BA_PM_WhatsappLinkNA' />
        </div>
    )
}

export default ProjectManagement
