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
import type { Flat, Renter } from '@/types/building'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone is required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  nid: z.string().min(10, 'NID is required for BD rentals'),
  address: z.string().optional(),
  jobOrInstitute: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface AssignRenterDialogProps {
  flat: Flat | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign: (flat: Flat, renter: Renter) => void
}

export function AssignRenterDialog({
  flat,
  open,
  onOpenChange,
  onAssign,
}: AssignRenterDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      nid: '',
      address: '',
      jobOrInstitute: '',
    },
  })

  const handleSubmit = (data: FormValues) => {
    if (!flat) return
    const renter: Renter = {
      id: `renter-${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      nid: data.nid.trim(),
      address: data.address?.trim() || data.jobOrInstitute?.trim() || undefined,
      joinedDate: new Date().toISOString().slice(0, 10),
    }
    onAssign(flat, renter)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Assign renter{flat ? ` · Flat ${flat.flatNumber}` : ''}
          </DialogTitle>
          <DialogDescription>
            Capture NID and contact details for Bangladesh rental compliance.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rahim Uddin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="017XXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NID number</FormLabel>
                    <FormControl>
                      <Input placeholder="13 or 17 digit NID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobOrInstitute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job / institute (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Company or university" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permanent address (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Village, district" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Assign renter
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
