import type { AuthConfig } from '@purestack/ts-common'
import type { DeepPartial } from '@purestack/ts-util'
import { pickBoolean, resolveString } from '@purestack/ts-util'

export function resolveAuthConfig(
  input?: DeepPartial<AuthConfig>,
  file?: DeepPartial<AuthConfig>,
): AuthConfig {
  return {
    enabled: pickBoolean(input?.enabled, file?.enabled, false),
    signUp: pickBoolean(input?.signUp, file?.signUp, true),
    signedInStorageKey: resolveString(
      input?.signedInStorageKey,
      file?.signedInStorageKey,
      'signed-in-hint',
    ),
  }
}
