import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, FontFamily, FontSize, Motion } from '@/constants/tokens';

type Macro = 'protein' | 'carbs' | 'fat' | 'fiber';
type SizeKey = 'sm' | 'md' | 'lg';

const SIZES: Record<SizeKey, number> = { sm: 48, md: 72, lg: 96 };
const STROKES: Record<SizeKey, number> = { sm: 4, md: 5, lg: 6 };
const MACRO_COLORS: Record<Macro, string> = {
  protein: Colors.macroProtein,
  carbs:   Colors.macroCarbs,
  fat:     Colors.macroFat,
  fiber:   Colors.macroFiber,
};
const MACRO_LIGHT: Record<Macro, string> = {
  protein: Colors.accentLight,
  carbs:   Colors.accent2Light,
  fat:     Colors.warnLight,
  fiber:   '#EDE8F5',
};

type Props = {
  macro: Macro;
  value: number;
  target: number;
  size?: SizeKey;
  unit?: string;
};

export function MacroRing({ macro, value, target, size = 'md', unit = 'g' }: Props) {
  const dim = SIZES[size];
  const stroke = STROKES[size];
  const r = (dim - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const ratio = target > 0 ? Math.min(value / target, 1) : 0;

  const animProgress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animProgress, {
      toValue: ratio,
      duration: Motion.slow,
      easing: Easing.out(Easing.back(1.4)),
      useNativeDriver: false,
    }).start();
  }, [ratio]);

  const color = MACRO_COLORS[macro];
  const lightColor = MACRO_LIGHT[macro];

  const macroLabels: Record<Macro, string> = {
    protein: 'Prot.',
    carbs: 'Hidr.',
    fat: 'Gord.',
    fiber: 'Fibra',
  };

  const displayValue = value >= 1000 ? `${(value / 1000).toFixed(1)}kg` : `${Math.round(value)}${unit}`;

  return (
    <View style={styles.wrap} accessibilityLabel={`${macroLabels[macro]}: ${displayValue} de ${target}${unit}`}>
      <Svg width={dim} height={dim}>
        {/* Track */}
        <Circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke={lightColor}
          strokeWidth={stroke}
        />
        {/* Fill — static for now, animated in real app via reanimated */}
        <Circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${circ}`}
          strokeDashoffset={circ * (1 - ratio)}
          strokeLinecap="round"
          rotation={-90}
          origin={`${dim / 2},${dim / 2}`}
        />
      </Svg>
      <View style={[styles.center, { width: dim, height: dim }]}>
        <Text style={[styles.value, size === 'lg' && styles.valueLg]}>{displayValue}</Text>
      </View>
      <Text style={styles.label}>{macroLabels[macro]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xs,
    color: Colors.text,
  },
  valueLg: { fontSize: FontSize.sm },
  label: {
    fontSize: 9,
    fontFamily: FontFamily.sansSemiBold,
    color: Colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
