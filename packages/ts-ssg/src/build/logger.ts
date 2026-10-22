import { createLogger, hasLogger, type LevelName, STD_LEVEL_DEF } from 'logpot'

/**
 * Builds log through logpot. A caller can set up its own logger first;
 * otherwise the default console logger is created once and kept, since it
 * holds no timers that would keep the process alive.
 * Returns whether this call created the logger and owns its cleanup.
 */
export async function ensureLogger(logLevel?: LevelName) {
  if (hasLogger()) return false
  await createLogger({
    logLevel:
      logLevel === undefined
        ? undefined
        : STD_LEVEL_DEF.getLevelNumber(logLevel),
  })
  return true
}
