import Logo from '../components/Logo'
import legal from '../data/legal.json'
import texts from '../data/texts.json'

type Block = string | { list: string[] } | { rows: string[] }
type Section = { heading: string; blocks: Block[] }
type Doc = {
  title: string
  updated?: string
  intro?: string[]
  sections: Section[]
  requisites?: { heading: string; rows: string[] }
}

function Rows({ rows }: { rows: string[] }) {
  return (
    <div className="mt-4 space-y-1 rounded-2xl bg-surface p-6 text-dark/75">
      {rows.map((r) => (
        <p key={r}>{r}</p>
      ))}
    </div>
  )
}

function BlockView({ block }: { block: Block }) {
  if (typeof block === 'string') {
    return <p className="mt-4 leading-relaxed text-dark/75">{block}</p>
  }
  if ('list' in block) {
    return (
      <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-dark/75 marker:text-primary">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  return <Rows rows={block.rows} />
}

export default function LegalPage({ doc }: { doc: 'privacy' | 'terms' }) {
  const d = legal[doc] as Doc
  const other =
    doc === 'privacy'
      ? { href: '/terms/', title: 'Пользовательское соглашение' }
      : { href: '/privacy/', title: 'Политика конфиденциальности' }

  return (
    <div className="min-h-screen bg-white text-dark">
      <header className="bg-primary text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <a href="/" aria-label="На главную">
            <Logo className="h-8 w-auto text-white" />
          </a>
          <a href="/" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            ← На главную
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <h1 className="text-3xl font-extrabold leading-tight text-primary md:text-5xl">{d.title}</h1>
        {d.updated && <p className="mt-4 text-sm text-dark/50">Редакция от {d.updated}</p>}

        {d.intro?.map((p) => (
          <p key={p} className="mt-6 text-lg leading-relaxed text-dark/80">
            {p}
          </p>
        ))}

        {/* оглавление */}
        <nav aria-label="Содержание" className="mt-10 rounded-2xl bg-surface p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark/50">Содержание</p>
          <ol className="space-y-1.5">
            {d.sections.map((s, i) => (
              <li key={s.heading}>
                <a href={`#s-${i + 1}`} className="text-primary transition-colors hover:text-accent">
                  {i + 1}. {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {d.sections.map((s, i) => (
          <section key={s.heading} id={`s-${i + 1}`} className="mt-12 scroll-mt-8">
            <h2 className="text-xl font-bold md:text-2xl">
              {i + 1}. {s.heading}
            </h2>
            {s.blocks.map((b, k) => (
              <BlockView key={k} block={b} />
            ))}
          </section>
        ))}

        {d.requisites && (
          <section className="mt-12">
            <h2 className="text-xl font-bold md:text-2xl">{d.requisites.heading}</h2>
            <Rows rows={d.requisites.rows} />
          </section>
        )}
      </main>
      <footer className="border-t border-dark/10">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-10 text-sm text-dark/60 sm:flex-row sm:justify-between md:py-12">
          <p>{texts.footer.copyright}</p>
          <a href={other.href} className="transition-colors hover:text-primary">
            {other.title}
          </a>
        </div>
      </footer>
    </div>
  )
}