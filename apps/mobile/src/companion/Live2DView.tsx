import Constants from 'expo-constants'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import WebView from 'react-native-webview'
import { LIVE2D_PAGE, type LiveEvent, type LiveFit, type LiveInit } from './live2d'
import type { CompanionModel } from './settings'
import type { FaceFrame } from './state'

/** Whether this build carries the live renderer; the Simulator build fetches it, and a build without it keeps to the
 * frames. */
export const live2dBundled = Constants.expoConfig?.extra?.live2d === true

/** Whether a model's live view has drawn, so the frames beneath it can go. Keyed by model, so a new model starts on its
 * frames until its own view draws. */
export function useLive(model: CompanionModel | null) {
  const [drawn, setDrawn] = useState<CompanionModel | null>(null)
  const onLive = useCallback((live: boolean) => setDrawn(live ? model : null), [model])
  return { live: model !== null && drawn === model, onLive }
}

/** The live model (the handoff's step 6), drawn by the Cubism SDK in a web view over the model's frames and posed from
 * the frame they would show. It tells `onLive` once it has drawn, and again if it stops, so the frames come back.
 * Give it `key={model}`, since the page loads one model. */
export default function Live2DView({
  model,
  fit,
  frame,
  animate,
  onLive
}: {
  model: CompanionModel
  fit: LiveFit
  frame: FaceFrame
  animate: boolean
  onLive: (live: boolean) => void
}) {
  const web = useRef<WebView>(null)
  const [failed, setFailed] = useState(false)
  // The first pose, set before the page loads; later poses go to window.turnSet, or into turnInit while it loads.
  const [init] = useState<LiveInit>({ model, fit, frame, animate })

  useEffect(() => {
    const update = JSON.stringify({ frame, animate })
    web.current?.injectJavaScript(
      `window.turnInit&&Object.assign(window.turnInit,${update});window.turnSet&&window.turnSet(${update});true;`
    )
  }, [frame, animate])

  if (!live2dBundled || failed) return null
  const fail = () => {
    setFailed(true)
    onLive(false)
  }
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      <WebView
        ref={web}
        source={{ uri: LIVE2D_PAGE }}
        allowingReadAccessToURL="Live2D"
        originWhitelist={['file://*']}
        injectedJavaScriptBeforeContentLoaded={`window.turnInit=${JSON.stringify(init)};true;`}
        onMessage={(event) => {
          const message = JSON.parse(event.nativeEvent.data) as LiveEvent
          if (message.type === 'ready') onLive(true)
          else fail()
        }}
        onError={fail}
        onContentProcessDidTerminate={fail}
        scrollEnabled={false}
        bounces={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        webviewDebuggingEnabled={__DEV__}
        style={{ flex: 1, backgroundColor: 'transparent' }}
      />
    </View>
  )
}
