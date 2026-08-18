'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Bed } from 'lucide-react'
import { RoomCard } from '@/components/hotel/RoomCard'
import { fetchHotelById, fetchHotelRooms, createHotelRoom, updateHotelRoom, deleteHotelRoom } from '@/lib/api/hotels'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  type: z.enum(['single', 'double', 'suite', 'family']),
  floor: z.number().min(0),
  capacity: z.number().min(1).max(10),
  basePrice: z.number().min(0),
  description: z.string().optional(),
})

type RoomFormData = z.infer<typeof roomSchema>

export default function RoomManagementPage() {
  const t = useTranslations('hotels')
  const tc = useTranslations('common')
  const { confirm } = useConfirm()
  const params = useParams()
  const router = useRouter()
  const hotelId = params.hotelId as string

  const loadHotel = useCallback(() => fetchHotelById(hotelId), [hotelId])
  const { data: hotel, refetch: refetchHotel } = useMockQuery(loadHotel)

  const loadRooms = useCallback(() => fetchHotelRooms(hotelId), [hotelId])
  const { data: roomsData, refetch: refetchRooms } = useMockQuery(loadRooms)
  const rooms = roomsData ?? []

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: '',
      type: 'single',
      floor: 1,
      capacity: 1,
      basePrice: 0,
      description: '',
    },
  })

  const handleAddRoom = () => {
    setEditingRoom(null)
    setFormError(null)
    form.reset()
    setIsDialogOpen(true)
  }

  const handleEditRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      setEditingRoom(roomId)
      form.reset({
        roomNumber: room.roomNumber,
        type: room.type,
        floor: room.floor,
        capacity: room.capacity,
        basePrice: room.basePrice,
        description: room.description,
      })
      setIsDialogOpen(true)
      setFormError(null)
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    const ok = await confirm({
      title: t('rooms.deleteTitle'),
      description: t('rooms.deleteDesc'),
      variant: 'destructive',
    })
    if (!ok) return
    const result = await deleteHotelRoom(hotelId, roomId)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(t('rooms.deleted'))
    await refetchRooms()
    await refetchHotel()
  }

  const handleSubmit = async (data: RoomFormData) => {
    setSaving(true)
    setFormError(null)
    const payload = {
      roomNumber: data.roomNumber,
      type: data.type,
      floor: data.floor,
      capacity: data.capacity,
      basePrice: data.basePrice,
      description: data.description || '',
    }
    const result = editingRoom
      ? await updateHotelRoom(hotelId, editingRoom, payload)
      : await createHotelRoom(hotelId, payload)
    setSaving(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    toast.success(editingRoom ? t('rooms.updated') : t('rooms.added'))
    setIsDialogOpen(false)
    form.reset()
    await refetchRooms()
    await refetchHotel()
  }

  if (!hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold text-muted-foreground">
                {t('pricing.notFoundTitle')}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/my-hotels')}
                className="mt-4"
              >
                {t('myHotels.backToHotels')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-2"
            >
              ← {tc('back')}
            </Button>
            <h1 className="text-2xl font-bold">
              {t('rooms.managementTitle')}
            </h1>
            <p className="text-muted-foreground">{hotel.name}</p>
          </div>
          <Button onClick={handleAddRoom}>
            <Plus className="mr-2 h-4 w-4" />
            {t('rooms.addRoom')}
          </Button>
        </div>

        {/* Rooms List */}
        <div className="space-y-4">
          {rooms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bed className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">
                  {t('rooms.emptyRooms')}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('rooms.emptyRoomsDesc')}
                </p>
                <Button onClick={handleAddRoom} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('rooms.addRoom')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            rooms.map(room => (
              <Card key={room.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <RoomCard room={room} />
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditRoom(room.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add/Edit Room Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? t('rooms.editRoom') : t('rooms.addNewRoom')}
              </DialogTitle>
              <DialogDescription>
                {editingRoom
                  ? t('rooms.editRoomDesc')
                  : t('rooms.addRoomDesc')}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('rooms.roomNumber')}</FormLabel>
                        <FormControl>
                          <Input placeholder="101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('rooms.roomType')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('rooms.selectType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">
                              {t('rooms.types.single')}
                            </SelectItem>
                            <SelectItem value="double">
                              {t('rooms.types.double')}
                            </SelectItem>
                            <SelectItem value="suite">
                              {t('rooms.types.suite')}
                            </SelectItem>
                            <SelectItem value="family">
                              {t('rooms.types.family')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('rooms.floor')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={e =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('rooms.maxGuests')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            {...field}
                            onChange={e =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('rooms.basePrice')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={e =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('rooms.descriptionLabel')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('rooms.descriptionPlaceholder')}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={saving}
                  >
                    {tc('cancel')}
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving
                      ? `${tc('save')}…`
                      : editingRoom
                        ? t('rooms.updateRoom')
                        : t('rooms.addRoom')}
                  </Button>
                </div>
                {formError && (
                  <p className="text-sm text-destructive">{formError}</p>
                )}
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
