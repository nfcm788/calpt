import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Colors, FontFamily, FontSize, Layout, Radius } from '@/constants/tokens';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export function Input({ label, error, containerStyle, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label} nativeID={props.nativeID ? `${props.nativeID}-label` : undefined}>
          {label}
        </Text>
      ) : null}
      <TextInput
        {...props}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
          props.style,
        ]}
        placeholderTextColor={Colors.textSubtle}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        accessibilityLabel={label ?? props.accessibilityLabel}
        accessibilityInvalid={!!error}
        accessibilityErrorMessage={error}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.sansMedium,
    color: Colors.text,
  },
  input: {
    height: Layout.inputHeight,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    fontSize: FontSize.base,
    fontFamily: FontFamily.sans,
    color: Colors.text,
  },
  inputFocused: {
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.sans,
    color: Colors.danger,
  },
});
