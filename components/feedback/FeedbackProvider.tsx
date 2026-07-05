'use client'

import { type ReactNode } from 'react'
import { ConfirmProvider } from './ConfirmProvider'
import { ToastProvider } from './ToastProvider'

/** Wraps toast + confirm dialog providers for the whole app. */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  return (
    <ConfirmProvider>
      {children}
      <ToastProvider />
    </ConfirmProvider>
  )
}
