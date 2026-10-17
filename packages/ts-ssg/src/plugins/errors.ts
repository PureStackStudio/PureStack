/** Keeps the original cause and the integration responsible for a failure. */
export class PluginError extends Error {
  constructor(
    readonly plugin: string,
    readonly contribution: string,
    cause: unknown,
  ) {
    super(
      `Plugin "${plugin}" failed in ${contribution}: ${cause instanceof Error ? cause.message : String(cause)}`,
      { cause },
    )
  }
}

export function pluginError(
  plugin: string,
  contribution: string,
  cause: unknown,
): PluginError {
  return cause instanceof PluginError
    ? cause
    : new PluginError(plugin, contribution, cause)
}

export function callPlugin<T>(
  plugin: string,
  contribution: string,
  run: () => T,
): T {
  try {
    return run()
  } catch (error) {
    throw pluginError(plugin, contribution, error)
  }
}

export async function awaitPlugin<T>(
  plugin: string,
  contribution: string,
  run: () => T | Promise<T>,
): Promise<T> {
  try {
    return await run()
  } catch (error) {
    throw pluginError(plugin, contribution, error)
  }
}
