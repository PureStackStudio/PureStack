import { getLogger, hasLogger } from 'logpot'
import { afterAll, describe, expect, it } from 'vitest'
import { ensureLogger } from './logger'

describe('ensureLogger', () => {
  afterAll(async () => {
    await getLogger().close()
  })

  it('creates the default logger once and keeps a logger that exists', async () => {
    expect(hasLogger()).toBe(false)

    await ensureLogger()
    const logger = getLogger()
    await ensureLogger()

    expect(getLogger()).toBe(logger)
  })
})
