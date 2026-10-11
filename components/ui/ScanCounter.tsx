import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePremiumStore } from '@/store/premium';
import { Colors, FontFamily, FontSize, Radius, Space } from '@/constants/tokens';
import { FREE_SCANS_PER_DAY } from '@/constants/revenue-cat';

export function ScanCounter() {
  const { isPremium, scansToday, scansLeft } = usePremiumStore();

  if (isPremium) {
    return (
      <View style={styles.premiumBadge}>
        <Ionicons name="star" size={12} color="#F5C518" />
        <Text style={styles.premiumText}>Premium</Text>
      </View>
    );
  }

  const left = scansLeft();
  const isLow = left <= 1;

  return (
    <Pressable
      style={[styles.counter, isLow && styles.counterLow]}
      onPress={() => router.push('/paywall')}
      accessibilityLabel={`${left} scans gratuitos restantes. Toca para fazer upgrade.`}
    >
      <View style={styles.dots}>
        {Array.from({ length: FREE_SCANS_PER_DAY }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i < scansToday ? styles.dotUsed : styles.dotFree]}
          />
        ))}
      </View>
      <Text style={[styles.label, isLow && styles.labelLow]}>
        {left === 0 ? 'Sem scans' : `${left} scan${left !== 1 ? 's' : ''} grátis`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[2],
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Space[3],
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  counterLow: {
    backgroundColor: Colors.warnLight,
  },
  dots: { flexDirection: 'row', gap: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotFree: { backgroundColor: Colors.accent },
  dotUsed: { backgroundColor: Colors.border },
  label: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.xs,
    color: Colors.accent,
  },
  labelLow: { color: Colors.warn },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF8DC',
    paddingHorizontal: Space[3],
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  premiumText: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.xs,
    color: '#B8860B',
  },
});
