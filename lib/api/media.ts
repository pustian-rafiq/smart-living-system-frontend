import { apiRequest } from './client'
import type { ApiResult } from './http'

/**
 * Upload target. The API maps each kind to a folder inside the storage root
 * (DigitalOcean Spaces), so callers pick the product area and never a path:
 *
 *   property / property_video  -> property/images, property/videos
 *   mess / mess_member         -> mess/photos, mess/members
 *   hotel                      -> hotels/photos
 *   profile                    -> users/profiles
 *   notice / complaint / chat  -> notices, support/complaints, chat/attachments
 *   document / verification    -> private, served as short-lived signed URLs
 *
 * `image` and `video` are kept as aliases of the property kinds for the
 * listing media endpoint.
 */
export type MediaKind =
  | 'property'
  | 'property_video'
  | 'mess'
  | 'mess_member'
  | 'hotel'
  | 'profile'
  | 'notice'
  | 'complaint'
  | 'chat'
  | 'document'
  | 'verification'
  | 'image'
  | 'video'

export type UploadedMedia = {
  url: string
  key?: string
  name: string
  kind: string
}

export async function uploadMediaFile(
  file: File,
  kind: MediaKind = 'property',
): Promise<ApiResult<UploadedMedia>> {
  const form = new FormData()
  form.append('file', file)
  form.append('kind', kind)
  return apiRequest('/media/upload/', {
    method: 'POST',
    formData: form,
  })
}

export async function uploadMediaFiles(
  files: File[],
  kind: MediaKind,
): Promise<ApiResult<string[]>> {
  const urls: string[] = []
  for (const file of files) {
    const result = await uploadMediaFile(file, kind)
    if (!result.ok) return result
    urls.push(result.data.url)
  }
  return { ok: true, data: urls }
}