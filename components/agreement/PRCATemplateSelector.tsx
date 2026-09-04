'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scale, FileText, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { fetchPRCATemplates, type PRCATemplate } from '@/lib/api/documents'
import { cn } from '@/lib/utils'

interface PRCATemplateSelectorProps {
  selected: string | null
  onSelect: (templateKey: string) => void
}

export function PRCATemplateSelector({
  selected,
  onSelect,
}: PRCATemplateSelectorProps) {
  const [templates, setTemplates] = useState<PRCATemplate[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetchPRCATemplates().then(res => {
      if (res.ok && res.data) setTemplates(res.data)
    })
  }, [])

  if (!templates.length) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Scale className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">PRCA 1991 Compliant Templates</h4>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {templates.map(tmpl => (
          <Card
            key={tmpl.key}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selected === tmpl.key && 'border-primary ring-2 ring-primary/20',
            )}
            onClick={() => onSelect(tmpl.key)}
          >
            <CardHeader className="p-3 pb-1">
              <CardTitle className="flex items-start justify-between text-sm">
                <div>
                  <p>{tmpl.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">
                    {tmpl.nameBn}
                  </p>
                </div>
                {selected === tmpl.key && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[10px]">
                  {tmpl.defaultDurationMonths}mo default
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {tmpl.defaultNoticeDays}d notice
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  Max {tmpl.maxDepositMonths}mo deposit
                </Badge>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                onClick={e => {
                  e.stopPropagation()
                  setExpanded(expanded === tmpl.key ? null : tmpl.key)
                }}
              >
                <FileText className="h-3 w-3" />
                {tmpl.provisions.length} legal provisions
                {expanded === tmpl.key ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              {expanded === tmpl.key && (
                <div className="space-y-1.5 border-t pt-2">
                  {tmpl.provisions.map(p => (
                    <div key={p.key} className="text-[11px]">
                      <p className="font-medium">
                        {p.title}{' '}
                        <span className="font-normal text-muted-foreground">
                          ({p.section})
                        </span>
                      </p>
                      <p className="text-muted-foreground">{p.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
