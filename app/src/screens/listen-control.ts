import { consentWords } from '../consent/strings'

export type ListenControl = {
  word: string
  symbol: 'ear' | 'mic.fill' | 'mic.slash'
  action: 'start' | 'pause' | 'resume' | null
  hint: string | undefined
  // End sits beside the control only while Listen mode is on and not listening (DESIGN, the Listen control).
  showsEnd: boolean
}

// The Listen control's states, as DESIGN's table sets them: Off starts Listen mode, Listening pauses, Paused resumes
// without the card, and Mic off does nothing, since the caption says why.
export function listenControl(state: { active: boolean; micUnavailable: boolean; paused: boolean }): ListenControl {
  if (!state.active) return { word: 'Listen', symbol: 'ear', action: 'start', hint: undefined, showsEnd: false }
  if (state.micUnavailable) {
    return { word: consentWords.micOff, symbol: 'mic.slash', action: null, hint: undefined, showsEnd: true }
  }
  if (state.paused) {
    return { word: 'Paused', symbol: 'mic.slash', action: 'resume', hint: 'Resumes listening', showsEnd: true }
  }
  return { word: 'Listening', symbol: 'mic.fill', action: 'pause', hint: 'Pauses listening', showsEnd: false }
}
