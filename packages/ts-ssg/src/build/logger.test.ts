import { getLogger, hasLogger } from 'logpot'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { ensureLogger } from './logger'

describe('ensureLogger', () => {
  afterAll(async () => {
    await getLogger().close()
  })

  it('uses the requested minimum level and keeps a logger that exists', async () => {
    expect(hasLogger()).toBe(false)

    expect(await ensureLogger('WARN')).toBe(true)
    const logger = getLogger()
    expect(await ensureLogger('DEBUG')).toBe(false)

    expect(getLogger()).toBe(logger)
    const output = vi.spyOn(process.stdout, 'write')
    try {
      logger.debug('hidden-debug-marker')
      logger.info('hidden-info-marker')
      logger.warn('visible-warning-marker')
      logger.error('visible-error-marker')
      await logger.flush()
      const text = output.mock.calls.map(([chunk]) => String(chunk)).join('')
      expect(text).not.toContain('hidden-debug-marker')
      expect(text).not.toContain('hidden-info-marker')
      expect(text).toContain('visible-warning-marker')
      expect(text).toContain('visible-error-marker')
    } finally {
      output.mockRestore()
    }
  })
})
