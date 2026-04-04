'use client'

import { useEffect, useState } from 'react'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users } from 'lucide-react'
import type { SMSGroup } from '@/types/sms'
import { mockStudents } from '@/data/mockMess'

const smsGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().optional(),
  memberIds: z.array(z.string()).min(1, 'Select at least one member'),
})

interface SMSGroupDialogProps {
  group?: SMSGroup | null
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function SMSGroupDialog({
  group,
  messId,
  open,
  onOpenChange,
  onSubmit,
}: SMSGroupDialogProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const messStudents = mockStudents.filter(s => s.seatNumber)

  const form = useForm({
    resolver: zodResolver(smsGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      memberIds: [],
    },
  })

  useEffect(() => {
    if (group && open) {
      form.reset({
        name: group.name,
        description: group.description || '',
        memberIds: group.memberIds,
      })
      setSelectedMembers(group.memberIds)
    } else if (!group && open) {
      form.reset({
        name: '',
        description: '',
        memberIds: [],
      })
      setSelectedMembers([])
    }
  }, [group, open, form])

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      messId,
      memberIds: selectedMembers.length > 0 ? selectedMembers : data.memberIds,
    })
    form.reset()
    setSelectedMembers([])
    onOpenChange(false)
  }

  const toggleMember = (studentId: string) => {
    setSelectedMembers(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const selectAll = () => {
    setSelectedMembers(messStudents.map(s => s.id))
  }

  const deselectAll = () => {
    setSelectedMembers([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {group ? 'Edit SMS Group' : 'Create SMS Group'}
          </DialogTitle>
          <DialogDescription>
            Create groups of students for easy bulk messaging
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {/* Group Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Payment Due, Absent Students"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the purpose of this group..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Member Selection */}
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Select Members</FormLabel>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAll}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={deselectAll}
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 max-h-64 overflow-y-auto space-y-2">
                    {messStudents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No students available
                      </p>
                    ) : (
                      messStudents.map(student => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`member-${student.id}`}
                            checked={selectedMembers.includes(student.id)}
                            onCheckedChange={() => toggleMember(student.id)}
                          />
                          <label
                            htmlFor={`member-${student.id}`}
                            className="flex-1 cursor-pointer text-sm"
                          >
                            {student.name}{' '}
                            {student.seatNumber &&
                              `(Seat ${student.seatNumber})`}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedMembers.length} member
                    {selectedMembers.length !== 1 ? 's' : ''} selected
                  </p>
                  <FormMessage />
                </FormItem>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={selectedMembers.length === 0}>
                {group ? 'Update' : 'Create'} Group
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
