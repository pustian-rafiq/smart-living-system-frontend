'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Mess, Seat } from '@/types/mess'
import { mockSeats } from '@/data/mockMess'

const assignStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  studentId: z.string().optional(),
  university: z.string().optional(),
  seatNumber: z.string().min(1, 'Please select a seat'),
})

type AssignStudentFormData = z.infer<typeof assignStudentSchema>

interface AssignStudentDialogProps {
  mess: Mess | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign: (data: AssignStudentFormData) => void
}

export function AssignStudentDialog({
  mess,
  open,
  onOpenChange,
  onAssign,
}: AssignStudentDialogProps) {
  const form = useForm<AssignStudentFormData>({
    resolver: zodResolver(assignStudentSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      studentId: '',
      university: '',
      seatNumber: '',
    },
  })

  const availableSeats = mess
    ? mockSeats
        .filter(s => s.messId === mess.id && s.status === 'available')
        .map(s => s.seatNumber)
    : []

  const onSubmit = (data: AssignStudentFormData) => {
    onAssign(data)
    form.reset()
  }

  if (!mess) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Student to {mess.name}</DialogTitle>
          <DialogDescription>
            Fill in the student details to assign them a seat
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+8801712345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="STU-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <FormControl>
                    <Input placeholder="Dhaka University" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Seat *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an available seat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSeats.map(seat => (
                        <SelectItem key={seat} value={seat}>
                          {seat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">Monthly Fee</p>
              <p className="text-xl font-bold text-primary">
                ৳{mess.monthlyFee.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Assign Student</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
