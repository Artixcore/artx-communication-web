interface CapabilityLike {
  name: string
  enabled: boolean
}

function isCapabilityLike(value: unknown): value is CapabilityLike {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  return typeof record.name === 'string' && typeof record.enabled === 'boolean'
}

export function canUsePasskey(capabilities: unknown, browserSupported: boolean): boolean {
  if (!browserSupported || !Array.isArray(capabilities)) return false
  return capabilities.some((capability) => isCapabilityLike(capability) && capability.name === 'auth.webauthn-v1' && capability.enabled === true)
}
