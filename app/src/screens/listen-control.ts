import { consentWords } from '../consent/strings'

export type ListenControl = {
  word: string
  symbol: 'ear' | 'lock' | 'mic.fill' | 'mic.slash'
  action: 'start' | 'unlock' | 'pause' | 'resume' | null
  hint: string | undefined
  // Under the word while Listen mode is off: the free lines left, or "Unlock" once none are (PAY-1, PAY-2).
  detail: string | null
  // End sits beside the control only while Listen mode is on and not listening (DESIGN, the Listen control).
  showsEnd: boolean
}

// The Listen control's states, as DESIGN's table sets them: Off starts Listen mode, Locked opens the paywall,
// Listening pauses, Paused resumes without the card, and Mic off does nothing, since the caption says why.
export function listenControl(state: {
  active: boolean
  micUnavailable: boolean
  paused: boolean
  locked: boolean
  countLabel: string | null
}): ListenControl {
  if (!state.active && state.locked) {
    return {
      word: 'Listen',
      symbol: 'lock',
      action: 'unlock',
      hint: 'Opens Turn Listen',
      detail: 'Unlock',
      showsEnd: false
    }
  }
  if (!state.active) {
    return {
      word: 'Listen',
      symbol: 'ear',
      action: 'start',
      hint: undefined,
      detail: state.countLabel,
      showsEnd: false
    }
  }
  if (state.micUnavailable) {
    return {
      word: consentWords.micOff,
      symbol: 'mic.slash',
      action: null,
      hint: undefined,
      detail: null,
      showsEnd: true
    }
  }
  if (state.paused) {
    return {
      word: 'Paused',
      symbol: 'mic.slash',
      action: 'resume',
      hint: 'Resumes listening',
      detail: null,
      showsEnd: true
    }
  }
  return {
    word: 'Listening',
    symbol: 'mic.fill',
    action: 'pause',
    hint: 'Pauses listening',
    detail: null,
    showsEnd: false
  }
}
