'use client'

import { useCallback, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/page'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  fetchHeartbeatPing,
  respondHeartbeatPing,
  type HeartbeatPublic,
} from '@/lib/api/discover'
import { CheckCircle2, Home, MapPin, XCircle } from 'lucide-react'

export default function HeartbeatConfirmPage() {
  const params = useParams()
  const token = String(params.token || '')
  const load = useCallback(() => fetchHeartbeatPing(token), [token])
  const { data, loading, error, refetch } = useMockQuery(load)
  const [busy, setBusy] = useState(false)
  const [local, setLocal] = useState<HeartbeatPublic | null>(null)
  const ping = local ?? data

  const act = async (action: 'available' | 'full') => {
    setBusy(true)
    const result = await respondHeartbeatPing(token, action)
    setBusy(false)
    if (result.ok) {
      setLocal(result.data)
      refetch()
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-lg px-4 py-10">
        {loading && !ping ? (
          <LoadingState label="Opening confirm link…" />
        ) : error || !ping ? (
          <Card>
            <CardHeader>
              <CardTitle>Link not valid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>This confirm link is missing or was typed incorrectly.</p>
              <Button asChild variant="outline">
                <Link href="/">Go to Smart Living</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Vacancy check</p>
              <CardTitle className="text-2xl">{ping.name}</CardTitle>
              {ping.city ? (
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {ping.city}
                </p>
              ) : null}
              <Badge variant="outline" className="w-fit capitalize">
                {ping.targetType}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {ping.alreadyResponded ? (
                <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                  <p className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {ping.status === 'confirmed'
                      ? 'Marked still available. Thank you.'
                      : 'Marked full / rented. We hid it from public search.'}
                  </p>
                </div>
              ) : ping.expired ? (
                <p className="text-sm text-muted-foreground">
                  This link has expired. Open the owner app and tap “Still
                  available”, or wait for the next reminder.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Is this listing still available for new guests or tenants?
                    You can answer without logging in.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      className="flex-1"
                      disabled={busy}
                      onClick={() => act('available')}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Still available
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      disabled={busy}
                      onClick={() => act('full')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      It is full / rented
                    </Button>
                  </div>
                </>
              )}
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Smart Living home
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
