import { apiRequest } from './client'
import type { ApiResult } from './http'

export type MediaKind = 'image' | 'video' | 'document' | 'profile' | 'hotel'

export async function uploadMediaFile(
  file: File,
  kind: MediaKind = 'image',
): Promise<ApiResult<{ url: string; key?: string; name: string; kind: string }>> {
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
