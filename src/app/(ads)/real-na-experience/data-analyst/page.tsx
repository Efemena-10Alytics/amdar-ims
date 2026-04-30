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

const dataAnalystHeroContent = {
    badge: 'Free Data Analyst Job Readiness Workshop (Canada & US)',
    titleBeforeHighlight: "You've done the courses. Built dashboards. Applied to",
    titleHighlight: 'Data Analyst roles',
    titleAfterHighlight: 'in Canada or the US.',
    finalHighlight: 'Still no callbacks.',
    descriptionOne:
        "The issue isn't your skills - it's the lack of real Canadian/US data analysis experience on your CV.",
    descriptionTwo:
        'This free 60-minute workshop shows you how to gain portfolio-ready data experience, position it properly, and start getting interviews - even as an immigrant or career switcher.',
    ctaText: 'Save My Free Spot',
    metaItems: ['100% free', '60 minutes', 'Recording included'] as [string, string, string],
    imageSrc: '/images/pngs/ads/woman.png',
    imageAlt: 'Data analyst stressed after repeated job application rejections',
    emojiChip: '🇨🇦🇺🇸',
    stats: [
        { value: '39%', label: 'SAY NO LOCAL EXPERIENCE IS THEIR #1 BARRIER' },
        { value: '43%', label: 'JOINED AMDARI TO BECOME EMPLOYABLE WITH REAL EXPERIENCE, NOT MORE COURSES' },
        { value: '29%', label: 'ARE IMMIGRANTS OR CAREER SWITCHERS' },
        { value: '90%', label: 'WANT RESULTS WITHIN 1-3 MONTHS' },
    ],
}

const dataAnalystFaqs = [
    { id: 'free', question: 'Is it free?', answer: 'Yes. This workshop is 100% free.' },
    {
        id: 'projects',
        question: "I've built projects, why no job?",
        answer: 'Because employers are screening for real business impact and local context, not just project completion.',
    },
    {
        id: 'newcomer',
        question: "I'm new to Canada/US can this help?",
        answer: 'Yes. This is designed for immigrants and career switchers trying to break into the market quickly.',
    },
    {
        id: 'miss',
        question: 'What if I miss the live session?',
        answer: "You'll still get the recording, but joining live gives you direct Q&A for your specific situation.",
    },
]

const AppAndCloudSecurityPage = () => {
    const [isSaveMySpotOpen, setIsSaveMySpotOpen] = React.useState(false)

    return (
        <div className='bg-[#021013] min-h-screen'>
            <div className="p-3 text-center text-[#FFE082] bg-[#FFE0821A] font-semibold"><span className='text-white'>Only 100 free spots —</span> You have the certification. Now get the North American work experience that actually gets you hired.</div>
            <HeroNAExperience
                content={dataAnalystHeroContent}
                onCtaClick={() => setIsSaveMySpotOpen(true)}
            />
            <SocialProof heading="If you’re struggling to land Business Analyst roles in Canada or the US:" />
            <RealProblem
                title="Why you're being filtered out"
                firstPoint="You've learned Excel. You know SQL. You've built dashboards."
                secondPointPrefix="But hiring managers are filtering for one thing:"
                secondPointHighlight="proof you've solved real business problems with data."
                thirdPoint=""
                calloutText="No local experience = no interviews. This workshop fixes that."
            />
            <WhatYouWillLearn
                title="Five things that change your position in the market"
                points={[
                    "Why courses and portfolio projects alone don't get you hired",
                    'What real Data Analyst experience looks like on a North American CV',
                    'How to gain hands-on data experience without a job first',
                    'How to talk about dashboards, insights, and impact in interviews',
                    'Your next step to start getting interviews within weeks',
                ]}
            />
            <SessionBreakdown
                content={{
                    eyebrow: '- Session Breakdown',
                    titleLines: ['60 minutes', 'that', 'changes your', 'trajectory'],
                    items: [
                        { range: '00-10 min', title: 'Why "no local experience" blocks DA roles' },
                        { range: '10-25 min', title: 'What employers in Canada/US actually look for' },
                        { range: '25-40 min', title: 'How to build real data experience fast' },
                        { range: '40-55 min', title: 'CV, LinkedIn & interview positioning' },
                        { range: '55-60 min', title: 'Live Q&A, your situation answered directly' },
                    ],
                }}
            />
            <MarketExpectations
                topTitle="This is where people stop being filtered out"
                topItems={[
                    { text: 'Real business data projects (not just practice datasets)', icon: <SecuritySvg /> },
                    { text: 'CV built around actual business insights & impact', icon: <FilesSvg /> },
                    { text: 'Mentorship from professionals in global markets', icon: <GlobeSvg /> },
                    { text: 'Designed for immigrants breaking into Canada/US data roles', icon: <MarketSvg /> },
                ]}
                bottomTitle="What employers in Canada & the US expect"
                bottomItems={[
                    { text: 'Excel (advanced functions, data cleaning)' },
                    { text: 'SQL for querying and analysis' },
                    { text: 'Data visualization (Power BI, Tableau)' },
                    { text: 'Data cleaning & transformation' },
                    { text: 'Business insight generation' },
                    { text: 'Stakeholder communication' },
                ]}
            />
            <Faq
                onCtaClick={() => setIsSaveMySpotOpen(true)}
                items={dataAnalystFaqs}
                ctaTitle="Your free seat is waiting"
                ctaDescription="For aspiring Data Analyst professionals in Canada and the US who are done being overlooked."
                ctaButtonText="Save My Spot Now"
                ctaMeta={['Live on Google Meet Attend from anywhere', '60 minutes (Live Q&A)', 'Free! Limited to 100 spots']}
            />
            <FooterCta
              onCtaClick={() => setIsSaveMySpotOpen(true)}
              content={{
                title: "You've learned the tools. Now get the experience that gets you hired.",
                description: 'Without Canadian/US data experience, your applications will keep getting filtered.',
                buttonText: 'Save My Spot Now',
                metaText: 'Limited seats | Free | Built for results',
              }}
            />
            <SaveMySpot isOpen={isSaveMySpotOpen} onClose={() => setIsSaveMySpotOpen(false)}  region='data_WhatsappLinkNA' />
        </div>
    )
}

export default AppAndCloudSecurityPage
