import FooterCta from '../content/footer-cta'
import Hero from '../content/hero'
import RealIssuesTwo from '../content/real-issues-data-scientist'
import RightFit from '../content/right-fit'
import SessionBreakdown from '../content/session-breakdown'
import WhatThisUnlocks from '../content/what-this-unlocks'
import YourOutcome from '../content/your-outcome'

const dataScientistHeroContent = {
  badge: 'Amdari - Free Data Science Job Readiness Workshops',
  headingStart: 'Become a Data Scientist with real',
  headingHighlight: 'UK experience',
  headingEnd: 'not just course projects.',
  description:
    "This free session shows you how to build the kind of evidence that makes UK employers take you seriously even if you've never worked in cybersecurity before.",
  ctaText: 'Save My Spot',
  liveFeedTitle: 'MODEL: CHURN PREDICTION - v2.4',
  feedItems: [
    { time: ' ', text: 'xgb = XGBClassifier()' },
    { time: ' ', text: 'from sklearn.metrics import classification_report' },
    { time: ' ', text: 'y_pred = model.predict(X_test)' },
    { time: ' ', text: 'print(classification_report(y_test, y_pred))' },
    { time: ' ', text: 'precision recall f1-score support' },
    { time: ' ', text: 'accuracy 0.88' },
  ],
  statCards: [
    { label: 'Accuracy', value: '88%', valueColor: 'text-[#4DA3FF]' },
    { label: 'F1 Score', value: '0.87', valueColor: 'text-[#40E0A0]' },
    { label: 'Business Impact', value: '£2.1M saved', valueColor: 'text-[#FFE082]' },
    { label: 'Status', value: 'Deployed', valueColor: 'text-[#32D987]' },
  ],
}

const dataScientistOutcomeContent = {
  eyebrow: '- Your Outcome',
  title: 'This is who you become',
  imageSrc: '/images/pngs/ads/your-outcome.png',
  imageAlt: 'Data science candidate with practical UK-ready profile',
  outcomes: [
    'Someone with real Data Science work on your CV',
    "Someone who can explain what they have done - not what they've learned",
    'Someone who walks into interviews with proof, not pressure',
    "Someone recruiters don't ignore",
  ],
}

const dataScientistUnlocksContent = {
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
      description: 'Position yourself as someone who can ship results not someone still figuring it out.',
    },
  ],
}

const dataScientistSessionBreakdownContent = {
  eyebrow: '- Session Breakdown',
  title: "What you'll walk away with",
  subtitle: "Five concrete things you'll know by the end of this session.",
  points: [
    'What UK Data Science roles actually expect - beyond theory and tutorials',
    'What your portfolio and CV is missing and what to fix first',
    'How to get real project experience without needing a job offer first',
    'How to explain your work clearly in interviews - with confidence, not rehearsed lines',
    'Your exact next step - based on where you actually are right now',
  ],
  imageSrc: '/images/pngs/ads/season-breakdown.png',
  imageAlt: 'Professional woman walking confidently outdoors',
}

const dataScientistRightFitContent = {
  eyebrow: '- Right Fit',
  title: 'Who this is for',
  subtitle: 'This session is built for one specific moment in your journey.',
  cards: [
    {
      image: '/images/pngs/ads/right-fit-1.png',
      text: "You've learned Data Science but don't feel job-ready yet",
    },
    {
      image: '/images/pngs/ads/right-fit-2.png',
      text: "You've building projects but not getting interview callbacks",
    },
    {
      image: '/images/pngs/ads/right-fit-3.png',
      text: 'You want to move from learning to real-world application',
    },
  ],
  highlightText: 'This is for people ready to become Data Scientists - not just study it.',
  firstStatement: {
    lines: [
      { text: "You didn't spend months learning Python and ML to stay " },
      { text: 'stuck in tutorials.', color: 'text-[#32D987]' },
      { text: 'At some point, you have to become someone who can ' },
      { text: 'actually apply it.', color: 'text-[#32D987]' },
    ],
    chipText: 'This is that shift.',
  },
  secondStatement: {
    lines: [
      { text: "You don't need more models.", color: 'text-[#FF4A4A]' },
      { text: 'You need:', color: 'text-[#32D987]' },
      { text: 'real problem-solving experience + clear communication + proof.' },
    ],
    chipText: "That's what gets you hired.",
  },
  mirrorImageSrc: '/images/pngs/ads/man-in-the-mirror.png',
  mirrorImageAlt: 'Data science candidate reviewing professional growth in mirror',
}

const dataScientistFooterCtaContent = {
  title: "Right now, you're learning. This session shows you how to cross into doing.",
  description:
    'Start showing up as someone companies can actually hire. One free session. Real, practical next steps. No fluff to theory but the shift that changes how the market sees you.',
  buttonText: 'Save My Spot Now',
  metaText: 'Limited seats | Free | Built for results',
}

const DataScientistPage = () => {
  return (
    <div className='bg-[#021013] min-h-screen'>
      <Hero content={dataScientistHeroContent} />
      <YourOutcome content={dataScientistOutcomeContent} />
      <RealIssuesTwo />
      <WhatThisUnlocks content={dataScientistUnlocksContent} />
      <SessionBreakdown content={dataScientistSessionBreakdownContent} />
      <RightFit content={dataScientistRightFitContent} />
      <FooterCta content={dataScientistFooterCtaContent} />
    </div>
  )
}

export default DataScientistPage
