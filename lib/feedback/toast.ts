import { toast as sonnerToast } from 'sonner'

export type ToastOptions = {
  description?: string
  duration?: number
}

/** App-wide toast helpers — use instead of `alert()`. */
export const toast = {
  success(message: string, options?: ToastOptions) {
    sonnerToast.success(message, options)
  },
  error(message: string, options?: ToastOptions) {
    sonnerToast.error(message, options)
  },
  info(message: string, options?: ToastOptions) {
    sonnerToast.info(message, options)
  },
  warning(message: string, options?: ToastOptions) {
    sonnerToast.warning(message, options)
  },
}
