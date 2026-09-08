'use client'

import { type ReactNode, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export type OnboardingStep = {
  title: string
  description: string
  icon?: ReactNode
  content?: ReactNode
}

export function OnboardingWizard({
  open,
  onOpenChange,
  title,
  subtitle,
  steps,
  onComplete,
  onSkip,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  steps: OnboardingStep[]
  onComplete: () => void
  onSkip?: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const step = steps[stepIndex]
  const progress = ((stepIndex + 1) / steps.length) * 100
  const isLast = stepIndex === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      onComplete()
      onOpenChange(false)
      setStepIndex(0)
      return
    }
    setStepIndex(i => i + 1)
  }

  const handleSkip = () => {
    onSkip?.()
    onComplete()
    onOpenChange(false)
    setStepIndex(0)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={v => {
        if (!v) setStepIndex(0)
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-w-lg gap-0 p-0 sm:p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Getting started
              </span>
            </div>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            {subtitle ? (
              <DialogDescription>{subtitle}</DialogDescription>
            ) : null}
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Step {stepIndex + 1} of {steps.length}
              </span>
              <span>{step.title}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex gap-4">
            {step.icon ? (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {step.icon}
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {step.content ? (
                <div className="mt-4">{step.content}</div>
              ) : null}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-between border-t bg-muted/30 px-6 py-4 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(stepIndex === 0 && 'invisible')}
            onClick={() => setStepIndex(i => Math.max(0, i - 1))}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            {onSkip ? (
              <Button type="button" variant="outline" size="sm" onClick={handleSkip}>
                Skip for now
              </Button>
            ) : null}
            <Button type="button" size="sm" onClick={handleNext}>
              {isLast ? 'Get started' : 'Next'}
              {!isLast ? <ChevronRight className="ml-1 h-4 w-4" /> : null}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
