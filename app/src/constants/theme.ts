import { DynamicColorIOS } from 'react-native'

export const colorValues = {
  board: { light: '#F2F2F7', dark: '#000000', 'light-hc': '#F2F2F7', 'dark-hc': '#000000' },
  surface: { light: '#FFFFFF', dark: '#1C1C1E', 'light-hc': '#FFFFFF', 'dark-hc': '#1C1C1E' },
  'surface-pressed': { light: '#E1E1E6', dark: '#3A3A3C', 'light-hc': '#D6D6DC', 'dark-hc': '#48484A' },
  ink: { light: '#1C1C1E', dark: '#F5F5F7', 'light-hc': '#000000', 'dark-hc': '#FFFFFF' },
  'ink-secondary': { light: '#55555B', dark: '#AEAEB2', 'light-hc': '#3A3A3E', 'dark-hc': '#D1D1D6' },
  edge: { light: '#85858B', dark: '#6C6C70', 'light-hc': '#545458', 'dark-hc': '#A1A1A6' },
  accent: { light: '#1747B8', dark: '#8CB4FF', 'light-hc': '#0E3A9E', 'dark-hc': '#B3CDFF' },
  'accent-pressed': { light: '#0F3A9A', dark: '#B3CDFF', 'light-hc': '#0A2F84', 'dark-hc': '#D0E0FF' },
  'on-accent': { light: '#FFFFFF', dark: '#0B1530', 'light-hc': '#FFFFFF', 'dark-hc': '#000000' },
  'yes-fill': { light: '#E2F3E6', dark: '#0F2E19', 'light-hc': '#D4EDDB', 'dark-hc': '#0A2413' },
  'yes-edge': { light: '#1F7A3A', dark: '#4CC474', 'light-hc': '#145C2A', 'dark-hc': '#7FDC9C' },
  'no-fill': { light: '#FBE5E3', dark: '#3A1512', 'light-hc': '#F6D5D1', 'dark-hc': '#2E0F0D' },
  'no-edge': { light: '#B3261E', dark: '#FF7A70', 'light-hc': '#8C1D17', 'dark-hc': '#FFA39C' },
  'unsure-fill': { light: '#EAEAEF', dark: '#2C2C2E', 'light-hc': '#DDDDE3', 'dark-hc': '#232325' },
  'unsure-edge': { light: '#636369', dark: '#98989D', 'light-hc': '#48484C', 'dark-hc': '#C7C7CC' },
  listen: { light: '#B84A00', dark: '#FF9F43', 'light-hc': '#963B00', 'dark-hc': '#FFB36B' },
  'on-listen': { light: '#FFFFFF', dark: '#1A0D00', 'light-hc': '#FFFFFF', 'dark-hc': '#000000' }
} as const

type ColorName = keyof typeof colorValues

export const colors = Object.fromEntries(
  Object.entries(colorValues).map(([name, values]) => [
    name,
    DynamicColorIOS({
      light: values.light,
      dark: values.dark,
      highContrastLight: values['light-hc'],
      highContrastDark: values['dark-hc']
    })
  ])
) as Record<ColorName, ReturnType<typeof DynamicColorIOS>>

export const typography = {
  'largeTitle-emphasized': {
    fontFamily: 'system-ui',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    dynamicTypeRamp: 'largeTitle',
    boldTextWeight: '800'
  },
  'title1-emphasized': {
    fontFamily: 'system-ui',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    dynamicTypeRamp: 'title1',
    boldTextWeight: '800'
  },
  title2: {
    fontFamily: 'system-ui',
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 28,
    dynamicTypeRamp: 'title2',
    boldTextWeight: '600'
  },
  title3: {
    fontFamily: 'system-ui',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 25,
    dynamicTypeRamp: 'title3',
    boldTextWeight: '600'
  },
  'title3-emphasized': {
    fontFamily: 'system-ui',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    dynamicTypeRamp: 'title3',
    boldTextWeight: '700'
  },
  headline: {
    fontFamily: 'system-ui',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    dynamicTypeRamp: 'headline',
    boldTextWeight: '700'
  },
  body: {
    fontFamily: 'system-ui',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    dynamicTypeRamp: 'body',
    boldTextWeight: '600'
  },
  subheadline: {
    fontFamily: 'system-ui',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    dynamicTypeRamp: 'subheadline',
    boldTextWeight: '600'
  },
  'subheadline-emphasized': {
    fontFamily: 'system-ui',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    dynamicTypeRamp: 'subheadline',
    boldTextWeight: '700'
  },
  footnote: {
    fontFamily: 'system-ui',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    dynamicTypeRamp: 'footnote',
    boldTextWeight: '600'
  }
} as const

export function textStyle(name: keyof typeof typography, boldText: boolean) {
  const token = typography[name]
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    fontWeight: boldText ? token.boldTextWeight : token.fontWeight
  }
}

export function scaledTextStyle(name: keyof typeof typography, boldText: boolean, fontScale: number) {
  const base = textStyle(name, boldText)
  return {
    ...base,
    fontSize: base.fontSize * fontScale,
    lineHeight: base.lineHeight * fontScale
  }
}
