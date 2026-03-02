'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Shield, CheckCircle2, FileCheck, Lock, Award, Users } from 'lucide-react'

const trustFeatures = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Verified Listings',
    description: 'All properties verified with NID, documents, and background checks.',
  },
  {
    icon: <FileCheck className="h-6 w-6" />,
    title: 'Document Verification',
    description: 'Property owners verified with government-issued documents.',
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: 'Secure Payments',
    description: 'Encrypted payment processing with bKash, Nagad, and Rocket integration.',
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Trust Badge System',
    description: 'Earn trust badges for verified properties and reliable owners.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Community Reviews',
    description: 'Read reviews from real renters and make informed decisions.',
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: 'Fraud Protection',
    description: 'Advanced fraud detection and dispute management system.',
  },
]

export function TrustSection() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">Trust & Security</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Your Safety is Our Priority
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We verify every listing, owner, and transaction to ensure a safe and secure experience.
          </p>
        </div>

        {/* Trust Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trustFeatures.map((feature, index) => (
            <Card
              key={index}
              className="group border-2 transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
