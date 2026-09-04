'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Shield } from 'lucide-react'
import { updateCIMSStatus } from '@/lib/api/account'

interface CIMSRegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

const DHAKA_THANAS = [
  'Adabor', 'Badda', 'Bangshal', 'Bimanbandar', 'Cantonment',
  'Chackbazar', 'Darus Salam', 'Demra', 'Dhanmondi', 'Gendaria',
  'Gulshan', 'Hazaribagh', 'Jatrabari', 'Kadamtali', 'Kafrul',
  'Kalabagan', 'Kamrangirchar', 'Khilgaon', 'Khilkhet', 'Kotwali',
  'Lalbagh', 'Mirpur Model', 'Mohammadpur', 'Motijheel', 'New Market',
  'Pallabi', 'Paltan', 'Ramna', 'Rampura', 'Sabujbagh',
  'Shah Ali', 'Shahbagh', 'Sher-e-Bangla Nagar', 'Shyampur',
  'Sutrapur', 'Tejgaon', 'Tejgaon Industrial', 'Turag', 'Uttara East',
  'Uttara West', 'Uttarkhan', 'Vatara', 'Wari',
]

export function CIMSRegistrationDialog({
  open,
  onOpenChange,
  onComplete,
}: CIMSRegistrationDialogProps) {
  const [regNumber, setRegNumber] = useState('')
  const [policeStation, setPoliceStation] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const res = await updateCIMSStatus({
      cimsRegistered: true,
      cimsRegistrationNumber: regNumber,
      cimsPoliceStation: policeStation,
    })
    setSaving(false)
    if (res.ok) {
      onOpenChange(false)
      onComplete?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            CIMS Registration
          </DialogTitle>
          <DialogDescription>
            Record your CIMS registration details. This helps verify your identity
            and ensures compliance with DMP requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">How to register:</p>
            <ol className="mt-1.5 list-inside list-decimal space-y-1">
              <li>Download the CIMSDMP app from Play Store / App Store</li>
              <li>Register with your mobile number</li>
              <li>Provide personal, family and residential information</li>
              <li>Submit to your local Thana</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cims-reg">Registration Number (optional)</Label>
            <Input
              id="cims-reg"
              placeholder="Enter your CIMS reference number"
              value={regNumber}
              onChange={e => setRegNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cims-thana">Police Station (Thana)</Label>
            <select
              id="cims-thana"
              value={policeStation}
              onChange={e => setPoliceStation(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select your Thana...</option>
              {DHAKA_THANAS.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="other">Other (outside Dhaka)</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : (
              <>
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Mark as Registered
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
