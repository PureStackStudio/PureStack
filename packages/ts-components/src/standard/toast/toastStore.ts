import type { SemanticTone } from '@purestack/ts-style'
import { sref } from 'regor'

export interface ToastItem {
  id: string
  message: string
  tone: SemanticTone
}

const TOAST_TIMEOUT_MS: Partial<Record<SemanticTone, number>> = {
  info: 5000,
  success: 5000,
  warning: 10000,
}

export class ToastStore {
  readonly items = sref<ToastItem[]>([])
  private nextId = 0
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>()

  notify = (text: string, tone: SemanticTone = 'info') => {
    if (!text) return
    const toast: ToastItem = {
      id: `toast-${++this.nextId}`,
      message: text,
      tone,
    }
    this.items([...this.items(), toast])
    const timeout = TOAST_TIMEOUT_MS[tone]
    if (timeout) {
      this.timers.set(
        toast.id,
        setTimeout(() => this.dismiss(toast.id), timeout),
      )
    }
  }

  dismiss = (id: string) => {
    const timer = this.timers.get(id)
    if (timer) clearTimeout(timer)
    this.timers.delete(id)
    this.items(this.items().filter((toast) => toast.id !== id))
  }

  clear = () => {
    for (const timer of this.timers.values()) clearTimeout(timer)
    this.timers.clear()
    this.items([])
  }
}
