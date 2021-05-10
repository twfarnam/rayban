export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export function preloadImage(href: string): void {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = href
  window.document.head.appendChild(link)
}

export function preloadAudio(src: string, loop = false): void {
  const audio = document.createElement('audio')
  audio.src = src
  audio.loop = loop
  window.document.body.appendChild(audio)
}

export function playAudio(src: string): void {
  const audio = document.querySelector<HTMLAudioElement>(`audio[src="${src}"]`)
  if (audio == null) return
  audio.currentTime = 0
  audio.play()
}
