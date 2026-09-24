import { Pressable, View } from 'react-native'
import { colors } from '../constants/theme'
import type { homeLayout } from './home-layout'
import TurnText from './TurnText'

type Reply = { id: string; text: string }

type Props = {
  layout: ReturnType<typeof homeLayout>
  width: number
  boldText: boolean
  slots?: readonly (Reply | null)[]
  bigButton?: Reply | null
  onSpeak: (reply: Reply) => void
}

export default function ReplyRow({ layout, width, boldText, slots = [], bigButton, onSpeak }: Props) {
  const slotWidth = layout.rowColumns === 2 ? (width - 32 - layout.rowGap) / 2 : width - 32
  const empty = !bigButton && slots.every((reply) => !reply)

  return (
    <View style={{ height: layout.rowHeight, marginHorizontal: 16 }}>
      {bigButton ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={bigButton.text}
          onPress={() => onSpeak(bigButton)}
          style={({ pressed }) => ({
            height: layout.rowHeight,
            borderRadius: 16,
            backgroundColor: pressed ? colors['accent-pressed'] : colors.accent,
            padding: 16
          })}
        >
          <TurnText
            kind="title1-emphasized"
            boldText={boldText}
            numberOfLines={4}
            style={{ color: colors['on-accent'] }}
          >
            {bigButton.text}
          </TurnText>
        </Pressable>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.rowGap }}>
          {Array.from({ length: 6 }, (_, index) => {
            const reply = slots[index]
            return reply ? (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityLabel={reply.text}
                onPress={() => onSpeak(reply)}
                style={({ pressed }) => ({
                  width: slotWidth,
                  height: layout.slotHeight,
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.edge,
                  borderRadius: 12,
                  padding: layout.short ? 10 : 12,
                  backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
                })}
              >
                <TurnText
                  kind={layout.short ? 'headline' : 'title3-emphasized'}
                  boldText={boldText}
                  numberOfLines={2}
                  style={{ color: colors.ink }}
                >
                  {reply.text}
                </TurnText>
              </Pressable>
            ) : (
              <View key={index} style={{ width: slotWidth, height: layout.slotHeight }} />
            )
          })}
        </View>
      )}
      {empty && (
        <TurnText
          kind="subheadline"
          boldText={boldText}
          style={{
            color: colors['ink-secondary'],
            position: 'absolute',
            top: 12,
            left: 4,
            width: layout.rowColumns === 2 ? width - 40 : slotWidth - 8
          }}
        >
          Replies to your partner appear here.
        </TurnText>
      )}
    </View>
  )
}
