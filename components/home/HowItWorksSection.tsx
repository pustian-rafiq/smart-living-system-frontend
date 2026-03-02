'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Search, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Search & Discover',
    description: 'Browse verified properties by city, area, price, and amenities. Use filters to find exactly what you need.',
    icon: <Search className="h-8 w-8" />,
  },
  {
    number: '02',
    title: 'Connect & Chat',
    description: 'Chat directly with property owners. Ask questions, view photos, and get instant responses.',
    icon: <MessageCircle className="h-8 w-8" />,
  },
  {
    number: '03',
    title: 'Book & Pay',
    description: 'Book instantly or request a seat. Pay securely with bKash, Nagad, or Rocket. Get instant confirmation.',
    icon: <CheckCircle className="h-8 w-8" />,
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-muted/50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get started in three simple steps. Find, connect, and book your perfect living space.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 lg:block" />
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="group relative h-full border-2 transition-all duration-300 hover:border-primary hover:shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    {/* Step Number */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary transition-transform duration-300 group-hover:scale-110">
                        {step.number}
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="hidden h-6 w-6 text-muted-foreground lg:block" />
                      )}
                    </div>

                    {/* Icon */}
                    <div className="mb-4 text-primary">
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
