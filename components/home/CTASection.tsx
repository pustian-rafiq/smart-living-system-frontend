'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Building2, CheckCircle } from 'lucide-react'
import { isLoggedIn } from '@/utils/auth'

export function CTASection() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
  }, [])

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Ready to Get Started?
            </CardTitle>
            <CardDescription className="mx-auto max-w-2xl text-lg">
              Join thousands of users who are already using Smart Living Ecosystem to find and manage properties in Bangladesh.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="group w-full sm:w-auto"
              onClick={() => router.push(loggedIn ? '/search' : '/login')}
            >
              <Search className="mr-2 h-5 w-5" />
              {loggedIn ? 'Browse Properties' : 'Find Accommodation'}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push(loggedIn ? '/dashboard' : '/login')}
            >
              <Building2 className="mr-2 h-5 w-5" />
              {loggedIn ? 'Manage Properties' : 'List Your Property'}
            </Button>
          </CardContent>
          
          {/* Benefits List */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 px-6 pb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free to browse</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Verified listings</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>24/7 support</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
