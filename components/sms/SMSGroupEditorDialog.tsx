'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Users } from 'lucide-react'
import type { SMSGroup } from '@/types/sms'
import { fetchMessStudents } from '@/lib/api/mess'
import { ok } from '@/lib/api/http'
import { useMockQuery } from '@/hooks/useMockQuery'

const smsGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().optional(),
  memberIds: z.array(z.string()).min(1, 'Select at least one member'),
})

type SMSGroupFormValues = z.infer<typeof smsGroupSchema>

function asIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(String).filter(Boolean)
}

interface SMSGroupEditorDialogProps {
  group?: SMSGroup | null
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>
}

/** SMS group create/edit dialog — uses plain Label (not FormLabel) to avoid FormField context crashes. */
export function SMSGroupEditorDialog({
  group,
  messId,
  open,
  onOpenChange,
  onSubmit,
}: SMSGroupEditorDialogProps) {
  const [saving, setSaving] = useState(false)
  const loadStudents = useCallback(
    () => (open ? fetchMessStudents(messId) : Promise.resolve(ok([]))),
    [open, messId]
  )
  const { data: students, loading: studentsLoading } = useMockQuery(loadStudents)
  const messStudents = Array.isArray(students)
    ? students.filter(s => s && (s.seatNumber || s.name))
    : []

  const form = useForm<SMSGroupFormValues>({
    resolver: zodResolver(smsGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      memberIds: [],
    },
  })

  const selectedMembers = asIdList(form.watch('memberIds'))
  const errors = form.formState.errors

  useEffect(() => {
    if (!open) return
    if (group) {
      form.reset({
        name: group.name || '',
        description: group.description || '',
        memberIds: asIdList(group.memberIds),
      })
    } else {
      form.reset({
        name: '',
        description: '',
        memberIds: [],
      })
    }
  }, [group, open, form])

  const handleSubmit = form.handleSubmit(async data => {
    setSaving(true)
    try {
      await onSubmit({
        ...data,
        messId,
        memberIds: asIdList(data.memberIds),
      })
      form.reset()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  })

  const toggleMember = (studentId: string, checked: boolean) => {
    const current = asIdList(form.getValues('memberIds'))
    const next = checked
      ? Array.from(new Set([...current, studentId]))
      : current.filter(id => id !== studentId)
    form.setValue('memberIds', next, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-h-[85vh] sm:p-0">
        <DialogHeader className="shrink-0 space-y-1.5 px-6 pb-2 pt-6 pr-12 text-left">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {group ? 'Edit SMS Group' : 'Create SMS Group'}
          </DialogTitle>
          <DialogDescription>
            Create groups of students for easy bulk messaging
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-2">
            <div className="space-y-4 pb-2">
              <div className="space-y-2">
                <Label htmlFor="sms-group-name">Group Name</Label>
                <Input
                  id="sms-group-name"
                  placeholder="e.g., Payment Due, Absent Students"
                  {...form.register('name')}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-group-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="sms-group-description"
                  placeholder="Describe the purpose of this group..."
                  rows={3}
                  {...form.register('description')}
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Label>Select Members</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={messStudents.length === 0}
                      onClick={() =>
                        form.setValue(
                          'memberIds',
                          messStudents.map(s => String(s.id)),
                          { shouldValidate: true, shouldDirty: true }
                        )
                      }
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        form.setValue('memberIds', [], {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-4">
                  {studentsLoading ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Loading students…
                    </p>
                  ) : messStudents.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No students available
                    </p>
                  ) : (
                    messStudents.map(student => {
                      const id = String(student.id)
                      const checked = selectedMembers.includes(id)
                      return (
                        <div
                          key={id}
                          className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`sms-group-member-${id}`}
                            checked={checked}
                            onCheckedChange={value =>
                              toggleMember(id, value === true)
                            }
                          />
                          <Label
                            htmlFor={`sms-group-member-${id}`}
                            className="flex-1 cursor-pointer text-sm font-normal"
                          >
                            {student.name}
                            {student.seatNumber
                              ? ` (Seat ${student.seatNumber})`
                              : ''}
                          </Label>
                        </div>
                      )
                    })
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {selectedMembers.length} member
                  {selectedMembers.length !== 1 ? 's' : ''} selected
                </p>
                {errors.memberIds && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.memberIds.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 gap-2 border-t bg-background px-6 py-4 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || selectedMembers.length === 0}
            >
              {saving
                ? 'Saving…'
                : group
                  ? 'Update Group'
                  : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** @deprecated Use SMSGroupEditorDialog */
export const SMSGroupDialog = SMSGroupEditorDialog
