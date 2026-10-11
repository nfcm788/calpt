import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { MacroChip } from '@/components/ui/MacroChip';
import { useDiaryStore } from '@/store/diary';
import * as api from '@/lib/fake-data';
import { Colors, FontFamily, FontSize, Layout, Radius, Shadow, Space } from '@/constants/tokens';

type Phase = 'camera' | 'analysing' | 'confirm';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('camera');
  const cameraRef = useRef<CameraView>(null);

  const { pendingScan, setPendingScan, clearPendingScan, addMeal } = useDiaryStore();

  useEffect(() => {
    return () => clearPendingScan();
  }, []);

  async function handleCapture() {
    if (!cameraRef.current) return;
    setPhase('analysing');
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.6 });
      const result = await api.analyzePhoto(photo?.base64 ?? '');
      setPendingScan(result, photo?.uri ?? '');
      setPhase('confirm');
    } catch {
      Alert.alert('Erro', 'Não foi possível analisar a fotografia. Tenta novamente.');
      setPhase('camera');
    }
  }

  async function handleConfirm() {
    if (!pendingScan) return;
    await addMeal('lunch', pendingScan.items.map(i => ({
      name: i.nomePt,
      quantityG: i.quantidadeG,
      calories: i.calorias,
      proteinG: i.proteinaG,
      carbsG: i.hidratosG,
      fatG: i.gorduraG,
      fiberG: 0,
      scanMethod: 'photo' as const,
      aiConfidenceScore: i.confianca,
      imageUrl: null,
    })));
    router.back();
  }

  if (!permission) return <View style={styles.screen} />;

  if (!permission.granted) {
    return (
      <View style={styles.screen}>
        <View style={styles.permissionBox}>
          <Ionicons name="camera-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.permissionTitle}>Acesso à câmara necessário</Text>
          <Text style={styles.permissionText}>
            O CalPT precisa da câmara para identificar os teus alimentos.
          </Text>
          <Button label="Permitir câmara" onPress={requestPermission} fullWidth />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Close button */}
      <Pressable
        style={styles.closeBtn}
        onPress={() => router.back()}
        accessibilityLabel="Fechar"
        accessibilityRole="button"
      >
        <Ionicons name="close" size={24} color="#fff" />
      </Pressable>


      {phase === 'camera' && (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing="back">
            {/* Viewfinder overlay */}
            <View style={styles.overlay}>
              <View style={styles.viewfinder} />
              <Text style={styles.hint}>Aponta para o teu prato</Text>
            </View>
          </CameraView>
          <View style={styles.controls}>
            <Pressable
              style={({ pressed }) => [styles.shutterBtn, pressed && { opacity: 0.8 }]}
              onPress={handleCapture}
              accessibilityLabel="Fotografar"
              accessibilityRole="button"
            >
              <View style={styles.shutterInner} />
            </Pressable>
          </View>
        </>
      )}

      {phase === 'analysing' && (
        <View style={styles.analysingBox}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.analysingText}>A analisar o prato com IA…</Text>
        </View>
      )}

      {phase === 'confirm' && pendingScan && (
        <ScrollView style={styles.confirmSheet} contentContainerStyle={styles.confirmContent}>
          <Text style={styles.confirmTitle}>Identificámos o seguinte</Text>

          {pendingScan.items.map((item, i) => (
            <View key={i} style={styles.itemCard}>
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>{item.nomePt}</Text>
                <Text style={styles.itemQty}>{item.quantidadeG}g</Text>
              </View>
              <Text style={styles.itemCalories}>{item.calorias} kcal</Text>
              <View style={styles.chips}>
                <MacroChip macro="protein" value={item.proteinaG} />
                <MacroChip macro="carbs"   value={item.hidratosG} />
                <MacroChip macro="fat"     value={item.gorduraG} />
              </View>
              <Text style={styles.confidence}>
                Confiança: {Math.round(item.confianca * 100)}%
              </Text>
            </View>
          ))}

          <View style={styles.confirmActions}>
            <Button label="Adicionar ao diário" onPress={handleConfirm} fullWidth size="lg" />
            <Button
              label="Repetir"
              variant="secondary"
              onPress={() => { clearPendingScan(); setPhase('camera'); }}
              fullWidth
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  closeBtn: {
    position: 'absolute',
    top: Space[12],
    right: Space[4],
    zIndex: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: Radius.pill,
  },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space[4],
  },
  viewfinder: {
    width: 260,
    height: 260,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  hint: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  controls: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  shutterBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  analysingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space[4],
    backgroundColor: Colors.bg,
  },
  analysingText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  confirmSheet: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  confirmContent: {
    padding: Layout.screenPaddingH,
    paddingTop: Space[16],
    gap: Space[4],
  },
  confirmTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Layout.cardPadding,
    gap: Space[2],
    ...Shadow.card,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.md,
    color: Colors.text,
    flex: 1,
  },
  itemQty: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  itemCalories: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.lg,
    color: Colors.accent,
  },
  chips: { flexDirection: 'row', gap: Space[2] },
  confidence: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
  },
  confirmActions: { gap: Space[3], marginTop: Space[2] },
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space[4],
    paddingHorizontal: Layout.screenPaddingH,
    backgroundColor: Colors.bg,
  },
  permissionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.lg,
    color: Colors.text,
    textAlign: 'center',
  },
  permissionText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
