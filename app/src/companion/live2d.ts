import type { CompanionModel } from './settings'
import type { FaceFrame } from './state'

// The live renderer (the handoff's step 6): each model drawn by the Cubism SDK for Web in a web view, in place of its
// frames once it has drawn. This module is shared by the app and the page, app/live2d/renderer.ts, so both agree.

/** Where the page sits in the app's bundle, which scripts/fetch-companion-models.ts builds at build time. */
export const LIVE2D_PAGE = 'Live2D/index.html'

/** The face's 52-point circle, or the partner view's 370 by 440 portrait. */
export type LiveFit = 'face' | 'portrait'

/** What the app tells the page: the model and fit once, then the frame to pose and whether it may move. */
export type LiveInit = { model: CompanionModel; fit: LiveFit; frame: FaceFrame; animate: boolean }
export type LiveUpdate = { frame: FaceFrame; animate: boolean }

/** What the page tells the app: it has drawn the model, or it can't. */
export type LiveEvent = { type: 'ready' } | { type: 'error'; message: string }

/** A pose: eyes 1 open to 0 shut, mouth 0 shut to 1 open, and look up (above 0) or down (below 0), -1 a full nod. */
export type LivePose = { eyes: number; mouth: number; look: number }

/** The pose for a frame, so the live face keeps the frames' timing: the mouth's three steps while Turn speaks, the
 * blink at rest, looking up while the partner talks, and down while you type. */
export function livePose(frame: FaceFrame): LivePose {
  switch (frame) {
    case 'half':
      return { eyes: 1, mouth: 0.5, look: 0 }
    case 'open':
      return { eyes: 1, mouth: 1, look: 0 }
    case 'blink':
      return { eyes: 0, mouth: 0, look: 0 }
    case 'listen':
      return { eyes: 1, mouth: 0, look: 0.75 }
    case 'type':
      return { eyes: 1, mouth: 0, look: -1 }
    default:
      return { eyes: 1, mouth: 0, look: 0 }
  }
}

/** A view of a model: its centre as fractions of the model's canvas from the top left, and the share of the canvas's
 * height it shows. The view's width follows the fit's shape. */
export type LiveFraming = { x: number; y: number; height: number }

// Matched to each model's frames in headless Chromium, so the live face sits where its frames do.
export const liveFraming: Record<CompanionModel, Record<LiveFit, LiveFraming>> = {
  ren: { face: { x: 0.4988, y: 0.1006, height: 0.1424 }, portrait: { x: 0.497, y: 0.1711, height: 0.2812 } },
  suit: { face: { x: 0.5039, y: 0.1071, height: 0.156 }, portrait: { x: 0.5, y: 0.1765, height: 0.2805 } },
  ice: { face: { x: 0.5004, y: 0.1426, height: 0.1851 }, portrait: { x: 0.4998, y: 0.1934, height: 0.2805 } },
  office: { face: { x: 0.5019, y: 0.0992, height: 0.2062 }, portrait: { x: 0.5, y: 0.204, height: 0.3928 } }
}
