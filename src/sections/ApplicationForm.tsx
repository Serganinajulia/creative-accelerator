import { useState } from 'react'
import Reveal from '../components/Reveal'

/**
 * Состав полей — ровно по официальному реестру участников
 * (Приложение №1 к Техническому заданию к Договору, форма АНО «АИР»).
 * Отправка идёт на серверную функцию Яндекс.Облака, которая пишет
 * результат в Google Таблицы.
 */
type FormState = {
  municipality: string
  orgName: string
  inn: string
  address: string
  fullName: string
  phone: string
  email: string
  consent: boolean
}

const initialState: FormState = {
  municipality: '',
  orgName: '',
  inn: '',
  address: '',
  fullName: '',
  phone: '',
  email: '',
  consent: false,
}

// формат телефона из приложения: 80000000000 (11 цифр, начинается с 8)
const PHONE_RE = /^8\d{10}$/
// формат почты из приложения: mail@mail.ru
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? ''

export default function ApplicationForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.municipality.trim()) e.municipality = 'Обязательное поле'
    if (!form.orgName.trim()) e.orgName = 'Обязательное поле'
    if (!form.inn.trim()) e.inn = 'Обязательное поле'
    if (!form.address.trim()) e.address = 'Обязательное поле'
    if (!form.fullName.trim()) e.fullName = 'Обязательное поле'
    if (!PHONE_RE.test(form.phone)) e.phone = 'Формат: 80000000000'
    if (!EMAIL_RE.test(form.email)) e.email = 'Формат: mail@mail.ru'
    if (!form.consent) e.consent = 'Нужно согласие на обработку персональных данных'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('bad status')
      setStatus('success')
      setForm(initialState)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section id="application-form" className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-primary mb-3">Заявка отправлена</h2>
        <p className="text-dark/60">Спасибо! Мы свяжемся с вами после завершения приёма заявок.</p>
      </section>
    )
  }

  return (
    <section id="application-form" className="mx-auto max-w-2xl px-6 py-20">
      <Reveal>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Подать заявку</h2>
      </Reveal>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Наименование муниципального образования" error={errors.municipality}>
          <input
            className="input"
            value={form.municipality}
            onChange={(e) => update('municipality', e.target.value)}
          />
        </Field>

        <Field label="Наименование субъекта МСП" error={errors.orgName}>
          <input className="input" value={form.orgName} onChange={(e) => update('orgName', e.target.value)} />
        </Field>

        <Field label="ИНН субъекта МСП" error={errors.inn}>
          <input className="input" value={form.inn} onChange={(e) => update('inn', e.target.value)} />
        </Field>

        <Field label="Адрес регистрации субъекта МСП (заполняется в отношении ЮЛ)" error={errors.address}>
          <input className="input" value={form.address} onChange={(e) => update('address', e.target.value)} />
        </Field>

        <Field label="ФИО представителя субъекта МСП" error={errors.fullName}>
          <input className="input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
        </Field>

        <Field label="Контактный телефон (формат: 80000000000)" error={errors.phone}>
          <input
            className="input"
            inputMode="numeric"
            placeholder="80000000000"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="Электронная почта (формат: mail@mail.ru)" error={errors.email}>
          <input
            className="input"
            type="email"
            placeholder="mail@mail.ru"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </Field>

        <label className="flex items-start gap-3 text-dark/70">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => update('consent', e.target.checked)}
            className="mt-1"
          />
          Даю согласие на обработку персональных данных в соответствии с{' '}
          <a href="/privacy" className="underline">
            политикой конфиденциальности
          </a>
        </label>
        {errors.consent && <p className="text-accent text-xs">{errors.consent}</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full bg-accent text-white px-6 py-3 font-semibold disabled:opacity-60"
        >
          {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
        </button>

        {status === 'error' && (
          <p className="text-accent">Не получилось отправить. Попробуйте ещё раз.</p>
        )}
      </form>
    </section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block font-medium text-dark mb-1">{label}</span>
      {children}
      {error && <span className="block text-accent text-xs mt-1">{error}</span>}
    </label>
  )
}
