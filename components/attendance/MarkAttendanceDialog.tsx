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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock } from 'lucide-react'
import { mockStudents } from '@/data/mockMess'

const markAttendanceSchema = z.object({
  studentIds: z.array(z.string()).min(1, 'Select at least one student'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  type: z.enum(['general', 'meal', 'both']),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  mealCategory: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  notes: z.string().optional(),
})

interface MarkAttendanceDialogProps {
  messId: string
  date?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function MarkAttendanceDialog({
  messId,
  date,
  open,
  onOpenChange,
  onSubmit,
}: MarkAttendanceDialogProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const messStudents = mockStudents.filter(s => s.seatNumber) // Only students with assigned seats

  const form = useForm({
    resolver: zodResolver(markAttendanceSchema),
    defaultValues: {
      studentIds: [],
      date: date || new Date().toISOString().split('T')[0],
      status: 'present',
      type: 'both',
      checkInTime: '',
      checkOutTime: '',
      mealCategory: undefined,
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      const today = date || new Date().toISOString().split('T')[0]
      form.reset({
        studentIds: [],
        date: today,
        status: 'present',
        type: 'both',
        checkInTime: '',
        checkOutTime: '',
        mealCategory: undefined,
        notes: '',
      })
      setSelectedStudents([])
    }
  }, [open, date, form])

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      studentIds:
        selectedStudents.length > 0 ? selectedStudents : data.studentIds,
    })
    form.reset()
    setSelectedStudents([])
    onOpenChange(false)
  }

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const selectAll = () => {
    setSelectedStudents(messStudents.map(s => s.id))
  }

  const deselectAll = () => {
    setSelectedStudents([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Mark attendance for students on a specific date
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Students Selection */}
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Select Students</FormLabel>
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
                  <div className="rounded-lg border p-4 max-h-48 overflow-y-auto space-y-2">
                    {messStudents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No students assigned to this mess
                      </p>
                    ) : (
                      messStudents.map(student => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                          />
                          <label
                            htmlFor={`student-${student.id}`}
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
                  <FormMessage />
                </FormItem>

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="excused">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attendance Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General Only</SelectItem>
                          <SelectItem value="meal">Meal Only</SelectItem>
                          <SelectItem value="both">
                            Both General & Meal
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Meal Category (if meal type) */}
                {form.watch('type') !== 'general' && (
                  <FormField
                    control={form.control}
                    name="mealCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Category</FormLabel>
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select meal category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="snack">Snack</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Check-in/Check-out Times */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="checkInTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Check-in Time
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="checkOutTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Check-out Time
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <Button type="submit" disabled={selectedStudents.length === 0}>
                Mark Attendance ({selectedStudents.length} student
                {selectedStudents.length !== 1 ? 's' : ''})
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
