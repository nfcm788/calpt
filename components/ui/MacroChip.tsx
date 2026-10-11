import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontFamily, FontSize, Radius } from '@/constants/tokens';

type Macro = 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber';

const CHIP_COLORS: Record<Macro, { bg: string; text: string }> = {
  calories: { bg: Colors.surface2,     text: Colors.text },
  protein:  { bg: Colors.accentLight,  text: Colors.accent },
  carbs:    { bg: Colors.accent2Light, text: Colors.accent2 },
  fat:      { bg: Colors.warnLight,    text: Colors.warn },
  fiber:    { bg: '#EDE8F5',           text: Colors.macroFiber },
};

const MACRO_LABELS: Record<Macro, string> = {
  calories: 'KCAL',
  protein:  'PROT',
  carbs:    'HIDR',
  fat:      'GORD',
  fiber:    'FIBRA',
};

type Props = {
  macro: Macro;
  value: number;
  unit?: string;
};

export function MacroChip({ macro, value, unit }: Props) {
  const { bg, text } = CHIP_COLORS[macro];
  const label = MACRO_LABELS[macro];
  const display = unit ? `${value}${unit}` : `${value}`;

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.value, { color: text }]}>{display}</Text>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    gap: 1,
  },
  value: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.displayBold,
    lineHeight: 16,
  },
  label: {
    fontSize: 9,
    fontFamily: FontFamily.sansSemiBold,
    letterSpacing: 0.4,
  },
});
