import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';
import { Colors, FontFamily, FontSize, Layout, Radius, Shadow, Space } from '@/constants/tokens';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  async function handleSignOut() {
    Alert.alert('Sair', 'Tens a certeza que queres sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/sign-in');
        },
      },
    ]);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <View style={styles.avatar}>
        <Ionicons name="person-circle" size={72} color={Colors.border} />
        <Text style={styles.name}>{user?.name ?? 'Utilizador'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Metas diárias</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Calorias</Text>
          <Text style={styles.rowValue}>{user?.dailyCaloriesTarget ?? 2000} kcal</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Proteína</Text>
          <Text style={styles.rowValue}>{user?.proteinG ?? 120} g</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Hidratos</Text>
          <Text style={styles.rowValue}>{user?.carbsG ?? 250} g</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Gordura</Text>
          <Text style={styles.rowValue}>{user?.fatG ?? 65} g</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.75 }]}
        onPress={handleSignOut}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
      >
        <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
        <Text style={styles.signOutLabel}>Sair da conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Space[12],
    gap: Space[4],
  },
  header: { marginBottom: Space[2] },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  avatar: {
    alignItems: 'center',
    gap: Space[1],
    paddingVertical: Space[4],
  },
  name: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  email: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Layout.cardPadding,
    gap: Space[3],
    ...Shadow.card,
  },
  cardTitle: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.base,
    color: Colors.text,
    marginBottom: Space[1],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  rowValue: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space[2],
    paddingVertical: Space[4],
  },
  signOutLabel: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    color: Colors.danger,
  },
});
