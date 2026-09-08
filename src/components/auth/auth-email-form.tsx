'use client'

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertRegion } from '@/components/alerts/alert-region'
import { makeAlert, type AlertMessage } from '@/core/alerts/alert-state'
import { canUsePasskey } from '@/core/auth/passkey-capability'
import { normalizeEmail, validateEmail } from '@/core/validation/identity'

export function AuthEmailForm({ capabilities, mode }: { capabilities: unknown[]; mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [browserSupportsPasskeys, setBrowserSupportsPasskeys] = useState(false)
  const [alerts, setAlerts] = useState<AlertMessage[]>([])

  useEffect(() => {
    setBrowserSupportsPasskeys(typeof window !== 'undefined' && typeof window.PublicKeyCredential !== 'undefined')
  }, [])

  const backendAndBrowserReady = useMemo(() => canUsePasskey(capabilities, browserSupportsPasskeys), [capabilities, browserSupportsPasskeys])

  function validateCurrentEmail(): boolean {
    const result = validateEmail(email)
    setFieldError(result.ok ? '' : result.message)
    return result.ok
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validateCurrentEmail()) return
    if (!backendAndBrowserReady) {
      setAlerts([makeAlert('info', 'Passkey authentication is not enabled by the ARTX server yet. No login has been attempted.')])
      return
    }
    setAlerts([makeAlert('warning', 'The WebAuthn browser ceremony is not activated in this client build yet. No credentials were sent.')])
  }

  return (
    <form className="artx-form" onSubmit={onSubmit} noValidate>
      <AlertRegion alerts={alerts} />
      <div className="artx-field">
        <label htmlFor={`${mode}-email`}>Email</label>
        <input
          autoComplete="email webauthn"
          id={`${mode}-email`}
          inputMode="email"
          maxLength={254}
          name="email"
          onBlur={validateCurrentEmail}
          onChange={(event: ChangeEvent<HTMLInputElement>) => { setEmail(event.target.value); if (fieldError) setFieldError('') }}
          placeholder="you@artixcore.com or any valid email"
          spellCheck={false}
          type="email"
          value={email}
        />
        {fieldError ? <span className="artx-field-error">{fieldError}</span> : null}
      </div>
      <button className="artx-action" type="submit">{mode === 'register' ? 'Continue to create AID' : 'Continue with passkey'}</button>
      <p className="artx-note">Email providers are not restricted. {email ? `Normalized identity: ${normalizeEmail(email)}` : 'Artixcore, Gmail, Outlook, university and custom domains are accepted.'}</p>
      <p className="artx-note">Passkeys require both browser support and the reviewed ARTX WebAuthn backend capability. Password fallback is not silently enabled.</p>
    </form>
  )
}
