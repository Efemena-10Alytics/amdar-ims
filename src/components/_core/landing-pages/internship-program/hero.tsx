import { ArrowRight, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const InternshipHero = () => {
  return (
    <div className="bg-[#156374] text-white">
      {/* Hero Section */}
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="text-center max-w-202.5 mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-bold mb-6 leading-16">
            Gain Work Experience Through{' '} <br />
            <span className="text-yellow-400">Cybersecurity Project</span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10">
            Join the Work Experience Platform Trusted by Aspiring Tech Professionals
            Worldwide to Build Real-World Experience and Land Your Dream Job
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              className={cn(
                "bg-[#156374] text-white hover:bg-[#0f4d5a] rounded-full px-8 py-6 text-base",
                "border-2 border-white/20 flex items-center gap-2"
              )}
            >
              Get started
              <Circle className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </Button>
            <Button
              className={cn(
                "bg-white/10 text-white hover:bg-white/20 rounded-full px-8 py-6 text-base",
                "border-2 border-white/20 flex items-center gap-2"
              )}
            >
              Learn more
              <Circle className="w-4 h-4 fill-gray-400 text-gray-400" />
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <span className="text-2xl">🇨🇦</span>
            <span className="text-2xl">🇺🇸</span>
            <span className="text-white/80">
              + 10K interns Across the world Got hired
            </span>
          </div>
        </div>
      </div>

      {/* Service Cards Section */}
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Real-world Projects */}
          <div className="bg-[#0f4d5a] rounded-lg p-6 lg:p-8">
            <h3 className="text-xl lg:text-[22px] font-bold mb-4">
              Real-world Projects
            </h3>
            <p className="text-white/80 mb-6 text-sm lg:text-base">
              Industry-relevant projects that replicate real-world challenges,
              helping you build practical skills.
            </p>
            <Button
              className={cn(
                "bg-transparent text-white hover:bg-white/10 rounded-full",
                "flex items-center gap-2 w-full justify-start"
              )}
            >
              Get me started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Card 2: Work Experience Internship */}
          <div className="bg-[#0f4d5a] rounded-lg p-6 lg:p-8">
            <h3 className="text-xl lg:text-[22px] font-bold mb-4">
              Work Experience Internship
            </h3>
            <p className="text-white/80 mb-6 text-sm lg:text-base">
              Work experience internship with businesses that will connect you
              with global work opportunities and mentorship
            </p>
            <Button
              className={cn(
                "bg-transparent text-white hover:bg-white/10 rounded-full",
                "flex items-center gap-2 w-full justify-start"
              )}
            >
              Apply now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Card 3: Interview Prep */}
          <div className="bg-[#0f4d5a] rounded-lg p-6 lg:p-8">
            <h3 className="text-xl lg:text-[22px] font-bold mb-4">
              Interview Prep
            </h3>
            <p className="text-white/80 mb-6 text-sm lg:text-base">
              We help you prepare for interviews by revamping your CV and
              coaching you on acing technical questions.
            </p>
            <Button
              className={cn(
                "bg-transparent text-white hover:bg-white/10 rounded-full",
                "flex items-center gap-2 w-full justify-start"
              )}
            >
              I need this
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternshipHero
