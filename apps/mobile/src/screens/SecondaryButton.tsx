import Button from './Button'

export default function SecondaryButton({
  label,
  boldText,
  disabled = false,
  onPress,
  equalPair
}: {
  label: string
  boldText: boolean
  disabled?: boolean
  onPress: () => void
  equalPair: boolean
}) {
  return (
    <Button
      label={label}
      boldText={boldText}
      disabled={disabled}
      onPress={onPress}
      style={{ flex: equalPair ? 1 : undefined }}
    />
  )
}
