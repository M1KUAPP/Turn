import { SymbolView } from 'expo-symbols'
import { Pressable, TextInput, View } from 'react-native'
import { colors, textStyle } from '../constants/theme'
import { Layer, usePress } from './home-press'
import TurnText from './TurnText'

type Props = {
  text: string
  onChangeText: (text: string) => void
  onSpeak: () => void
  onClose: () => void
  onStop: () => void
  speaking: boolean
  boldText: boolean
  fontScale: number
  // The partner's line the words answer, in Listen mode (DESIGN, with the keyboard up).
  replyingTo: string | null
}

export default function TypedComposer({
  text,
  onChangeText,
  onSpeak,
  onClose,
  onStop,
  speaking,
  boldText,
  fontScale,
  replyingTo
}: Props) {
  const lineHeight = 22 * fontScale
  const minInputHeight = Math.max(56, lineHeight + 30)
  const maxInputHeight = lineHeight * 4 + 30
  const disabled = !speaking && !text.trim()
  const symbol = Math.round(17 * Math.min(fontScale, 2.6))
  const press = usePress()

  return (
    <View
      style={{
        gap: 8,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: colors.hairline,
        backgroundColor: colors.surface,
        flexShrink: 1
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexShrink: 0 }}
      >
        {replyingTo ? (
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 6 }}>
            <TurnText kind="label" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
              Replying to
            </TurnText>
            <TurnText
              kind="partner-line-small"
              boldText={boldText}
              numberOfLines={2}
              ellipsizeMode="head"
              style={{ color: colors.ink, flexShrink: 1 }}
            >
              “{replyingTo}”
            </TurnText>
          </View>
        ) : (
          <TurnText kind="label" boldText={boldText} style={{ color: colors['ink-secondary'], flex: 1 }}>
            Type what to say
          </TurnText>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close composer"
          onPress={onClose}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <SymbolView name="xmark" size={18} weight="semibold" tintColor={colors.ink} accessible={false} />
        </Pressable>
      </View>
      {replyingTo && (
        // The field keeps its visible name while it replies, as DESIGN's composer strings have it.
        <TurnText kind="label" boldText={boldText} style={{ color: colors['ink-secondary'], marginTop: -4 }}>
          Type what to say
        </TurnText>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, flexShrink: 1 }}>
        <TextInput
          autoFocus
          multiline
          maxLength={500}
          scrollEnabled
          accessibilityLabel="Type what to say"
          placeholder="Type what to say"
          placeholderTextColor={colors['ink-secondary']}
          selectionColor={colors.accent}
          value={text}
          onChangeText={(value) => onChangeText(value.slice(0, 500))}
          style={{
            ...textStyle('body', boldText),
            flex: 1,
            color: colors.ink,
            backgroundColor: colors.surface,
            borderColor: colors.edge,
            borderWidth: 1.5,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingTop: 15,
            paddingBottom: 15,
            // The field grows with its words from one line to four, then scrolls; on a short screen the content
            // above it scrolls away first.
            minHeight: minInputHeight,
            maxHeight: maxInputHeight,
            flexShrink: 1,
            textAlignVertical: 'top'
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={speaking ? 'Stop' : 'Speak'}
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPressIn={press.onPressIn}
          onPressOut={press.onPressOut}
          onPress={speaking ? onStop : onSpeak}
          style={{
            minWidth: 96,
            minHeight: 56,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingHorizontal: 16,
            borderRadius: 999
          }}
        >
          <Layer
            fill={disabled ? colors.surface : speaking ? colors.ink : colors.accent}
            edge={disabled ? colors.edge : undefined}
            edgeWidth={1.5}
            radius={999}
          />
          {/* Pressed, Speak's `accent` turns `accent-pressed` and Stop's `ink` turns `ink-secondary`. */}
          {!disabled && (
            <Layer
              fill={speaking ? colors['ink-secondary'] : colors['accent-pressed']}
              radius={999}
              style={press.style}
            />
          )}
          <SymbolView
            name={speaking ? 'stop.fill' : 'speaker.wave.2.fill'}
            size={symbol}
            weight="semibold"
            tintColor={disabled ? colors['ink-secondary'] : speaking ? colors.surface : colors['on-accent']}
            accessible={false}
          />
          <TurnText
            kind="button"
            boldText={boldText}
            style={{ color: disabled ? colors['ink-secondary'] : speaking ? colors.surface : colors['on-accent'] }}
          >
            {speaking ? 'Stop' : 'Speak'}
          </TurnText>
        </Pressable>
      </View>
      {text.length >= 450 && (
        <TurnText kind="label" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
          {`${500 - text.length} characters left`}
        </TurnText>
      )}
    </View>
  )
}
