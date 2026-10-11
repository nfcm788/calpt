import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PurchasesPackage } from 'react-native-purchases';
import { Button } from '@/components/ui/Button';
import { usePremiumStore } from '@/store/premium';
import { PRODUCT_MONTHLY, PRODUCT_YEARLY } from '@/constants/revenue-cat';
import { Colors, FontFamily, FontSize, Layout, Radius, Shadow, Space } from '@/constants/tokens';

const FEATURES = [
  { icon: 'camera',          text: 'Scans ilimitados por dia' },
  { icon: 'analytics',       text: 'Histórico e relatórios semanais' },
  { icon: 'trending-up',     text: 'Metas personalizadas com IA' },
  { icon: 'heart',           text: 'Sincronização com Apple Health' },
  { icon: 'notifications',   text: 'Lembretes inteligentes de refeições' },
];

export default function Paywall() {
  const { packages, loading, error, loadPackages, purchase, restore } = usePremiumStore();

  useEffect(() => { loadPackages(); }, []);

  const monthly = packages.find(p => p.product.identifier === PRODUCT_MONTHLY);
  const yearly  = packages.find(p => p.product.identifier === PRODUCT_YEARLY);

  async function handlePurchase(pkg: PurchasesPackage) {
    const success = await purchase(pkg);
    if (success) router.back();
  }

  async function handleRestore() {
    const success = await restore();
    if (success) router.back();
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Close */}
      <Pressable
        style={styles.closeBtn}
        onPress={() => router.back()}
        accessibilityLabel="Fechar"
        accessibilityRole="button"
      >
        <Ionicons name="close" size={22} color={Colors.textMuted} />
      </Pressable>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.crown}>
          <Ionicons name="star" size={36} color="#F5C518" />
        </View>
        <Text style={styles.heroTitle}>CalPT Premium</Text>
        <Text style={styles.heroSub}>
          Tira o máximo partido da tua nutrição sem limites.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        {FEATURES.map(f => (
          <View key={f.text} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon as any} size={18} color={Colors.accent} />
            </View>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      {/* Plans */}
      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginVertical: Space[6] }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.plans}>
          {/* Yearly — destaque */}
          {yearly && (
            <Pressable
              style={({ pressed }) => [styles.planCard, styles.planCardBest, pressed && { opacity: 0.9 }]}
              onPress={() => handlePurchase(yearly)}
              accessibilityRole="button"
              accessibilityLabel={`Plano anual ${yearly.product.priceString} por ano`}
            >
              <View style={styles.bestBadge}>
                <Text style={styles.bestBadgeText}>MELHOR VALOR</Text>
              </View>
              <Text style={styles.planTitle}>Anual</Text>
              <Text style={styles.planPrice}>{yearly.product.priceString}</Text>
              <Text style={styles.planPer}>por ano · equivale a {getPricePerMonth(yearly)}/mês</Text>
            </Pressable>
          )}

          {/* Monthly */}
          {monthly && (
            <Pressable
              style={({ pressed }) => [styles.planCard, pressed && { opacity: 0.9 }]}
              onPress={() => handlePurchase(monthly)}
              accessibilityRole="button"
              accessibilityLabel={`Plano mensal ${monthly.product.priceString} por mês`}
            >
              <Text style={styles.planTitle}>Mensal</Text>
              <Text style={styles.planPrice}>{monthly.product.priceString}</Text>
              <Text style={styles.planPer}>por mês · cancela quando quiseres</Text>
            </Pressable>
          )}

          {/* Fallback quando as chaves ainda não estão configuradas */}
          {!monthly && !yearly && (
            <View style={styles.comingSoon}>
              <Ionicons name="construct-outline" size={32} color={Colors.border} />
              <Text style={styles.comingSoonText}>
                Planos disponíveis após configurar as contas App Store e Google Play.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Restore */}
      <Button
        label="Restaurar compras anteriores"
        variant="ghost"
        onPress={handleRestore}
        loading={loading}
        fullWidth
      />

      <Text style={styles.legal}>
        A subscrição renova automaticamente. Podes cancelar a qualquer momento nas definições da App Store ou Google Play. Ao subscrever, aceitas os nossos Termos de Serviço.
      </Text>
    </ScrollView>
  );
}

function getPricePerMonth(pkg: PurchasesPackage): string {
  const annual = pkg.product.price;
  const monthly = annual / 12;
  const symbol = pkg.product.currencyCode === 'EUR' ? '€' : pkg.product.currencyCode;
  return `${symbol}${monthly.toFixed(2)}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Space[12],
    paddingBottom: Space[10],
    gap: Space[5],
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: Space[2],
  },
  hero: { alignItems: 'center', gap: Space[2] },
  crown: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF8DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Space[2],
  },
  heroTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  heroSub: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  features: { gap: Space[3] },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    color: Colors.text,
    flex: 1,
  },
  plans: { gap: Space[3] },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Layout.cardPadding,
    gap: Space[1],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  planCardBest: {
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  bestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingHorizontal: Space[2],
    paddingVertical: 2,
    marginBottom: Space[1],
  },
  bestBadgeText: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.xs,
    color: Colors.onAccent,
    letterSpacing: 0.5,
  },
  planTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  planPrice: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.accent,
  },
  planPer: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  comingSoon: {
    alignItems: 'center',
    gap: Space[3],
    padding: Space[6],
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  comingSoonText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  error: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.danger,
    textAlign: 'center',
  },
  legal: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    textAlign: 'center',
    lineHeight: 16,
  },
});
