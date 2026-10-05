export type CompanionState = 'rest' | 'speaking' | 'listening' | 'typing'
export type FaceFrame = 'rest' | 'half' | 'open' | 'blink' | 'listen' | 'type'

export type FaceMotion = { kind: 'still'; frame: FaceFrame } | { kind: 'mouth' } | { kind: 'blink' }

// About 8 frames a second while Turn speaks, and a 120 ms blink every 4 to 6 seconds at rest (the companion handoff).
export const MOUTH_FRAMES = ['rest', 'half', 'open'] as const
export const MOUTH_MS = 125
export const BLINK_MS = 120

/** The face's state, first match wins: Speaking while Turn speaks, Typing while the composer has focus, Listening
 * while the partner's words arrive, and Rest otherwise. */
export function companionState(input: { speaking: boolean; typing: boolean; listening: boolean }): CompanionState {
  if (input.speaking) return 'speaking'
  if (input.typing) return 'typing'
  if (input.listening) return 'listening'
  return 'rest'
}

/** How the face moves in a state. `animate` is Let it move without Reduce Motion; without it the face holds still,
 * on the half-open mouth while Turn speaks. */
export function faceMotion(state: CompanionState, animate: boolean): FaceMotion {
  if (state === 'speaking') return animate ? { kind: 'mouth' } : { kind: 'still', frame: 'half' }
  if (state === 'typing') return { kind: 'still', frame: 'type' }
  if (state === 'listening') return { kind: 'still', frame: 'listen' }
  return animate ? { kind: 'blink' } : { kind: 'still', frame: 'rest' }
}

export function blinkGap(random: () => number): number {
  return 4000 + random() * 2000
}

type Clock = {
  setTimeout(run: () => void, ms: number): ReturnType<typeof setTimeout>
  clearTimeout(timer: ReturnType<typeof setTimeout>): void
  random(): number
}

const systemClock: Clock = {
  setTimeout: (run, ms) => setTimeout(run, ms),
  clearTimeout: (timer) => clearTimeout(timer),
  random: Math.random
}

/** Shows a motion's frames through `show`, on timers only while the face moves; returns a stop. */
export function playFace(motion: FaceMotion, show: (frame: FaceFrame) => void, clock: Clock = systemClock) {
  if (motion.kind === 'still') {
    show(motion.frame)
    return () => {}
  }
  let timer: ReturnType<typeof setTimeout> | null = null
  if (motion.kind === 'mouth') {
    let index = 0
    const step = () => {
      show(MOUTH_FRAMES[index % MOUTH_FRAMES.length])
      index += 1
      timer = clock.setTimeout(step, MOUTH_MS)
    }
    step()
  } else {
    const open = () => {
      show('rest')
      timer = clock.setTimeout(blink, blinkGap(clock.random))
    }
    const blink = () => {
      show('blink')
      timer = clock.setTimeout(open, BLINK_MS)
    }
    open()
  }
  return () => {
    if (timer !== null) clock.clearTimeout(timer)
  }
}
