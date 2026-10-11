// CalPT — Design tokens: Mediterranean Fresh
// Source of truth. No raw hex anywhere else.

export const Colors = {
  bg:           '#F8F7F4',
  surface:      '#FFFFFF',
  surface2:     '#F2F0EC',
  border:       '#E4E0D8',
  borderInput:  '#6E6860',

  text:         '#1A1714',
  textMuted:    '#6B6560',
  textSubtle:   '#6E6860',

  accent:       '#1E5FAD',
  accentLight:  '#EEF4FC',
  onAccent:     '#FFFFFF',

  accent2:      '#1A6E44',
  accent2Light: '#E8F5EE',
  onAccent2:    '#FFFFFF',

  warn:         '#A64E1A',
  warnLight:    '#FDF0E8',
  onWarn:       '#FFFFFF',

  danger:       '#C42B2B',
  dangerLight:  '#FDEAEA',
  onDanger:     '#FFFFFF',

  success:      '#1A7A48',
  successLight: '#E8F5EE',
  onSuccess:    '#FFFFFF',

  streak:       '#E05C1A',
  streakLight:  '#FEF0E8',

  macroProtein: '#1E5FAD',
  macroCarbs:   '#1A6E44',
  macroFat:     '#A64E1A',
  macroFiber:   '#7B6FA0',

  // Dark theme
  dark: {
    bg:           '#14120F',
    surface:      '#1E1B17',
    surface2:     '#282420',
    border:       '#312D28',
    borderInput:  '#9A9088',
    text:         '#F0EDE8',
    textMuted:    '#A8A098',
    textSubtle:   '#9A9088',
    accent:       '#4B87D4',
    accentLight:  '#1A2D4A',
    accent2:      '#3A9E68',
    accent2Light: '#142A1E',
    warn:         '#D4763A',
    warnLight:    '#2A1A0A',
    streak:       '#F07840',
  },
} as const;

export const FontFamily = {
  display: 'Nunito_800ExtraBold',
  displayBold: 'Nunito_700Bold',
  displaySemiBold: 'Nunito_600SemiBold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
} as const;

export const FontSize = {
  xs:      11,
  sm:      13,
  base:    15,
  md:      17,
  lg:      20,
  xl:      26,
  display: 34,
  label:   11,
} as const;

export const LineHeight = {
  xs:      15,
  sm:      18,
  base:    22,
  md:      24,
  lg:      27,
  xl:      32,
  display: 40,
  label:   14,
} as const;

export const Radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   18,
  xl:   24,
  pill: 999,
} as const;

export const Space = {
  0:  0,
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#1A1714',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  pop: {
    shadowColor: '#1A1714',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  sheet: {
    shadowColor: '#1A1714',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const Motion = {
  fast:   120,
  base:   220,
  slow:   380,
} as const;

export const Layout = {
  screenPaddingH:    16,
  headerHeight:      56,
  bottomTabHeight:   64,
  fabSize:           56,
  inputHeight:       48,
  btnHeightSm:       34,
  btnHeightMd:       44,
  btnHeightLg:       52,
  cardPadding:       16,
} as const;
