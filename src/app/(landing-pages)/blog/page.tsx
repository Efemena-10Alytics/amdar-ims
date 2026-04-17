import BlogContent from '@/components/_core/landing-pages/blog'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Educational resources for tech job seekers',
    description:
        'Career insights and educational contents for tech job seekers in the UK, US & Canada',
}

const BlogPage = () => {
    return (
        <div>
            <BlogContent />
        </div>
    )
}

export default BlogPage
