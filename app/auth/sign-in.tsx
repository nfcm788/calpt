import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth';
import { Colors, FontFamily, FontSize, Layout, Space } from '@/constants/tokens';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error, clearError } = useAuthStore();

  async function handleSignIn() {
    clearError();
    await signIn(email, password);
    router.replace('/tabs');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>CalPT</Text>
          <Text style={styles.tagline}>O teu diário alimentar inteligente</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="o.teu@email.pt"
          />
          <Input
            label="Palavra-passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
            placeholder="••••••••"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label="Entrar"
            onPress={handleSignIn}
            loading={loading}
            disabled={!email || !password}
            fullWidth
            size="lg"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tens conta? </Text>
          <Link href="/auth/sign-up" style={styles.link}>Regista-te</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Space[16],
    paddingBottom: Space[8],
    gap: Space[8],
  },
  header: { alignItems: 'center', gap: Space[2] },
  logo: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.display,
    color: Colors.accent,
  },
  tagline: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  form: { gap: Space[4] },
  error: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.danger,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  link: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.base,
    color: Colors.accent,
  },
});
