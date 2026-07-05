'use client'

import { useId, type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VisuallyHidden } from './VisuallyHidden'

export type ChartDataColumn = {
  key: string
  label: string
  format?: (value: string | number) => string
}

export interface AccessibleChartProps {
  title: string
  description?: string
  data: Record<string, string | number>[]
  columns: ChartDataColumn[]
  children: ReactNode
  height?: number
  caption?: string
  /** Row label key (e.g. period, month, name) */
  rowLabelKey: string
}

export function AccessibleChart({
  title,
  description,
  data,
  columns,
  children,
  height = 300,
  caption,
  rowLabelKey,
}: AccessibleChartProps) {
  const titleId = useId()
  const descId = useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle id={titleId}>{title}</CardTitle>
        {description ? (
          <p id={descId} className="text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent>
        <figure
          role="figure"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
        >
          <VisuallyHidden as="figcaption">
            {caption ?? `${title}. Data table follows for screen readers.`}
          </VisuallyHidden>
          <div
            aria-hidden="true"
            className="w-full"
            style={{ height }}
            tabIndex={0}
            role="presentation"
          >
            {children}
          </div>
          <VisuallyHidden as="span">
            <table>
              <caption>{title}</caption>
              <thead>
                <tr>
                  <th scope="col">{columns.find(c => c.key === rowLabelKey)?.label ?? 'Label'}</th>
                  {columns
                    .filter(c => c.key !== rowLabelKey)
                    .map(col => (
                      <th key={col.key} scope="col">
                        {col.label}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    <th scope="row">{String(row[rowLabelKey] ?? '')}</th>
                    {columns
                      .filter(c => c.key !== rowLabelKey)
                      .map(col => (
                        <td key={col.key}>
                          {col.format
                            ? col.format(row[col.key] ?? '')
                            : String(row[col.key] ?? '')}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </VisuallyHidden>
        </figure>
      </CardContent>
    </Card>
  )
}
