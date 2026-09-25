import type { ReactNode } from 'react'

type Align = 'responsive' | 'left' | 'center'

type SectionHeadingProps = {
  children: ReactNode
  /** Подзаголовок-описание под заголовком. Выравнивается вместе с заголовком */
  description?: ReactNode
  /**
   * Выравнивание:
   *  responsive (по умолчанию): по центру на мобилке и планшете, слева с десктопа (lg)
   *  left: всегда слева
   *  center: всегда по центру
   */
  align?: Align
  /** белый текст (для тёмного/градиентного фона), по умолчанию — фирменный синий на светлом */
  light?: boolean
  /** обрамить скобками-рамкой сверху/снизу (для акцентных врезок, не для каждого блока) */
  brackets?: boolean
  /** цвет самих скобок — независим от цвета текста заголовка */
  bracketColor?: 'primary' | 'accent' | 'white'
  /** вариант слова в {фигурных скобках}: accent → bracket-word--accent, white → bracket-word--white */
  wordVariant?: 'accent' | 'white'
  /** классы для самого h2 (как раньше) */
  className?: string
  /** классы для всей шапки (заголовок + описание), например отступ снизу */
  wrapperClassName?: string
}

const TEXT_ALIGN: Record<Align, string> = {
  responsive: 'text-center lg:text-left',
  left: 'text-left',
  center: 'text-center',
}

/** Описание ограничено по ширине, поэтому при центровке его тоже надо центрировать блоком */
const BLOCK_ALIGN: Record<Align, string> = {
  responsive: 'mx-auto lg:mx-0',
  left: '',
  center: 'mx-auto',
}

/**
 * Строка из JSON вида «Подать {заявку}» → «Подать <span class="bracket-word">заявку</span>».
 * Если передан JSX, а не строка, он выводится как есть.
 */
function renderBrackets(node: ReactNode, variant?: 'accent' | 'white'): ReactNode {
  if (typeof node !== 'string') return node
  return node.split(/(\{[^}]+\})/).map((part, i) =>
    part.startsWith('{') && part.endsWith('}') ? (
      <span key={i} className={`bracket-word${variant ? ` bracket-word--${variant}` : ''}`}>
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  )
}

/**
 * Единый фирменный стиль заголовков блоков: размер задан через clamp
 * в .heading-brand (index.css), пропорционально уменьшается на узких
 * экранах. Цвет текста, наличие и цвет скобок-рамки — настраиваются
 * пропсами под конкретный блок.
 */
export default function SectionHeading({
  children,
  description,
  align = 'responsive',
  light,
  brackets,
  bracketColor = 'primary',
  wordVariant,
  className,
  wrapperClassName,
}: SectionHeadingProps) {
  const h2 = (
    <h2 className={`heading-brand ${light ? 'text-white' : 'text-primary'} ${className ?? ''}`}>
      {renderBrackets(children, wordVariant)}
    </h2>
  )

  const heading = brackets ? (
    <div className={`bracket-frame bracket-frame--${bracketColor}`}>{h2}</div>
  ) : (
    h2
  )

  return (
    <header className={`${TEXT_ALIGN[align]} ${wrapperClassName ?? ''}`}>
      {heading}
      {description && (
        <p
          className={`max-w-2xl text-base leading-relaxed md:text-lg ${
            light ? 'text-white/70' : 'text-dark/70'
          } ${BLOCK_ALIGN[align]}`}
        >
          {description}
        </p>
      )}
    </header>
  )
}