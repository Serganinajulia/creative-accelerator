import type { ReactNode } from 'react'

type SectionHeadingProps = {
  children: ReactNode
  /** белый текст (для тёмного/градиентного фона), по умолчанию — фирменный синий на светлом */
  light?: boolean
  /** обрамить скобками-рамкой сверху/снизу (для акцентных врезок, не для каждого блока) */
  brackets?: boolean
  /** цвет самих скобок — независим от цвета текста заголовка */
  bracketColor?: 'primary' | 'accent' | 'white'
  className?: string
}

/**
 * Единый фирменный стиль заголовков блоков: размер задан через clamp
 * в .heading-brand (index.css), пропорционально уменьшается на узких
 * экранах. Цвет текста, наличие и цвет скобок-рамки — настраиваются
 * пропсами под конкретный блок.
 */
export default function SectionHeading({
  children,
  light,
  brackets,
  bracketColor = 'primary',
  className,
}: SectionHeadingProps) {
  const heading = (
    <h2 className={`heading-brand ${light ? 'text-white' : 'text-primary'} ${className ?? ''}`}>
      {children}
    </h2>
  )

  if (!brackets) return heading

  return <div className={`bracket-frame bracket-frame--${bracketColor}`}>{heading}</div>
}