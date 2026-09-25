import { useState } from 'react'
import { SymbolView } from 'expo-symbols'
import { Pressable, TextInput, View } from 'react-native'
import { colors, scaledTextStyle } from '../constants/theme'
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
        backgroundColor: colors.board
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
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
          ...scaledTextStyle('body', boldText, fontScale),
          color: colors.ink,
          backgroundColor: colors.surface,
          borderColor: colors.edge,
          borderWidth: 2,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          height: inputHeight,
          maxHeight: maxInputHeight,
          textAlignVertical: 'top'
        }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
            backgroundColor: pressed ? colors['surface-pressed'] : colors.surface,
            opacity: disabled ? 0.45 : 1,
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink }}>
            Send
          </TurnText>
        </Pressable>
      </View>
    </View>
  )
}
