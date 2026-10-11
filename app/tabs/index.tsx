import { useEffect } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MacroRing } from '@/components/ui/MacroRing';
import { Shimmer } from '@/components/ui/Shimmer';
import { useDiaryStore } from '@/store/diary';
import { useAuthStore } from '@/store/auth';
import { Colors, FontFamily, FontSize, Layout, Radius, Shadow, Space } from '@/constants/tokens';

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Pequeno-almoço',
  lunch: 'Almoço',
  dinner: 'Jantar',
  snack: 'Lanche',
};

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function HomeScreen() {
  const user = useAuthStore(s => s.user);
  const { meals, streak, loading, fetchDay, fetchStreak, totalCalories, totalProtein, totalCarbs, totalFat } = useDiaryStore();

  useEffect(() => {
    fetchDay(today());
    fetchStreak();
  }, []);

  const caloriesTarget = user?.dailyCaloriesTarget ?? 2000;
  const cal = totalCalories();
  const calPercent = Math.min(cal / caloriesTarget, 1);
  const calLeft = Math.max(caloriesTarget - cal, 0);

  async function onRefresh() {
    await Promise.all([fetchDay(today()), fetchStreak()]);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={Colors.accent} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá{user?.name ? `, ${user.name}` : ''} 👋</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        {streak && streak.currentStreak > 0 ? (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={14} color={Colors.streak} />
            <Text style={styles.streakText}>{streak.currentStreak}</Text>
          </View>
        ) : null}
      </View>

      {/* Calorie card */}
      <View style={styles.calorieCard}>
        <View style={styles.calorieInfo}>
          <Text style={styles.calorieValue}>{Math.round(cal)}</Text>
          <Text style={styles.calorieLabel}>kcal consumidas</Text>
          <Text style={styles.calorieLeft}>{calLeft} kcal restantes</Text>
        </View>
        <View style={styles.calorieBar}>
          <View style={[styles.calorieBarFill, { width: `${calPercent * 100}%` }]} />
        </View>

        {/* Macro rings */}
        <View style={styles.macros}>
          <MacroRing macro="protein" value={totalProtein()} target={user?.proteinG ?? 120} size="md" />
          <MacroRing macro="carbs"   value={totalCarbs()}   target={user?.carbsG ?? 250}   size="md" />
          <MacroRing macro="fat"     value={totalFat()}     target={user?.fatG ?? 65}       size="md" />
        </View>
      </View>

      {/* Scan FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => router.push('/scan')}
        accessibilityLabel="Fotografar refeição"
        accessibilityRole="button"
      >
        <Ionicons name="camera" size={22} color={Colors.onAccent} />
        <Text style={styles.fabLabel}>Fotografar refeição</Text>
      </Pressable>

      {/* Meals list */}
      <Text style={styles.sectionTitle}>Refeições de hoje</Text>

      {loading && meals.length === 0 ? (
        <>
          <Shimmer style={styles.shimmerCard} />
          <Shimmer style={styles.shimmerCard} />
        </>
      ) : meals.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="restaurant-outline" size={40} color={Colors.border} />
          <Text style={styles.emptyText}>Ainda sem refeições registadas hoje.</Text>
          <Text style={styles.emptySubtext}>Usa o botão acima para fotografar o teu prato.</Text>
        </View>
      ) : (
        meals.map(meal => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealType}>{MEAL_LABELS[meal.mealType] ?? meal.mealType}</Text>
              <Text style={styles.mealCal}>{Math.round(meal.totalCalories)} kcal</Text>
            </View>
            {meal.items.map(item => (
              <View key={item.id} style={styles.mealItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.quantityG}g</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Space[12],
    paddingBottom: Space[10],
    gap: Space[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  date: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.streakLight,
    paddingHorizontal: Space[2],
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  streakText: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.sm,
    color: Colors.streak,
  },
  calorieCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Layout.cardPadding,
    gap: Space[4],
    ...Shadow.card,
  },
  calorieInfo: { gap: 2 },
  calorieValue: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  calorieLabel: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  calorieLeft: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    color: Colors.accent,
  },
  calorieBar: {
    height: 6,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  calorieBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space[2],
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    height: Layout.fabSize,
    paddingHorizontal: Space[6],
    ...Shadow.pop,
  },
  fabLabel: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.base,
    color: Colors.onAccent,
  },
  sectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.md,
    color: Colors.text,
    marginTop: Space[2],
  },
  shimmerCard: {
    height: 80,
    borderRadius: Radius.lg,
  },
  empty: {
    alignItems: 'center',
    gap: Space[2],
    paddingVertical: Space[8],
  },
  emptyText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Layout.cardPadding,
    gap: Space[2],
    ...Shadow.card,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealType: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  mealCal: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    color: Colors.accent,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    flex: 1,
  },
  itemQty: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
});
