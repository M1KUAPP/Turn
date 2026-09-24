import type { ReactNode } from 'react'
import { Text, type TextProps } from 'react-native'
import { textStyle, typography } from '../constants/theme'

type Props = TextProps & {
  kind: keyof typeof typography
  boldText: boolean
  children: ReactNode
}

export default function TurnText({ kind, boldText, children, style, ...props }: Props) {
  return (
    <Text {...props} dynamicTypeRamp={typography[kind].dynamicTypeRamp} style={[textStyle(kind, boldText), style]}>
      {children}
    </Text>
  )
}
