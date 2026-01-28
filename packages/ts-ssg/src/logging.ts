export interface LoggerLike {
  error: (msg: string, meta?: Record<string, unknown> | Error) => void
}

export function logError(logger: LoggerLike, error: unknown, msg: string) {
  if (error instanceof Error) {
    logger.error(msg, error)
    return
  }
  logger.error(msg, { error: String(error) })
}
