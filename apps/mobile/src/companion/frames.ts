import type { ImageSourcePropType } from 'react-native'
import type { CompanionModel } from './settings'
import type { FaceFrame } from './state'

export type PortraitFrame = Extract<FaceFrame, 'rest' | 'half' | 'open' | 'blink'>

export const FACE_FRAMES: readonly FaceFrame[] = ['rest', 'half', 'open', 'blink', 'listen', 'type']
export const PORTRAIT_FRAMES: readonly PortraitFrame[] = ['rest', 'half', 'open', 'blink']

type Frames = {
  face: Record<FaceFrame, ImageSourcePropType>
  portrait: Record<PortraitFrame, ImageSourcePropType>
}

// Each model's frames, drawn by Live2D's own SDK and exported from the handoff's board at 2x and 3x: 52-point faces
// for the circle, and 370 by 440 portraits for the partner view and Settings' tiles.
export const companionFrames: Record<CompanionModel, Frames> = {
  ren: {
    face: {
      rest: require('../../assets/companion/ren/face-rest.png'),
      half: require('../../assets/companion/ren/face-half.png'),
      open: require('../../assets/companion/ren/face-open.png'),
      blink: require('../../assets/companion/ren/face-blink.png'),
      listen: require('../../assets/companion/ren/face-listen.png'),
      type: require('../../assets/companion/ren/face-type.png')
    },
    portrait: {
      rest: require('../../assets/companion/ren/portrait-rest.png'),
      half: require('../../assets/companion/ren/portrait-half.png'),
      open: require('../../assets/companion/ren/portrait-open.png'),
      blink: require('../../assets/companion/ren/portrait-blink.png')
    }
  },
  suit: {
    face: {
      rest: require('../../assets/companion/suit/face-rest.png'),
      half: require('../../assets/companion/suit/face-half.png'),
      open: require('../../assets/companion/suit/face-open.png'),
      blink: require('../../assets/companion/suit/face-blink.png'),
      listen: require('../../assets/companion/suit/face-listen.png'),
      type: require('../../assets/companion/suit/face-type.png')
    },
    portrait: {
      rest: require('../../assets/companion/suit/portrait-rest.png'),
      half: require('../../assets/companion/suit/portrait-half.png'),
      open: require('../../assets/companion/suit/portrait-open.png'),
      blink: require('../../assets/companion/suit/portrait-blink.png')
    }
  },
  ice: {
    face: {
      rest: require('../../assets/companion/ice/face-rest.png'),
      half: require('../../assets/companion/ice/face-half.png'),
      open: require('../../assets/companion/ice/face-open.png'),
      blink: require('../../assets/companion/ice/face-blink.png'),
      listen: require('../../assets/companion/ice/face-listen.png'),
      type: require('../../assets/companion/ice/face-type.png')
    },
    portrait: {
      rest: require('../../assets/companion/ice/portrait-rest.png'),
      half: require('../../assets/companion/ice/portrait-half.png'),
      open: require('../../assets/companion/ice/portrait-open.png'),
      blink: require('../../assets/companion/ice/portrait-blink.png')
    }
  },
  office: {
    face: {
      rest: require('../../assets/companion/office/face-rest.png'),
      half: require('../../assets/companion/office/face-half.png'),
      open: require('../../assets/companion/office/face-open.png'),
      blink: require('../../assets/companion/office/face-blink.png'),
      listen: require('../../assets/companion/office/face-listen.png'),
      type: require('../../assets/companion/office/face-type.png')
    },
    portrait: {
      rest: require('../../assets/companion/office/portrait-rest.png'),
      half: require('../../assets/companion/office/portrait-half.png'),
      open: require('../../assets/companion/office/portrait-open.png'),
      blink: require('../../assets/companion/office/portrait-blink.png')
    }
  }
}
