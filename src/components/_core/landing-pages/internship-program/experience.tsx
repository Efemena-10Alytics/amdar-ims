"use client";

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const Experience = () => {
  const [activeTab, setActiveTab] = useState('Internship');

  const tabs = [
    { id: 'Internship', label: 'Internship' },
    { id: 'Real-world Projects', label: 'Real-world Projects' },
    { id: 'Talent loop', label: 'Talent loop' },
  ];

  const careerCards = [
    {
      id: 'data-analytics',
      title: 'Data Analytics',
      description: 'Turn complex data into insights that drive decisions. Build dashboards, reports, analytical models, and documentation teams actually use.',
      image: '/images/careers/data-analytics.jpg', // Placeholder path
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Protect systems, analyze threats, investigate incidents, run assessments, and apply industry frameworks used by modern security teams.',
      image: '/images/careers/cybersecurity.jpg', // Placeholder path
    },
  ];

  return (
    <div className="bg-gray-50 py-12 lg:py-20">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Instructional Text */}
        <p className="text-sm text-gray-500 mb-4">Use switch tab</p>

        {/* Main Container */}
        <div className="bg-gray-100 rounded-2xl p-6 lg:p-8">
          {/* Tab Navigation */}
          <div className="flex justify-end mb-6">
            <div className="flex gap-2 bg-white rounded-full p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-6 py-2 rounded-full text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Promotional CTA */}
            <div className="lg:col-span-1 bg-primary rounded-2xl p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                  Gain global work experience in any of these careers
                </h2>
                <p className="text-white/70 text-sm mb-6">
                  Some of our current Work Experience Programmes
                </p>
              </div>
              <Button
                className={cn(
                  'bg-primary text-white hover:bg-[#0f4d5a] rounded-full',
                  'flex items-center gap-2 w-full justify-center'
                )}
              >
                View more
                <div className="flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow">
                  <ArrowUpRight className="w-3 h-3" color="#156374" />
                </div>
              </Button>
            </div>

            {/* Right Section - Career Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {careerCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Card Image */}
                  <div className="relative w-full h-48 bg-gray-200">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image doesn't exist
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E' + card.title + '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {card.description}
                    </p>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                    >
                      Explore course
                      <div className="flex h-6 w-6 rounded-full justify-center items-center bg-primary">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
