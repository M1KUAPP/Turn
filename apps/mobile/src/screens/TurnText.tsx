import type { ReactNode } from 'react'
import { Text, useWindowDimensions, type TextProps } from 'react-native'
import { textStyle, typography } from '../constants/theme'

type Props = TextProps & {
  kind: keyof typeof typography
  boldText: boolean
  children: ReactNode
}

export default function TurnText({ kind, boldText, children, style, ...props }: Props) {
  // A Text whose props stay the same isn't measured again when the text size changes with Turn running, so it keeps
  // its old box and is cut off or loose; a new key makes a new one at the new size (#178).
  const { fontScale } = useWindowDimensions()
  return (
    <Text
      key={fontScale}
      {...props}
      dynamicTypeRamp={typography[kind].dynamicTypeRamp}
      style={[textStyle(kind, boldText), style]}
    >
      {children}
    </Text>
  )
}
