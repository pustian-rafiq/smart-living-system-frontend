'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { UserRole } from '@/types'

const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  phone: z.string().min(1, 'Phone number is required'),
  whatsappNumber: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  role: z.enum(['renter', 'owner', 'admin']),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    name: string
    phone: string
    whatsappNumber?: string
    email?: string
    role: UserRole
  }
  onSave: (data: ProfileFormData & { photoFile?: File }) => void
}

export function EditProfileDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditProfileDialogProps) {
  const tContact = useTranslations('contact')
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name,
      phone: initialData.phone,
      whatsappNumber: initialData.whatsappNumber || '',
      email: initialData.email || '',
      role: initialData.role,
    },
  })
  const [photoFile, setPhotoFile] = useState<File | undefined>()

  const onSubmit = (data: ProfileFormData) => {
    onSave({ ...data, photoFile })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+8801712345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tContact('whatsappNumber')}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder={tContact('whatsappNumberPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0"
                      onClick={() =>
                        form.setValue('whatsappNumber', form.getValues('phone'), {
                          shouldDirty: true,
                        })
                      }
                    >
                      {tContact('sameAsPhone')}
                    </Button>
                  </div>
                  <FormDescription>
                    {tContact('whatsappOwnerHint')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Profile photo</Label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={event => setPhotoFile(event.target.files?.[0])}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="renter">Renter</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
