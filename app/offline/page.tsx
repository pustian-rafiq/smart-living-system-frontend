'use client'

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-2xl font-semibold">You are offline</h1>
      <p className="text-sm text-muted-foreground">
        SmartBasa cached this shell. Reconnect to browse live listings, mess
        status, and messages.
      </p>
    </main>
  )
}
