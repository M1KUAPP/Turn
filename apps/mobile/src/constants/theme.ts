import { DynamicColorIOS } from 'react-native'

export const colorValues = {
  board: { light: '#F4EFE7', dark: '#15120F', 'light-hc': '#F4EFE7', 'dark-hc': '#0E0C0A' },
  surface: { light: '#FFFCF7', dark: '#221E19', 'light-hc': '#FFFFFF', 'dark-hc': '#1C1915' },
  'surface-sunken': { light: '#EAE3D8', dark: '#0F0D0B', 'light-hc': '#E4DCCF', 'dark-hc': '#070605' },
  'surface-pressed': { light: '#E6DDCF', dark: '#322C25', 'light-hc': '#DCD2C2', 'dark-hc': '#3A332B' },
  ink: { light: '#1E1A15', dark: '#F6F1E9', 'light-hc': '#000000', 'dark-hc': '#FFFFFF' },
  'ink-secondary': { light: '#5B5347', dark: '#B9AFA1', 'light-hc': '#3D372F', 'dark-hc': '#DDD5C9' },
  edge: { light: '#8A8072', dark: '#8C8274', 'light-hc': '#4A433A', 'dark-hc': '#CFC6B8' },
  hairline: { light: '#DDD4C6', dark: '#3A342C', 'light-hc': '#B9AE9E', 'dark-hc': '#5C544A' },
  accent: { light: '#2438C9', dark: '#8FA0FF', 'light-hc': '#1A2BA6', 'dark-hc': '#B7C2FF' },
  'accent-pressed': { light: '#1A2BA6', dark: '#A9B6FF', 'light-hc': '#121F85', 'dark-hc': '#D2D9FF' },
  'on-accent': { light: '#FFFFFF', dark: '#0B1033', 'light-hc': '#FFFFFF', 'dark-hc': '#000000' },
  'accent-soft': { light: '#E4E8FC', dark: '#1D2244', 'light-hc': '#D6DCFA', 'dark-hc': '#141836' },
  'accent-tag': { light: '#FFFFFF2E', dark: '#0B103329', 'light-hc': '#FFFFFF38', 'dark-hc': '#00000033' },
  listen: { light: '#B84300', dark: '#FF9A4D', 'light-hc': '#963600', 'dark-hc': '#FFB47A' },
  'on-listen': { light: '#FFFFFF', dark: '#1E0C00', 'light-hc': '#FFFFFF', 'dark-hc': '#000000' },
  'listen-soft': { light: '#FCE6D6', dark: '#3A1F0C', 'light-hc': '#F8D9C2', 'dark-hc': '#2C1606' },
  'listen-glow': { light: '#FF8A3D', dark: '#FF7A1F', 'light-hc': '#FF8A3D', 'dark-hc': '#FF7A1F' },
  'yes-fill': { light: '#DCF1E1', dark: '#11291A', 'light-hc': '#CDEBD5', 'dark-hc': '#0A2012' },
  'yes-edge': { light: '#1D7A3C', dark: '#58C77D', 'light-hc': '#125A2B', 'dark-hc': '#8BE0A6' },
  'no-fill': { light: '#FBE0DB', dark: '#361512', 'light-hc': '#F7D1CA', 'dark-hc': '#2A0E0B' },
  'no-edge': { light: '#B3261E', dark: '#FF7B6E', 'light-hc': '#8C1D17', 'dark-hc': '#FFA69C' },
  'unsure-fill': { light: '#ECE6DD', dark: '#2A2621', 'light-hc': '#E0D8CC', 'dark-hc': '#221E1A' },
  'unsure-edge': { light: '#6B6357', dark: '#A39A8C', 'light-hc': '#4A433A', 'dark-hc': '#D0C8BB' },
  'category-quick-fill': { light: '#FFFCF7', dark: '#221E19', 'light-hc': '#FFFFFF', 'dark-hc': '#1C1915' },
  'category-quick-edge': { light: '#8A8072', dark: '#8C8274', 'light-hc': '#4A433A', 'dark-hc': '#CFC6B8' },
  'category-chat-fill': { light: '#DCEBFA', dark: '#16263A', 'light-hc': '#CFE2F8', 'dark-hc': '#0E1B2B' },
  'category-chat-edge': { light: '#2B64B0', dark: '#6FA3E6', 'light-hc': '#1B4C8C', 'dark-hc': '#A6C8F2' },
  'category-care-fill': { light: '#D6F0E2', dark: '#12291E', 'light-hc': '#C7EAD6', 'dark-hc': '#0B2016' },
  'category-care-edge': { light: '#1E7650', dark: '#5CC08E', 'light-hc': '#135A3C', 'dark-hc': '#93DCB6' },
  'category-body-pain-fill': { light: '#FBDDE0', dark: '#33171C', 'light-hc': '#F7CDD2', 'dark-hc': '#270F13' },
  'category-body-pain-edge': { light: '#B02E48', dark: '#EE7A8F', 'light-hc': '#8A1F36', 'dark-hc': '#F6A7B5' },
  'category-food-fill': { light: '#FAEBC2', dark: '#2E2510', 'light-hc': '#F6E2AA', 'dark-hc': '#221B08' },
  'category-food-edge': { light: '#8A6500', dark: '#D9AE3B', 'light-hc': '#6A4D00', 'dark-hc': '#EACB77' },
  'category-feelings-fill': { light: '#FFE2D0', dark: '#35200F', 'light-hc': '#FDD5BD', 'dark-hc': '#29170A' },
  'category-feelings-edge': { light: '#B4531C', dark: '#F08C4E', 'light-hc': '#8C3E10', 'dark-hc': '#F7B389' },
  'category-family-fill': { light: '#E8E0FB', dark: '#241C3A', 'light-hc': '#DDD2F8', 'dark-hc': '#1A132D' },
  'category-family-edge': { light: '#6444C4', dark: '#A78BF2', 'light-hc': '#4C2FA3', 'dark-hc': '#C9B6F8' },
  'category-health-fill': { light: '#D4EEF0', dark: '#0F2A2D', 'light-hc': '#C3E7EA', 'dark-hc': '#0A2023' },
  'category-health-edge': { light: '#15707B', dark: '#4FC3CF', 'light-hc': '#0C5760', 'dark-hc': '#8CDCE3' },
  'category-out-and-about-fill': { light: '#EEF3D2', dark: '#232A10', 'light-hc': '#E4ECBE', 'dark-hc': '#1A200A' },
  'category-out-and-about-edge': { light: '#5C7412', dark: '#A8C24A', 'light-hc': '#445709', 'dark-hc': '#C7DB85' }
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

/** Each starter category's fill and inked edge, by the starter bank's category ID (DESIGN, colors). */
export const categoryColors = {
  quick: { fill: colors['category-quick-fill'], edge: colors['category-quick-edge'] },
  chat: { fill: colors['category-chat-fill'], edge: colors['category-chat-edge'] },
  care: { fill: colors['category-care-fill'], edge: colors['category-care-edge'] },
  'body-pain': { fill: colors['category-body-pain-fill'], edge: colors['category-body-pain-edge'] },
  food: { fill: colors['category-food-fill'], edge: colors['category-food-edge'] },
  feelings: { fill: colors['category-feelings-fill'], edge: colors['category-feelings-edge'] },
  family: { fill: colors['category-family-fill'], edge: colors['category-family-edge'] },
  health: { fill: colors['category-health-fill'], edge: colors['category-health-edge'] },
  'out-and-about': { fill: colors['category-out-and-about-fill'], edge: colors['category-out-and-about-edge'] }
}

/** React Navigation's theme colors, so native headers take DESIGN's tokens in every appearance rather than its light
 * defaults (#115). */
export const navigationColors = {
  primary: colors.accent,
  background: colors.board,
  card: colors.surface,
  text: colors.ink,
  border: colors.edge,
  notification: colors['no-edge']
}

export const typography = {
  'phrase-big': {
    fontFamily: 'ui-rounded',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    dynamicTypeRamp: 'largeTitle',
    boldTextWeight: '900'
  },
  'phrase-yes-no': {
    fontFamily: 'ui-rounded',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    dynamicTypeRamp: 'title1',
    boldTextWeight: '900'
  },
  phrase: {
    fontFamily: 'ui-rounded',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 27,
    dynamicTypeRamp: 'title2',
    boldTextWeight: '800'
  },
  'phrase-strip': {
    fontFamily: 'ui-rounded',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
    dynamicTypeRamp: 'subheadline',
    boldTextWeight: '700'
  },
  'partner-card-title': {
    fontFamily: 'ui-serif',
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 36,
    dynamicTypeRamp: 'title1',
    boldTextWeight: '700'
  },
  'partner-line': {
    fontFamily: 'ui-serif',
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 33,
    dynamicTypeRamp: 'title1',
    boldTextWeight: '600'
  },
  'partner-line-small': {
    fontFamily: 'ui-serif',
    fontSize: 21,
    fontWeight: '500',
    lineHeight: 26,
    dynamicTypeRamp: 'title3',
    boldTextWeight: '600'
  },
  'large-title': {
    fontFamily: 'ui-rounded',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    dynamicTypeRamp: 'largeTitle',
    boldTextWeight: '900'
  },
  title: {
    fontFamily: 'ui-rounded',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    dynamicTypeRamp: 'title2',
    boldTextWeight: '800'
  },
  button: {
    fontFamily: 'ui-rounded',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    dynamicTypeRamp: 'headline',
    boldTextWeight: '800'
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
  callout: {
    fontFamily: 'system-ui',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    dynamicTypeRamp: 'callout',
    boldTextWeight: '600'
  },
  label: {
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
  },
  caption: {
    fontFamily: 'system-ui',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    dynamicTypeRamp: 'caption1',
    boldTextWeight: '700'
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
