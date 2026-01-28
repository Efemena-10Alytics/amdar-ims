import React from 'react'
import Left from '@/components/_core/landing-pages/internship-program/internship-details/left'
import Right from '@/components/_core/landing-pages/internship-program/internship-details/right'
import Project from '@/components/_core/landing-pages/internship-program/project'

const InternshipProgramDetails = () => {
  return (
    <div className="bg-white">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Left />
          </div>
          <div className="lg:col-span-1">
            <Right />
          </div>
        </div>
      </div>
      <Project />
    </div>
  )
}

export default InternshipProgramDetails
