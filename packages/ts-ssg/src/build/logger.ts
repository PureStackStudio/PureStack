import { createLogger, hasLogger } from 'logpot'

/**
 * Builds log through logpot. A caller can set up its own logger first;
 * otherwise the default console logger is created once and kept, since it
 * holds no timers that would keep the process alive.
 */
export async function ensureLogger() {
  if (!hasLogger()) await createLogger()
}
