import { SymbolView } from 'expo-symbols'
import { Pressable, TextInput, View } from 'react-native'
import { colors, textStyle } from '../constants/theme'
import TurnText from './TurnText'

type Props = {
  text: string
  onChangeText: (text: string) => void
  onSend: () => void
  onClose: () => void
  boldText: boolean
  fontScale: number
}

/** The partner's composer (LISTEN-4): their words in the serif, and Send on `ink`, never marker blue, so a partner's
 * words can't be mistaken for the user's. */
export default function PartnerLineComposer({ text, onChangeText, onSend, onClose, boldText, fontScale }: Props) {
  const lineHeight = 26 * fontScale
  const minInputHeight = Math.max(56, lineHeight + 30)
  const maxInputHeight = lineHeight * 4 + 30
  const disabled = !text.trim()
  const symbol = Math.round(17 * Math.min(fontScale, 2.6))

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
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <SymbolView
            name="ear"
            size={Math.round(16 * Math.min(fontScale, 2.6))}
            weight="semibold"
            tintColor={colors.ink}
            accessible={false}
          />
          <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink, flexShrink: 1 }}>
            What did they say?
          </TurnText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close composer"
          onPress={onClose}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <SymbolView name="xmark" size={18} weight="semibold" tintColor={colors.ink} accessible={false} />
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, flexShrink: 1 }}>
        <TextInput
          autoFocus
          multiline
          maxLength={500}
          scrollEnabled
          accessibilityLabel="What did they say?"
          placeholder="What did they say?"
          placeholderTextColor={colors['ink-secondary']}
          selectionColor={colors.accent}
          value={text}
          onChangeText={(value) => onChangeText(value.slice(0, 500))}
          style={{
            ...textStyle('partner-line-small', boldText),
            flex: 1,
            color: colors.ink,
            backgroundColor: colors.surface,
            borderColor: colors.edge,
            borderWidth: 1.5,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingTop: 13,
            paddingBottom: 13,
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
          accessibilityLabel="Send"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={onSend}
          style={({ pressed }) => ({
            minWidth: 96,
            minHeight: 56,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingHorizontal: disabled ? 14.5 : 16,
            borderRadius: 999,
            borderWidth: disabled || pressed ? 1.5 : 0,
            borderColor: colors.edge,
            backgroundColor: disabled ? colors.surface : colors.ink
          })}
        >
          <SymbolView
            name="arrow.uturn.backward"
            size={symbol}
            weight="semibold"
            tintColor={disabled ? colors['ink-secondary'] : colors.surface}
            accessible={false}
          />
          <TurnText
            kind="button"
            boldText={boldText}
            style={{ color: disabled ? colors['ink-secondary'] : colors.surface }}
          >
            Send
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
