import { SymbolView } from 'expo-symbols'
import { Pressable, useWindowDimensions, View } from 'react-native'
import { colors } from '../constants/theme'
import { useDepth } from './home-depth'
import TurnText from './TurnText'

const edgeWidth = (primary: boolean, pressed: boolean) => (primary ? 0 : pressed ? 2.5 : 1.5)

function CardButton({
  label,
  primary,
  stacked,
  boldText,
  onPress
}: {
  label: string
  primary: boolean
  stacked: boolean
  boldText: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: stacked ? undefined : 1,
        minHeight: 52,
        justifyContent: 'center',
        // The edge thickens on press inside the same outline, so the label stays put.
        paddingHorizontal: 17.5 - edgeWidth(primary, pressed),
        paddingVertical: 9.5 - edgeWidth(primary, pressed),
        borderRadius: 999,
        borderWidth: edgeWidth(primary, pressed),
        borderColor: colors.edge,
        backgroundColor: primary
          ? pressed
            ? colors['accent-pressed']
            : colors.accent
          : pressed
            ? colors['surface-pressed']
            : colors.surface
      })}
    >
      <TurnText
        kind="button"
        boldText={boldText}
        style={{ color: primary ? colors['on-accent'] : colors.ink, textAlign: 'center' }}
      >
        {label}
      </TurnText>
    </Pressable>
  )
}

/** The first launch's invitation (BANK-10) in the row's frame, on `accent-soft`, so nothing moves when it goes. */
export default function StarterReviewCard({
  boldText,
  short,
  onReview,
  onDismiss
}: {
  boldText: boolean
  short: boolean
  onReview: () => void
  onDismiss: () => void
}) {
  const depth = useDepth()
  const { fontScale } = useWindowDimensions()
  const stacked = fontScale >= 1.786
  const disc = Math.round((short ? 32 : 44) * Math.min(fontScale, 2))

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: colors.accent,
        borderRadius: 20,
        padding: short ? 12 : 16,
        gap: short ? 8 : 12,
        backgroundColor: colors['accent-soft'],
        boxShadow: depth.card
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: disc,
            height: disc,
            borderRadius: disc / 2,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SymbolView
            name="text.book.closed"
            size={Math.round(disc / 2)}
            weight="semibold"
            tintColor={colors['on-accent']}
            accessible={false}
          />
        </View>
        <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink, flexShrink: 1 }}>
          Starter phrases
        </TurnText>
      </View>
      <TurnText kind={short ? 'button' : 'title'} boldText={boldText} style={{ color: colors.ink }}>
        The Turn team wrote these starter phrases. Review them to make them yours.
      </TurnText>
      <View style={{ flexDirection: stacked ? 'column' : 'row', gap: 12 }}>
        <CardButton label="Review" primary stacked={stacked} boldText={boldText} onPress={onReview} />
        <CardButton label="Not now" primary={false} stacked={stacked} boldText={boldText} onPress={onDismiss} />
      </View>
    </View>
  )
}
