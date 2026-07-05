/**
 * Client-side file validation (UI gate). Server must re-validate on upload.
 */

export type FileUploadPreset =
  | 'image'
  | 'document'
  | 'pdf'
  | 'receipt'
  | 'chatImage'
  | 'chatAttachment'
  | 'verification'

export type FileUploadRule = {
  maxBytes: number
  mimeTypes: readonly string[]
  extensions: readonly string[]
  label: string
}

export const FILE_UPLOAD_RULES: Record<FileUploadPreset, FileUploadRule> = {
  image: {
    label: 'Image',
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  },
  document: {
    label: 'Document',
    maxBytes: 10 * 1024 * 1024,
    mimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
    extensions: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
  },
  pdf: {
    label: 'PDF',
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
  },
  receipt: {
    label: 'Receipt',
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
  },
  chatImage: {
    label: 'Image',
    maxBytes: 3 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  },
  chatAttachment: {
    label: 'File',
    maxBytes: 10 * 1024 * 1024,
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    extensions: ['.pdf', '.doc', '.docx', '.txt'],
  },
  verification: {
    label: 'ID document',
    maxBytes: 8 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
  },
}

export type FileValidationResult =
  | { valid: true; file: File }
  | { valid: false; errorKey: string; errorParams?: Record<string, string | number> }

function getExtension(name: string): string {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i).toLowerCase() : ''
}

export function formatMaxFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`
}

export function getAcceptAttribute(preset: FileUploadPreset): string {
  const rule = FILE_UPLOAD_RULES[preset]
  return [...rule.extensions, ...rule.mimeTypes].join(',')
}

export function validateFile(
  file: File,
  preset: FileUploadPreset
): FileValidationResult {
  const rule = FILE_UPLOAD_RULES[preset]
  const ext = getExtension(file.name)

  if (file.size > rule.maxBytes) {
    return {
      valid: false,
      errorKey: 'fileTooLarge',
      errorParams: { max: formatMaxFileSize(rule.maxBytes), label: rule.label },
    }
  }

  const mimeOk =
    rule.mimeTypes.includes(file.type) ||
    (file.type === '' && rule.extensions.includes(ext))

  const extOk = ext === '' || rule.extensions.includes(ext)

  if (!mimeOk || !extOk) {
    return {
      valid: false,
      errorKey: 'fileTypeNotAllowed',
      errorParams: {
        types: rule.extensions.join(', '),
        label: rule.label,
      },
    }
  }

  return { valid: true, file }
}
