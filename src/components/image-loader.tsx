interface ImageLoader {
  src: string
  width: number
  quality?: number
}

export const imageLoader = ({ src, width, quality }: ImageLoader) => {
  return `${src}?w=${width}&q=${quality || 75}`
}
