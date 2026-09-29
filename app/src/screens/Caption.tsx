import { useEffect, useState } from 'react'
import { SymbolView } from 'expo-symbols'
import { Pressable, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { colors } from '../constants/theme'
import { listenStrings } from '../listen/strings'
import type { CaptionView } from './caption-view'
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
  model: { progress: number; secondsLeft: number | null } | null
  onType: (() => void) | null
  onDone: () => void
  onClear: () => void
}

// The newest word sits on `listen-soft` for 600 ms (DESIGN, motion), or, under Reduce Motion, until the line ends.
function useNewestWord(text: string, hearing: boolean, reduceMotion: boolean) {
  const [lit, setLit] = useState(false)
  useEffect(() => {
    if (!hearing || !text) {
      setLit(false)
      return
    }
    setLit(true)
    if (reduceMotion) return
    const timer = setTimeout(() => setLit(false), 600)
    return () => clearTimeout(timer)
  }, [text, hearing, reduceMotion])
  return lit
}

function WithNewestWord({ line, lit }: { line: string; lit: boolean }) {
  const match = /\S+\s*$/.exec(line)
  if (!match) return line
  return (
    <>
      {line.slice(0, match.index)}
      <Text style={{ backgroundColor: lit ? colors['listen-soft'] : undefined }}>{match[0]}</Text>
    </>
  )
}

/** The partner's words in up to `lines` lines: a longer line shows its last lines, cut at the start with an ellipsis,
 * since the newest words matter most; the caption's label gives VoiceOver the whole line (DESIGN, the caption). */
function CaptionWords({
  text,
  lines,
  lit,
  boldText
}: {
  text: string
  lines: number
  lit: boolean
  boldText: boolean
}) {
  const [tail, setTail] = useState<{ text: string; lines: number; shown: string[] } | null>(null)
  const visibleTail = tail?.text === text && tail.lines === lines ? tail.shown : null

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
            {index === visibleTail.length - 1 ? <WithNewestWord line={line} lit={lit} /> : line}
          </TurnText>
        ))
      ) : (
        <TurnText kind="partner-line" boldText={boldText} numberOfLines={lines} style={{ color: colors.ink }}>
          <WithNewestWord line={text} lit={lit} />
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

// The session reports whether the partner's voice is on, not a level, so the five bars stand still (plan 0044's meter).
function Meter() {
  return (
    <View accessible={false} style={{ flexDirection: 'row', alignItems: 'center', gap: 2.5, height: 18 }}>
      {[7, 13, 18, 11, 15].map((height, index) => (
        <View key={index} style={{ width: 3, height, borderRadius: 1.5, backgroundColor: colors.listen }} />
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
  model,
  onType,
  onDone,
  onClear
}: Props) {
  const depth = useDepth()
  const ringStyle = useListenLight(view.lineOpen, reduceMotion)
  const lit = useNewestWord(view.kind === 'words' ? view.words : '', view.lineOpen, reduceMotion)
  const [labelRow, setLabelRow] = useState({ y: 0, height: 20 })
  const [pill, setPill] = useState({ width: 0, height: 32 })
  // The lamp: an orange edge and glow while the session opens and while the partner speaks (frames 03, 04); once
  // they've said their line, the panel rests on its usual edge while the capsule stays lit.
  const lamp = view.micOn && (view.kind === 'opening' || view.lineOpen)
  const edgeWidth = lamp ? 2.5 : 1.5
  const scale = Math.min(fontScale, 2)
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
        paddingRight: view.button ? pill.width + 8 : 0
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
          paddingRight: view.button ? pill.width + 8 : 0
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
        {view.lineOpen && !reduceMotion && <Meter />}
      </View>
      <View style={{ marginTop: 4 }}>
        <CaptionWords text={view.words} lines={view.note && !grows ? 1 : 2} lit={lit} boldText={boldText} />
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
        borderColor: lamp ? colors.listen : colors.edge,
        backgroundColor: colors.surface,
        boxShadow: lamp ? listeningGlow : depth.card
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
          paddingTop: oneLine ? 0 : 12.5 - edgeWidth,
          paddingBottom: oneLine ? 0 : 11.5 - edgeWidth
        }}
      >
        {content}
      </Pressable>
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
            // Centered on the label's line, above the words, so it never moves a hand has learned.
            top: oneLine
              ? undefined
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
