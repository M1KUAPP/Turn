// Speaks a phrase with the browser's voice, standing in for the person's own.
let voice: SpeechSynthesisVoice | null = null

function pickVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  const preferred = [
    'Samantha',
    'Ava',
    'Allison',
    'Google US English',
    'Microsoft Aria',
    'Microsoft Jenny',
    'Karen',
    'Daniel'
  ]
  for (const name of preferred) {
    const match = english.find((v) => v.name.includes(name))
    if (match) return match
  }
  return english[0] ?? voices[0] ?? null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  voice = pickVoice()
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    voice = pickVoice()
  })
}

/** Says `text`; resolves when speech ends, or after an estimate when speech isn't available. */
export function say(text: string): Promise<void> {
  const estimate = Math.max(900, text.length * 70)
  if (!('speechSynthesis' in window)) return new Promise((r) => setTimeout(r, estimate))
  window.speechSynthesis.cancel()
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    if (voice) u.voice = voice
    u.rate = 1
    let done = false
    const finish = () => {
      if (done) return
      done = true
      resolve()
    }
    u.onend = finish
    u.onerror = finish
    // Some browsers never fire onend; never hang the animation on them.
    setTimeout(finish, estimate + 2500)
    window.speechSynthesis.speak(u)
  })
}
