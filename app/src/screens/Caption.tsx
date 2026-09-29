import { useEffect, useRef, useState } from 'react'
import { SymbolView } from 'expo-symbols'
import { Pressable, useColorScheme, View } from 'react-native'
import Animated, {
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue
} from 'react-native-reanimated'
import { colorValues, colors } from '../constants/theme'
import { listenStrings } from '../listen/strings'
import { freshStart, wordSegments, type CaptionView, type WordSegment } from './caption-view'
import { listeningGlow, useDepth } from './home-depth'
import { modelProgressWords } from './home-layout'
import { useListenLight } from './listen-light'
import TurnText from './TurnText'

type Props = {
  view: CaptionView
  height: number
  // From AX1 the caption grows to fit its label, note, and prompt; only the partner's words keep their lines.
  grows: boolean
  oneLine: boolean
  fontScale: number
  boldText: boolean
  reduceMotion: boolean
  increaseContrast: boolean
  // The partner's loudness, 0 to 1, which the meter follows.
  level: number
  model: { progress: number; secondsLeft: number | null } | null
  onType: (() => void) | null
  onDone: () => void
  onClear: () => void
}

type Inks = { ink: string; soft: string }

// The ink and the arrival highlight as plain colors in this appearance, since a fade needs values it can mix.
function useInks(increaseContrast: boolean): Inks {
  const dark = useColorScheme() === 'dark'
  const mode = dark ? (increaseContrast ? 'dark-hc' : 'dark') : increaseContrast ? 'light-hc' : 'light'
  return { ink: colorValues.ink[mode], soft: colorValues['listen-soft'][mode] }
}

const clear = (hex: string) =>
  `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, 0)`

// Words arriving (plan 0044's motion): new words fade in over 120 ms, and the newest sits on `listen-soft`, which
// fades over 600 ms. Reduce Motion shows them at once and keeps the highlight on the newest word until the line ends.
function ArrivingWords({ segment, inks, reduceMotion }: { segment: WordSegment; inks: Inks; reduceMotion: boolean }) {
  const shown = useSharedValue(segment.fade && !reduceMotion ? 0 : 1)
  const lit = useSharedValue(segment.highlight ? 1 : 0)
  useEffect(() => {
    if (reduceMotion) return
    if (segment.fade) shown.value = withTiming(1, { duration: 120, reduceMotion: ReduceMotion.Never })
    if (segment.highlight) lit.value = withTiming(0, { duration: 600, reduceMotion: ReduceMotion.Never })
  }, [segment.fade, segment.highlight, reduceMotion, shown, lit])
  const inkClear = clear(inks.ink)
  const softClear = clear(inks.soft)
  const style = useAnimatedStyle(() => ({
    color: interpolateColor(shown.value, [0, 1], [inkClear, inks.ink]),
    backgroundColor: interpolateColor(lit.value, [0, 1], [softClear, inks.soft])
  }))
  return <Animated.Text style={style}>{segment.text}</Animated.Text>
}

// The words that came with this text, remembered from the text before it.
function useFreshStart(text: string) {
  const last = useRef({ text: '', start: 0 })
  if (last.current.text !== text) last.current = { text, start: freshStart(text, last.current.text) }
  return last.current.start
}

/** The partner's words in up to `lines` lines: a longer line shows its last lines, cut at the start with an ellipsis,
 * since the newest words matter most; the caption's label gives VoiceOver the whole line (DESIGN, the caption). While
 * the partner speaks, the words that arrive animate inside those lines, which keep their text and so their cut. */
function CaptionWords({
  text,
  lines,
  hearing,
  reduceMotion,
  increaseContrast,
  boldText
}: {
  text: string
  lines: number
  hearing: boolean
  reduceMotion: boolean
  increaseContrast: boolean
  boldText: boolean
}) {
  const [tail, setTail] = useState<{ text: string; lines: number; shown: string[] } | null>(null)
  const visibleTail = tail?.text === text && tail.lines === lines ? tail.shown : null
  const inks = useInks(increaseContrast)
  const fresh = useFreshStart(text)
  const arriving = (line: string, lineStart: number) =>
    hearing
      ? wordSegments(text, fresh, lineStart).map((segment, index) =>
          segment.fade || segment.highlight ? (
            <ArrivingWords key={`${text}-${index}`} segment={segment} inks={inks} reduceMotion={reduceMotion} />
          ) : (
            segment.text
          )
        )
      : line

  return (
    <View>
      {visibleTail ? (
        visibleTail.map((line, index) => (
          <TurnText
            key={index}
            kind="partner-line"
            boldText={boldText}
            numberOfLines={1}
            ellipsizeMode="head"
            style={{ color: colors.ink }}
          >
            {index === 0 ? '…' : ''}
            {index === visibleTail.length - 1 ? arriving(line, text.trimEnd().length - line.length) : line}
          </TurnText>
        ))
      ) : (
        <TurnText kind="partner-line" boldText={boldText} numberOfLines={lines} style={{ color: colors.ink }}>
          {arriving(text, 0)}
        </TurnText>
      )}
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: 0 }}
      >
        <TurnText
          kind="partner-line"
          boldText={boldText}
          onTextLayout={({ nativeEvent }) => {
            const measured = nativeEvent.lines.map((line) => line.text.trim())
            const shown = measured.length > lines ? measured.slice(-lines) : null
            setTail((previous) =>
              shown === null
                ? null
                : previous?.text === text && previous.lines === lines && previous.shown.join('\n') === shown.join('\n')
                  ? previous
                  : { text, lines, shown }
            )
          }}
        >
          {text}
        </TurnText>
      </View>
    </View>
  )
}

function Light({ ringStyle }: { ringStyle: ReturnType<typeof useListenLight> }) {
  return (
    <View accessible={false} style={{ width: 10, height: 10 }}>
      <Animated.View
        style={[
          { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: colors['listen-glow'] },
          ringStyle
        ]}
      />
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.listen }} />
    </View>
  )
}

const FLAT = 3
const METER_HEIGHT = 18
// Each bar's share of the meter's height at its loudest, so the five never rise as one.
const peaks = [0.5, 0.8, 1, 0.65, 0.85]
const spring = { damping: 18, stiffness: 220, reduceMotion: ReduceMotion.Never }

function Bar({ level }: { level: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({ height: level.value }))
  return <Animated.View style={[{ width: 3, borderRadius: 1.5, backgroundColor: colors.listen }, style]} />
}

// The meter (plan 0044's motion): the five bars spring to the partner's level each time the session publishes it, up to
// ten times a second, each to its own share of the height, and settle flat in silence. An engine that measures no level
// leaves them flat. Reduce Motion hides the meter.
function Meter({ level }: { level: number }) {
  const bars = [
    useSharedValue(FLAT),
    useSharedValue(FLAT),
    useSharedValue(FLAT),
    useSharedValue(FLAT),
    useSharedValue(FLAT)
  ]
  useEffect(() => {
    bars.forEach((bar, index) => {
      bar.value = withSpring(FLAT + (METER_HEIGHT - FLAT) * peaks[index] * level, spring)
    })
    // The five shared values are stable for the meter's life.
  }, [level])
  return (
    <View accessible={false} style={{ flexDirection: 'row', alignItems: 'center', gap: 2.5, height: METER_HEIGHT }}>
      {bars.map((bar, index) => (
        <Bar key={index} level={bar} />
      ))}
    </View>
  )
}

export default function Caption({
  view,
  height,
  grows,
  oneLine,
  fontScale,
  boldText,
  reduceMotion,
  increaseContrast,
  level,
  model,
  onType,
  onDone,
  onClear
}: Props) {
  const depth = useDepth()
  const ringStyle = useListenLight(view.lineOpen, reduceMotion)
  const [labelRow, setLabelRow] = useState({ y: 0, height: 20 })
  const [pill, setPill] = useState({ width: 0, height: 32 })
  // The lamp: an orange edge and glow while the session opens and while the partner speaks (frames 03, 04); once
  // they've said their line, the panel rests on its usual edge while the capsule stays lit.
  const lamp = view.micOn && (view.kind === 'opening' || view.lineOpen)
  const edgeWidth = 1.5
  const lampValue = useSharedValue(lamp ? 1 : 0)
  // Listening starts (plan 0044's motion): the orange edge and its glow fade in over 400 ms, and out as the line
  // ends, or switch at once under Reduce Motion. They sit over the panel's own edge, so the words never move.
  useEffect(() => {
    lampValue.value = reduceMotion
      ? lamp
        ? 1
        : 0
      : withTiming(lamp ? 1 : 0, { duration: 400, reduceMotion: ReduceMotion.Never })
  }, [lamp, reduceMotion, lampValue])
  const lampStyle = useAnimatedStyle(() => ({ opacity: lampValue.value }))
  const scale = Math.min(fontScale, 2)
  // Done or Clear keeps the top-right corner: beside the label below AX1, and above the content once the caption grows,
  // where the pill is too wide to share a line.
  const besidePill = view.button && !grows ? pill.width + 8 : 0
  const abovePill = view.button && grows ? pill.height + 8 : 0
  const accessibilityLabel =
    view.kind === 'model' && model
      ? `${listenStrings.gettingModel}, ${modelProgressWords(model.progress, model.secondsLeft)}`
      : view.accessibilityLabel
  const discMessage =
    view.kind === 'mic-off' && view.label
      ? `${view.label.endsWith('.') ? view.label : `${view.label}.`} ${view.words}`
      : view.words

  const content = oneLine ? (
    // One line on short screens: the note, or else the label, then the newest words.
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {(view.note ?? view.label) && (
        <TurnText
          kind="label"
          boldText={boldText}
          numberOfLines={1}
          style={{ color: colors['ink-secondary'], maxWidth: '50%' }}
        >
          {view.note ?? view.label}
        </TurnText>
      )}
      <TurnText
        kind="partner-line-small"
        boldText={boldText}
        numberOfLines={1}
        ellipsizeMode="head"
        style={{ color: view.kind === 'off' ? colors['ink-secondary'] : colors.ink, flex: 1 }}
      >
        {view.words}
      </TurnText>
    </View>
  ) : view.kind === 'off' || view.kind === 'mic-off' || view.kind === 'paused' ? (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingRight: besidePill
      }}
    >
      <View
        style={{
          width: Math.round(48 * scale),
          height: Math.round(48 * scale),
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: view.discSymbol === 'keyboard' ? colors['listen-soft'] : colors['surface-sunken']
        }}
      >
        <SymbolView
          name={view.discSymbol}
          size={Math.round(24 * scale)}
          weight="semibold"
          tintColor={view.kind === 'mic-off' ? colors.ink : colors['ink-secondary']}
          accessible={false}
        />
      </View>
      <TurnText
        kind="title"
        boldText={boldText}
        style={{ color: view.kind === 'mic-off' ? colors.ink : colors['ink-secondary'], flexShrink: 1 }}
      >
        {discMessage}
      </TurnText>
    </View>
  ) : view.kind === 'model' && model ? (
    <View style={{ flex: 1, justifyContent: 'center', gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <SymbolView
          name="progress.indicator"
          size={Math.round(18 * scale)}
          weight="semibold"
          tintColor={colors.ink}
          accessible={false}
        />
        <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink, flexShrink: 1 }}>
          {listenStrings.gettingModel}
        </TurnText>
      </View>
      <View style={{ height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: colors['surface-sunken'] }}>
        <View style={{ width: `${Math.round(model.progress * 100)}%`, height: 8, backgroundColor: colors.listen }} />
      </View>
      <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
        {modelProgressWords(model.progress, model.secondsLeft)}
      </TurnText>
    </View>
  ) : view.kind === 'opening' ? (
    // "Listening" is large until the first words, since a small light goes unnoticed.
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Light ringStyle={ringStyle} />
      <TurnText kind="partner-line" boldText={boldText} numberOfLines={1} style={{ color: colors.ink, flexShrink: 1 }}>
        {view.words}
      </TurnText>
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <View
        onLayout={({ nativeEvent }) => setLabelRow({ y: nativeEvent.layout.y, height: nativeEvent.layout.height })}
        style={{
          flexDirection: 'row',
          flexWrap: grows ? 'wrap' : 'nowrap',
          alignItems: 'center',
          gap: 6,
          paddingRight: besidePill
        }}
      >
        {view.lineOpen && <Light ringStyle={ringStyle} />}
        {view.label && (
          <TurnText
            kind="label"
            boldText={boldText}
            numberOfLines={grows ? undefined : 1}
            style={{ color: view.lineOpen ? colors.listen : colors['ink-secondary'], flexShrink: 1 }}
          >
            {view.label}
          </TurnText>
        )}
        {view.lineOpen && !reduceMotion && <Meter level={level} />}
      </View>
      <View style={{ marginTop: 4 }}>
        <CaptionWords
          text={view.words}
          lines={view.note && !grows ? 1 : 2}
          hearing={view.lineOpen}
          reduceMotion={reduceMotion}
          increaseContrast={increaseContrast}
          boldText={boldText}
        />
      </View>
      {view.note && (
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 6,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: colors['surface-sunken']
          }}
        >
          <SymbolView
            name={view.noteSymbol}
            size={Math.round(13 * scale)}
            weight="semibold"
            tintColor={colors['ink-secondary']}
            accessible={false}
          />
          <TurnText
            kind="footnote"
            boldText={boldText}
            numberOfLines={grows ? undefined : 1}
            style={{ color: colors['ink-secondary'], flexShrink: 1 }}
          >
            {view.note}
          </TurnText>
        </View>
      )}
    </View>
  )

  return (
    <View
      style={{
        height: grows ? undefined : height,
        minHeight: height,
        marginHorizontal: 16,
        borderRadius: oneLine ? 20 : 24,
        borderWidth: edgeWidth,
        borderColor: colors.edge,
        backgroundColor: colors.surface,
        boxShadow: depth.card
      }}
    >
      <Pressable
        accessibilityRole={onType ? 'button' : undefined}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={onType ? 'Type the partner line.' : undefined}
        disabled={!onType}
        onPress={onType ?? undefined}
        style={{
          flexGrow: 1,
          minHeight: 44,
          justifyContent: 'center',
          // The edge thickens while listening inside the same outline, so the words stay put.
          paddingHorizontal: 20 - edgeWidth,
          paddingTop: oneLine ? 0 : 12.5 - edgeWidth + abovePill,
          paddingBottom: oneLine ? 0 : 11.5 - edgeWidth
        }}
      >
        {content}
      </Pressable>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: -edgeWidth,
            right: -edgeWidth,
            bottom: -edgeWidth,
            left: -edgeWidth,
            borderRadius: oneLine ? 20 : 24,
            borderWidth: 2.5,
            borderColor: colors.listen,
            boxShadow: listeningGlow
          },
          lampStyle
        ]}
      />
      {view.button && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={view.button === 'done' ? 'Done' : 'Clear'}
          accessibilityHint={view.button === 'done' ? "Ends the partner's line now." : undefined}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          onLayout={({ nativeEvent }) =>
            setPill({ width: nativeEvent.layout.width, height: nativeEvent.layout.height })
          }
          onPress={view.button === 'done' ? onDone : onClear}
          style={({ pressed }) => ({
            position: 'absolute',
            right: 16 - edgeWidth,
            top: oneLine
              ? undefined
              : grows
                ? 12.5 - edgeWidth
                : Math.max(0, 12.5 - edgeWidth + labelRow.y + labelRow.height / 2 - pill.height / 2),
            alignSelf: oneLine ? 'center' : undefined,
            minHeight: 32,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 12,
            borderRadius: 999,
            backgroundColor: pressed ? colors['surface-pressed'] : colors['surface-sunken']
          })}
        >
          {view.button === 'clear' && (
            <SymbolView
              name="xmark"
              size={Math.round(13 * scale)}
              weight="semibold"
              tintColor={colors.ink}
              accessible={false}
            />
          )}
          <TurnText kind="button" boldText={boldText} style={{ color: colors.ink }}>
            {view.button === 'done' ? 'Done' : 'Clear'}
          </TurnText>
        </Pressable>
      )}
    </View>
  )
}
