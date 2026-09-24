import { useState, type ReactNode } from 'react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import timeline from '../data/timelineProgram.json'

/**
 * Состав полей — ровно по официальному реестру участников
 * (Приложение №1 к Техническому заданию к Договору, форма АНО «АИР»).
 * В интерфейсе подписи переведены на человеческий язык, но ключи и
 * официальные названия колонок не меняются — см. REGISTRY_LABELS.
 * Отправка идёт на серверную функцию Яндекс.Облака → Google Таблицы.
 */
type FormState = {
  municipality: string
  orgName: string
  inn: string
  address: string
  fullName: string
  phone: string // хранится как 80000000000, показывается с маской
  email: string
  consent: boolean
}

type Key = keyof FormState

/** Официальные названия колонок реестра — для сверки с Google Таблицей */
export const REGISTRY_LABELS: Record<Key, string> = {
  municipality: 'Наименование муниципального образования',
  orgName: 'Наименование субъекта МСП',
  inn: 'ИНН субъекта МСП',
  address: 'Адрес регистрации субъекта МСП (заполняется в отношении ЮЛ)',
  fullName: 'ФИО представителя субъекта МСП',
  phone: 'Контактный телефон',
  email: 'Электронная почта',
  consent: 'Согласие на обработку персональных данных',
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

const FIELD_ORDER: Key[] = ['municipality', 'orgName', 'inn', 'address', 'fullName', 'phone', 'email', 'consent']

// слово ФИО: только кириллица, допускается дефис (Римская-Корсакова)
const FIO_WORD_RE = /^[А-ЯЁа-яё]+(?:-[А-ЯЁа-яё]+)*$/
const HAS_LATIN_RE = /[A-Za-z]/

// email, в том числе кириллические адреса и домены (почта@сайт.рф)
const EMAIL_RE = /^[^\s@]+@(?:[\p{L}\p{N}-]+\.)+[\p{L}\p{N}-]{2,}$/u

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? ''

/* ---------- ИНН: длина + контрольные цифры ФНС ---------- */

function isValidInn(inn: string): boolean {
  if (!/^(\d{10}|\d{12})$/.test(inn)) return false
  const d = inn.split('').map(Number)
  const check = (w: number[]) => (w.reduce((s, k, i) => s + k * d[i], 0) % 11) % 10
  if (d.length === 10) return check([2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[9]
  return (
    check([7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[10] &&
    check([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[11]
  )
}

/** 12 цифр = ИП, юридический адрес не нужен */
const isSoleProprietor = (inn: string) => inn.length === 12

/* ---------- Телефон: храним 8XXXXXXXXXX, показываем 8 (XXX) XXX-XX-XX ---------- */

function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (!d) return ''
  if (d[0] === '7') d = '8' + d.slice(1)
  else if (d[0] !== '8') d = '8' + d
  return d.slice(0, 11)
}

function formatPhone(d: string): string {
  if (!d) return ''
  const p = d.slice(1)
  let out = '8'
  if (p.length) out += ' (' + p.slice(0, 3)
  if (p.length >= 3) out += ')'
  if (p.length > 3) out += ' ' + p.slice(3, 6)
  if (p.length > 6) out += '-' + p.slice(6, 8)
  if (p.length > 8) out += '-' + p.slice(8, 10)
  return out
}

/* ---------- Валидация: тексты ошибок говорят, как исправить ---------- */

function validateField(key: Key, f: FormState): string | null {
  switch (key) {
    case 'municipality':
      return f.municipality.trim().length < 2 ? 'Укажите город или район' : null

    case 'orgName':
      return f.orgName.trim().length < 2 ? 'Укажите название организации или ИП' : null

    case 'inn':
      return /^(\d{10}|\d{12})$/.test(f.inn) ? null : 'Укажите ИНН: 10 или 12 цифр'

    case 'address':
      if (isSoleProprietor(f.inn)) return null
      return f.address.trim().length < 5 ? 'Укажите юридический адрес организации' : null

    case 'fullName': {
      const value = f.fullName.trim()
      if (!value) return 'Укажите ФИО представителя'
      if (HAS_LATIN_RE.test(value)) return 'Укажите ФИО представителя: используйте кириллицу'
      const words = value.split(/\s+/)
      if (!words.every((w) => FIO_WORD_RE.test(w)))
        return 'Укажите ФИО представителя: только буквы, без лишних символов'
      if (words.length < 2)
        return 'Укажите ФИО представителя: фамилию, имя и отчество (если есть)'
      return null
    }

    case 'phone':
      return /^8\d{10}$/.test(f.phone) ? null : 'Укажите номер телефона в формате 89000000000'

    case 'email':
      return EMAIL_RE.test(f.email.trim()) ? null : 'Проверьте корректность email'

    case 'consent':
      return f.consent ? null : 'Без согласия мы не можем принять заявку'
  }
}

/** Живая подсказка под ИНН, пока человек печатает */
function innHint(inn: string): string {
  if (!inn) return 'У компании 10 цифр, у ИП — 12'
  if (inn.length < 10) return `Введено ${inn.length} из 10 (или 12 для ИП)`
  if (inn.length === 10 && isValidInn(inn)) return 'Это компания (юрлицо) — ниже понадобится адрес'
  if (inn.length === 11) return 'Для ИП — ещё одна цифра'
  if (inn.length === 12 && isValidInn(inn)) return 'Это ИП — юридический адрес не нужен'
  return 'У компании 10 цифр, у ИП — 12'
}

/* ======================================================================= */

export default function ApplicationForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const isIP = isSoleProprietor(form.inn)
  const activeKeys = FIELD_ORDER.filter((k) => !(k === 'address' && isIP))
  const doneCount = activeKeys.filter((k) => !validateField(k, form)).length
  const progress = Math.round((doneCount / activeKeys.length) * 100)

  function update<K extends Key>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const touch = (key: Key) => setTouched((t) => ({ ...t, [key]: true }))

  /** Ошибку показываем только после того, как человек ушёл с поля — не кричим на ходу */
  const errorOf = (key: Key) => (touched[key] ? validateField(key, form) : null)
  const isValid = (key: Key) => !validateField(key, form) && Boolean(form[key])

  function handlePhoneChange(value: string) {
    let digits = normalizePhone(value)
    // стирание скобки/дефиса из маски удаляет предыдущую цифру, а не застревает
    if (digits === form.phone && value.length < formatPhone(form.phone).length) {
      digits = digits.slice(0, -1)
      if (digits === '8') digits = ''
    }
    update('phone', digits)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])))

    const firstError = activeKeys.find((k) => validateField(k, form))
    if (firstError) {
      document.getElementById(`f-${firstError}`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, address: form.address.trim() }),
      })
      if (!res.ok) throw new Error('bad status')
      setStatus('success')
      setForm(initialState)
      setTouched({})
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="application-form" className="mx-auto max-w-6xl px-4 pb-20 md:pb-28 md:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#1B428F_0%,#1B428F_40%,#E82B2A_100%)] p-6 text-white md:rounded-[48px] md:p-12 lg:p-16">
          <Decor />

          {status === 'success' ? (
            <SuccessState onReset={() => setStatus('idle')} />
          ) : (
            <div className="relative">
              {/* шапка: заголовок + подстрочник | шкала */}
              <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
                <div>
                  <SectionHeading className="text-white">
                    Подать <span className="bracket-word">заявку</span>
                  </SectionHeading>
                  <p className="mt-5 max-w-md text-white/85">
                    Для участия в акселераторе «Креативная среда» необходимо заполнить заявку{' '}
                    <span className="inline-block whitespace-nowrap rounded-full bg-white px-3 py-0.5 text-sm font-semibold text-primary">
                      до {timeline.applicationDeadline}
                    </span>
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm text-white/70">
                    <span>Заполнено</span>
                    <span className="tabular-nums">
                      {doneCount} из {activeKeys.length}
                    </span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-white/15"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* форма в 2 колонки */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-10 grid gap-x-6 gap-y-5 md:mt-12 md:grid-cols-2"
              >
                <Field
                  id="f-municipality"
                  label="Город или район"
                  error={errorOf('municipality')}
                  valid={isValid('municipality')}
                >
                  <input
                    id="f-municipality"
                    className={inputCls(errorOf('municipality'))}
                    autoComplete="address-level2"
                    value={form.municipality}
                    onChange={(e) => update('municipality', e.target.value)}
                    onBlur={() => touch('municipality')}
                  />
                </Field>

                <Field
                  id="f-orgName"
                  label="Название организации или ИП"
                  hint="Как в выписке из налоговой"
                  error={errorOf('orgName')}
                  valid={isValid('orgName')}
                >
                  <input
                    id="f-orgName"
                    className={inputCls(errorOf('orgName'))}
                    autoComplete="organization"
                    value={form.orgName}
                    onChange={(e) => update('orgName', e.target.value)}
                    onBlur={() => touch('orgName')}
                  />
                </Field>

                <Field
                  id="f-inn"
                  label="ИНН организации или ИП"
                  error={errorOf('inn')}
                  valid={isValid('inn')}
                >
                  <input
                    id="f-inn"
                    className={inputCls(errorOf('inn')) + ' tabular-nums tracking-wider'}
                    inputMode="numeric"
                    value={form.inn}
                    onChange={(e) => update('inn', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    onBlur={() => touch('inn')}
                  />
                </Field>

                <Field
                  id="f-address"
                  label="Юридический адрес организации"
                  hint={isIP ? 'Для ИП необязательно' : undefined}
                  required={!isIP}
                  error={errorOf('address')}
                  valid={isValid('address')}
                >
                  <input
                    id="f-address"
                    className={inputCls(errorOf('address'))}
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    onBlur={() => touch('address')}
                  />
                </Field>

                <Field
                  id="f-fullName"
                  label="ФИО представителя"
                  error={errorOf('fullName')}
                  valid={isValid('fullName')}
                  className="md:col-span-2"
                >
                  <input
                    id="f-fullName"
                    className={inputCls(errorOf('fullName'))}
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    onBlur={() => touch('fullName')}
                  />
                </Field>

                <Field
                  id="f-phone"
                  label="Контактный телефон"
                  error={errorOf('phone')}
                  valid={isValid('phone')}
                >
                  <input
                    id="f-phone"
                    className={inputCls(errorOf('phone')) + ' tabular-nums'}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="8 (900) 000-00-00"
                    value={formatPhone(form.phone)}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() => touch('phone')}
                  />
                </Field>

                <Field
                  id="f-email"
                  label="Email"
                  error={errorOf('email')}
                  valid={isValid('email')}
                >
                  <input
                    id="f-email"
                    className={inputCls(errorOf('email'))}
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="mail@mail.ru"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    onBlur={() => touch('email')}
                  />
                </Field>

                {/* согласие */}
                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-white/85">
                    <input
                      id="f-consent"
                      type="checkbox"
                      className="peer sr-only"
                      checked={form.consent}
                      onChange={(e) => {
                        update('consent', e.target.checked)
                        touch('consent')
                      }}
                    />
                    <span
                      aria-hidden
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-white/30 ${
                        form.consent
                          ? 'border-white bg-white'
                          : errorOf('consent')
                            ? 'border-white bg-accent/40'
                            : 'border-white/50'
                      }`}
                    >
                      {form.consent && <CheckIcon className="h-3.5 w-3.5 text-primary" />}
                    </span>
                    <span>
                      Согласен(на) на обработку персональных данных по{' '}
                      <a href="/privacy" className="underline underline-offset-2 hover:text-white">
                        политике конфиденциальности
                      </a>
                      <span aria-hidden className="ml-0.5 text-white/60">*</span>
                    </span>
                  </label>
                  <ErrorPill message={errorOf('consent')} />
                </div>

                {/* кнопка */}
                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center md:col-span-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-bold uppercase tracking-wide text-primary transition hover:bg-white/90 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 disabled:opacity-70"
                  >
                    {status === 'sending' && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    )}
                    {status === 'sending' ? 'Отправляем' : 'Отправить заявку'}
                  </button>

                  {status === 'error' && (
                    <p className="text-sm text-white" role="alert">
                      Заявка не отправилась — проверьте интернет и нажмите ещё раз.
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}

/* ---------- Вспомогательные компоненты ---------- */

function inputCls(error: string | null) {
  return [
    'w-full rounded-2xl border px-4 py-3.5 pr-12 text-white placeholder:text-white/40',
    'bg-white/10 backdrop-blur-sm outline-none transition-all duration-200',
    'focus:bg-white/15 focus:border-white focus:ring-4 focus:ring-white/15',
    error ? 'border-white bg-accent/25' : 'border-white/25 hover:border-white/50',
  ].join(' ')
}

function Field({
  id,
  label,
  hint,
  error,
  valid,
  required = true,
  className = '',
  children,
}: {
  id: string
  label: string
  hint?: string
  error: string | null
  valid: boolean
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-semibold">
        {label}
        {required && <span aria-hidden className="ml-0.5 text-white/60">*</span>}
      </label>
      <div className="relative">
        {children}
        <span
          aria-hidden
          className={`pointer-events-none absolute right-4 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-white transition-all duration-300 ${
            valid && !error ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <CheckIcon className="h-3.5 w-3.5 text-primary" />
        </span>
      </div>
      {error ? <ErrorPill message={error} /> : hint && <p className="mt-2 text-sm text-white/65">{hint}</p>}
    </div>
  )
}

function ErrorPill({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-accent"
    >
      <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-accent text-[10px] font-bold leading-none text-white">
        !
      </span>
      {message}
    </p>
  )
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="relative mx-auto max-w-xl py-10 text-center md:py-16" role="status">
      <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-full bg-white">
        <CheckIcon className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-6xl">
        Заявка <span className="font-light">(</span>отправлена<span className="font-light">)</span>
      </h2>
      <p className="mt-6 text-white/80">
        Результаты отбора пришлём на почту после 15 октября. Если понадобятся уточнения — позвоним.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 text-sm text-white/70 underline underline-offset-4 hover:text-white"
      >
        Отправить ещё одну заявку
      </button>
    </div>
  )
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Фоновая графика в духе фирменных орбит — тихая, без анимации */
function Decor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#798FB5]/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#E82B2A]/50 blur-3xl" />
      <svg className="absolute -right-40 -top-40 h-[36rem] w-[36rem] text-white/15" viewBox="0 0 400 400" fill="none">
        <ellipse cx="200" cy="200" rx="190" ry="70" stroke="currentColor" transform="rotate(-25 200 200)" />
        <ellipse cx="200" cy="200" rx="150" ry="150" stroke="currentColor" />
        <circle cx="62" cy="262" r="8" fill="currentColor" />
        <circle cx="335" cy="120" r="5" fill="currentColor" />
      </svg>
    </div>
  )
}