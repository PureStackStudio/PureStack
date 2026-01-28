export interface LoggerLike {
  error: (msg: string, meta?: Record<string, unknown> | Error) => void
}

export function logError(logger: LoggerLike, error: unknown, msg: string) {
  const isError = error instanceof Error
  if (isError) {
    logger.error(msg, error)
    return
  }
  const errorText = String(error)
  logger.error(msg, { error: errorText })
}
