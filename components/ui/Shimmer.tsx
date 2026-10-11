import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/tokens';

type Props = {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Shimmer({ width = '100%', height, borderRadius = Radius.sm, style }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  const bg = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [Colors.border, Colors.surface2, Colors.border],
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: bg },
        style,
      ]}
      accessibilityElementsHidden
    />
  );
}

export function ShimmerCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.card, style]}>
      <Shimmer height={16} width="60%" />
      <Shimmer height={12} width="40%" style={{ marginTop: 6 }} />
      <View style={styles.row}>
        <Shimmer height={28} width={56} borderRadius={Radius.sm} />
        <Shimmer height={28} width={56} borderRadius={Radius.sm} />
        <Shimmer height={28} width={56} borderRadius={Radius.sm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    gap: 8,
  },
  row: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
