'use client'

import { Layout } from '@/components/layout/Layout'

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
          About Smart Living Ecosystem
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Smart Living Ecosystem is a comprehensive platform designed to
            revolutionize the property rental market in Bangladesh. We connect
            renters with property owners, making the process of finding and
            managing properties seamless and efficient.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Our mission is to provide a secure, user-friendly platform that
            benefits both renters and property owners, fostering a thriving
            rental ecosystem across Bangladesh.
          </p>
        </div>
      </div>
    </Layout>
  )
}
