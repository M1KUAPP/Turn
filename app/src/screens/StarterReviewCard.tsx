import { useWindowDimensions, View } from 'react-native'
import { colors } from '../constants/theme'
import SecondaryButton from './SecondaryButton'
import TurnText from './TurnText'

export default function StarterReviewCard({
  boldText,
  onReview,
  onDismiss
}: {
  boldText: boolean
  onReview: () => void
  onDismiss: () => void
}) {
  const stacked = useWindowDimensions().fontScale >= 1.786

  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: colors.edge,
        borderRadius: 12,
        padding: 12,
        gap: 12,
        backgroundColor: colors.surface
      }}
    >
      <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
        The Turn team wrote these starter phrases. Review them to make them yours.
      </TurnText>
      <View style={{ flexDirection: stacked ? 'column' : 'row', gap: 12 }}>
        <SecondaryButton label="Review" boldText={boldText} equalPair={!stacked} onPress={onReview} />
        <SecondaryButton label="Not now" boldText={boldText} equalPair={!stacked} onPress={onDismiss} />
      </View>
    </View>
  )
}
