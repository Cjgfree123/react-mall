import { useState } from 'react'
import type { ImgHTMLAttributes } from 'react'
import { Icon } from './Icon'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onError'> & {
  src: string
  alt: string
}

export function ProductImage({ src, alt, className = '', style, width, height, ...props }: Props) {
  const [failedSource, setFailedSource] = useState<string | null>(null)

  // A different image URL can load normally without an extra reset effect.
  if (failedSource === src) {
    return <span className={`image-fallback ${className}`} style={style} role={alt ? 'img' : undefined} aria-label={alt ? `${alt} — image unavailable` : undefined} aria-hidden={!alt}>
      <Icon name="image" size={28} />
      <span>Image unavailable</span>
    </span>
  }

  return <img {...props} src={src} alt={alt} className={className} style={style} width={width} height={height} onError={() => setFailedSource(src)} />
}
