import { useState } from 'react'
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

export default function PartnerLineComposer({ text, onChangeText, onSend, onClose, boldText, fontScale }: Props) {
  const lineHeight = 22 * fontScale
  const minInputHeight = Math.max(52, lineHeight + 20)
  const maxInputHeight = lineHeight * 4 + 20
  const [inputHeight, setInputHeight] = useState(minInputHeight)
  const disabled = !text.trim()

  return (
    <View
      style={{
        gap: 8,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
        borderTopWidth: 1,
        borderTopColor: colors.edge,
        backgroundColor: colors.board,
        flexShrink: 1
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexShrink: 0 }}
      >
        <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors['ink-secondary'], flex: 1 }}>
          What did they say?
        </TurnText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close composer"
          onPress={onClose}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <SymbolView name="xmark" size={18} tintColor={colors.ink} accessible={false} />
        </Pressable>
      </View>
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
        onContentSizeChange={(event) =>
          setInputHeight(Math.max(minInputHeight, Math.min(maxInputHeight, event.nativeEvent.contentSize.height + 16)))
        }
        style={{
          ...textStyle('body', boldText),
          color: colors.ink,
          backgroundColor: colors.surface,
          borderColor: colors.edge,
          borderWidth: 2,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          height: Math.max(minInputHeight, inputHeight),
          // On a short screen the field gives up lines down to two, then scrolls; it never cuts a line it shows.
          minHeight: Math.min(Math.max(minInputHeight, inputHeight), lineHeight * 2 + 20),
          maxHeight: maxInputHeight,
          flexShrink: 1,
          textAlignVertical: 'top'
        }}
      />
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}
      >
        <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'], flex: 1 }}>
          {text.length >= 450 ? `${500 - text.length} characters left` : ''}
        </TurnText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={onSend}
          style={({ pressed }) => ({
            minWidth: 104,
            minHeight: 52,
            paddingHorizontal: 16,
            borderRadius: 26,
            borderWidth: 2,
            borderColor: colors.edge,
            backgroundColor: disabled ? colors.surface : pressed ? colors['surface-pressed'] : colors.surface,
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          <TurnText
            kind="headline"
            boldText={boldText}
            style={{ color: disabled ? colors['ink-secondary'] : colors.ink }}
          >
            Send
          </TurnText>
        </Pressable>
      </View>
    </View>
  )
}
