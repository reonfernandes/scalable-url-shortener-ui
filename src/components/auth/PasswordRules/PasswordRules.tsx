import { Check, Circle } from 'lucide-react'
import { PASSWORD_RULES } from './passwordPolicy'
import './PasswordRules.css'

/** Live checklist under the password field. */
export function PasswordRules({ password }: { password: string }) {
  return (
    <ul className="password-rules" role="list">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password)
        return (
          <li key={rule.id} className={met ? 'password-rules__item password-rules__item--met' : 'password-rules__item'}>
            {met ? (
              <Check size={14} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Circle size={14} aria-hidden="true" />
            )}
            <span>
              {rule.label}
              <span className="visually-hidden">{met ? ' (done)' : ' (not yet)'}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
