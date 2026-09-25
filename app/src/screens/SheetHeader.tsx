import { Pressable, useWindowDimensions, View } from 'react-native'
import { colors } from '../constants/theme'
import TurnText from './TurnText'

type Props = {
  title: string
  boldText: boolean
  canSave: boolean
  onCancel: () => void
  onSave: () => void
}

// An editor sheet's header as iOS draws one: Cancel, the title, and Save in one row. From AX1 the title
// takes its own line under Cancel and Save, so none of the three pushes another off the sheet.
export default function SheetHeader({ title, boldText, canSave, onCancel, onSave }: Props) {
  const stacked = useWindowDimensions().fontScale >= 1.786
  const cancel = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Cancel"
      onPress={onCancel}
      style={{ minWidth: 64, minHeight: 44, justifyContent: 'center' }}
    >
      <TurnText kind="body" boldText={boldText} style={{ color: colors.accent }}>
        Cancel
      </TurnText>
    </Pressable>
  )
  const save = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Save"
      accessibilityState={{ disabled: !canSave }}
      disabled={!canSave}
      onPress={onSave}
      style={{ minWidth: 64, minHeight: 44, alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <TurnText kind="body" boldText={boldText} style={{ color: canSave ? colors.accent : colors['ink-secondary'] }}>
        Save
      </TurnText>
    </Pressable>
  )
  const heading = (
    <TurnText
      kind="headline"
      boldText={boldText}
      accessibilityRole="header"
      style={{ color: colors.ink, flex: stacked ? undefined : 1, textAlign: stacked ? 'left' : 'center' }}
    >
      {title}
    </TurnText>
  )

  if (!stacked) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {cancel}
        {heading}
        {save}
      </View>
    )
  }
  return (
    <View style={{ gap: 4, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 16 }}>
        {cancel}
        {save}
      </View>
      {heading}
    </View>
  )
}
