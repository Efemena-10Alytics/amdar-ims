import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

const Testimonial = () => {
  const benefits = [
    {
      title: 'Real-World Project Experience',
      description: 'Work on structured projects that based on actual workplace delivery.',
    },
    {
      title: 'Job-Ready CV & LinkedIn Optimization',
      description: 'Turn your experience into recruiter-friendly CVs and LinkedIn profiles.',
    },
    {
      title: 'Interview Preparation & Mock Interviews',
      description: 'Practice real interview scenarios with expert feedback.',
    },
    {
      title: 'Access to Global & Remote Job Opportunities',
      description: 'Apply smarter with roles aligned to your skills and experience.',
    },
  ];

  return (
    <div className="bg-white min-h-dvh py-12 lg:py-20 relative overflow-hidden">
       {/* Ellipse Overlay */}
       <div 
        className="absolute inset-0 z-1"
        style={{
          backgroundImage: 'url(/images/svgs/testimonial-ellipse.svg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />

      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Heading and CTA */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#092A31] mb-6 leading-tight">
              Everything your Tech Career Needs
            </h2>
            <p className="text-[#092A31]/70 text-base lg:text-lg mb-8 leading-relaxed">
              We know job hunting is tough—complex, competitive, and overwhelming. That's why we built Amdari to help you access opportunities easily
            </p>
            <Button
              className={cn(
                'bg-primary text-white hover:bg-[#0f4d5a] rounded-full px-8 py-6 text-base',
                'inline-flex items-center gap-2 w-fit justify-center',
              )}
            >
              Apply now
              <div className="flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow">
                <ArrowUpRight className="w-3 h-3" color="#156374" />
              </div>
            </Button>
          </div>

          {/* Right Column - Benefits List */}
          <div className="flex flex-col gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h3 className="text-lg lg:text-xl font-bold text-[#092A31]">
                  {benefit.title}
                </h3>
                <p className="text-[#092A31]/70 text-sm lg:text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
