'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  Edit,
} from 'lucide-react'
import { format } from 'date-fns'
import type { JobInfo } from '@/types/renterProfile'

interface JobInfoCardProps {
  jobInfo?: JobInfo
  onEdit: () => void
}

export function JobInfoCard({ jobInfo, onEdit }: JobInfoCardProps) {
  if (!jobInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job / Institute Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No job or institute information added yet.
          </p>
          <Button onClick={onEdit}>Add Information</Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = () => {
    switch (jobInfo.verificationStatus) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  const getTypeLabel = () => {
    switch (jobInfo.type) {
      case 'employed':
        return 'Employed'
      case 'student':
        return 'Student'
      case 'self_employed':
        return 'Self Employed'
      default:
        return 'Unemployed'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {jobInfo.type === 'student' ? (
            <GraduationCap className="h-5 w-5" />
          ) : (
            <Briefcase className="h-5 w-5" />
          )}
          Job / Institute Information
        </CardTitle>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">{getTypeLabel()}</p>
          </div>

          {jobInfo.type === 'employed' && (
            <>
              {jobInfo.jobTitle && (
                <div>
                  <p className="text-sm text-muted-foreground">Job Title</p>
                  <p className="font-medium">{jobInfo.jobTitle}</p>
                </div>
              )}
              {jobInfo.company && (
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{jobInfo.company}</p>
                </div>
              )}
              {jobInfo.department && (
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{jobInfo.department}</p>
                </div>
              )}
              {jobInfo.employmentStartDate && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Employment Start Date
                  </p>
                  <p className="font-medium">
                    {format(
                      new Date(jobInfo.employmentStartDate),
                      'MMM dd, yyyy'
                    )}
                  </p>
                </div>
              )}
            </>
          )}

          {jobInfo.type === 'student' && (
            <>
              {jobInfo.instituteName && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Institute Name
                  </p>
                  <p className="font-medium">{jobInfo.instituteName}</p>
                </div>
              )}
              {jobInfo.studentId && (
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{jobInfo.studentId}</p>
                </div>
              )}
              {jobInfo.department && (
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{jobInfo.department}</p>
                </div>
              )}
            </>
          )}

          {jobInfo.type === 'self_employed' && jobInfo.jobTitle && (
            <div>
              <p className="text-sm text-muted-foreground">Occupation</p>
              <p className="font-medium">{jobInfo.jobTitle}</p>
            </div>
          )}

          {jobInfo.verificationStatus === 'verified' && jobInfo.verifiedAt && (
            <div>
              <p className="text-sm text-muted-foreground">Verified On</p>
              <p className="font-medium text-green-600">
                {format(new Date(jobInfo.verifiedAt), 'MMM dd, yyyy')}
              </p>
            </div>
          )}

          {jobInfo.verificationStatus === 'rejected' &&
            jobInfo.rejectionReason && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Rejection Reason
                </p>
                <p className="font-medium text-red-600">
                  {jobInfo.rejectionReason}
                </p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
