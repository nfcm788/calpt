import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { Colors, FontFamily, FontSize, Layout, Radius } from '@/constants/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
  accessibilityLabel,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'ghost' ? Colors.accent : Colors.onAccent}
          accessibilityLabel="A carregar"
        />
      ) : null}
      <Text style={[styles.label, styles[`labelVariant_${variant}`], styles[`labelSize_${size}`]]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.pill,
  },
  fullWidth: { width: '100%' },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.4 },

  // Variants
  primary: { backgroundColor: Colors.accent },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: Colors.danger },
  success: { backgroundColor: Colors.accent2 },

  // Sizes
  size_sm: { height: Layout.btnHeightSm, paddingHorizontal: 12 },
  size_md: { height: Layout.btnHeightMd, paddingHorizontal: 20 },
  size_lg: { height: Layout.btnHeightLg, paddingHorizontal: 24 },

  // Labels
  label: { fontFamily: FontFamily.sansSemiBold },
  labelVariant_primary:   { color: Colors.onAccent },
  labelVariant_secondary: { color: Colors.text },
  labelVariant_ghost:     { color: Colors.accent },
  labelVariant_danger:    { color: Colors.onDanger },
  labelVariant_success:   { color: Colors.onAccent2 },

  labelSize_sm: { fontSize: FontSize.xs },
  labelSize_md: { fontSize: FontSize.base },
  labelSize_lg: { fontSize: FontSize.md },
});
