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

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, loading, error, clearError } = useAuthStore();

  async function handleSignUp() {
    clearError();
    await signUp(email, password);
    router.replace('/tabs');
  }

  const isValid = email.includes('@') && password.length >= 8;

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
          <Text style={styles.tagline}>Começa o teu percurso hoje</Text>
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
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            error={password.length > 0 && password.length < 8 ? 'Mínimo 8 caracteres' : undefined}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label="Criar conta"
            onPress={handleSignUp}
            loading={loading}
            disabled={!isValid}
            fullWidth
            size="lg"
          />

          <Text style={styles.gdpr}>
            Ao criares conta, aceitas os nossos Termos de Serviço e Política de Privacidade, em conformidade com o RGPD.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tens conta? </Text>
          <Link href="/auth/sign-in" style={styles.link}>Entrar</Link>
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
  gdpr: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
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
