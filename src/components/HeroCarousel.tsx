import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from './Icon'
import { ProductImage } from './ProductImage'

const slides = [
  { id: 'everyday', theme: 'sage', images: ['lamp', 'mug', 'vase'] },
  { id: 'travel', theme: 'clay', images: ['tote', 'bottle', 'notebook'] },
  { id: 'work', theme: 'blue', images: ['notebook', 'clock', 'lamp'] },
] as const

export function HeroCarousel() {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(!document.hidden)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const autoPlay = !paused && !hovered && !focused && visible && !reducedMotion
  const slide = slides[index]
  const slideKey = `carousel.slides.${slide.id}`

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = () => setReducedMotion(media.matches)
    const onVisibilityChange = () => setVisible(!document.hidden)
    media.addEventListener('change', onMotionChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      media.removeEventListener('change', onMotionChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!autoPlay) return
    const timeout = window.setTimeout(() => setIndex((previous) => (previous + 1) % slides.length), 5000)
    return () => window.clearTimeout(timeout)
  }, [index, autoPlay])

  function move(direction: number) {
    setIndex((previous) => (previous + direction + slides.length) % slides.length)
  }

  return <section className="hero-carousel" aria-label={t('carousel.label')} aria-roledescription={t('carousel.role')} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <a className={`hero hero-slide hero-${slide.theme}`} href="#collection" aria-label={t('carousel.link', { action: t(`${slideKey}.action`) })}
      onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; swiped.current = false }}
      onTouchCancel={() => { touchStart.current = null }}
      onTouchEnd={(event) => {
        const start = touchStart.current
        touchStart.current = null
        if (!start) return
        const touch = event.changedTouches[0]
        const dx = touch.clientX - start.x
        const dy = touch.clientY - start.y
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
          swiped.current = true
          move(dx < 0 ? 1 : -1)
        }
      }}
      onClick={(event) => { if (swiped.current) { event.preventDefault(); swiped.current = false } }}>
      <div className="hero-copy" key={index}>
        <span className="eyebrow"><span className="little-dot" />{t(`${slideKey}.eyebrow`)}</span>
        <h1>{t(`${slideKey}.title`)}<br /><em>{t(`${slideKey}.emphasis`)}</em></h1>
        <p>{t(`${slideKey}.description`)}</p>
        <span className="primary-button">{t(`${slideKey}.action`)}<Icon name="arrow" size={18} /></span>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="art-circle" />
        <span className="art-caption">{t('carousel.caption')}</span>
        <ProductImage className="hero-lamp" src={`/products/${slide.images[0]}.svg`} alt="" />
        <ProductImage className="hero-mug" src={`/products/${slide.images[1]}.svg`} alt="" />
        <ProductImage className="hero-vase" src={`/products/${slide.images[2]}.svg`} alt="" />
        <div className="art-platform" />
      </div>
    </a>
    <div className="carousel-controls" role="group" aria-label={t('carousel.controls')}>
      <button className="carousel-previous" aria-label={t('carousel.previous')} onClick={() => move(-1)}><Icon name="arrow" size={18} /></button>
      <div className="carousel-dots">{slides.map((item, slideIndex) => <button key={item.id} aria-label={t('carousel.goTo', { number: slideIndex + 1, label: t(`carousel.slides.${item.id}.label`) })} aria-pressed={index === slideIndex} onClick={() => setIndex(slideIndex)}><span /></button>)}</div>
      <button aria-label={t('carousel.next')} onClick={() => move(1)}><Icon name="arrow" size={18} /></button>
      <button aria-label={t(paused ? 'carousel.resume' : 'carousel.pause')} aria-pressed={paused} onClick={() => setPaused((previous) => !previous)}><Icon name={paused ? 'play' : 'pause'} size={16} /></button>
    </div>
    <span className="sr-only" role="status" aria-live={autoPlay ? 'off' : 'polite'}>{t('carousel.status', { number: index + 1, total: slides.length, label: t(`${slideKey}.label`) })}</span>
  </section>
}
