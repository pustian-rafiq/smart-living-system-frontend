'use client'

import { Layout } from '@/components/layout/Layout'

export default function RentalsPage() {
  return (
    <Layout>
      <div className="mx-auto w-full max-w-[480px] space-y-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Rentals
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Placeholder page. View and manage your rental agreements here.
        </p>
      </div>
    </Layout>
  )
}
