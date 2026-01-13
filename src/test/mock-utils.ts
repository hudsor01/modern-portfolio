import { mock } from 'bun:test'

type RegisterCoreMocks = () => void

const getRegisterCoreMocks = (): RegisterCoreMocks | undefined => {
  const register = (globalThis as Record<string, unknown>).__registerCoreMocks
  return typeof register === 'function' ? (register as RegisterCoreMocks) : undefined
}

export const restoreTestMocks = () => {
  mock.restore()
  const register = getRegisterCoreMocks()
  if (register) {
    register()
  }
}
