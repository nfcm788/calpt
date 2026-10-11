import { create } from 'zustand';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import {
  RC_API_KEY_IOS,
  RC_API_KEY_ANDROID,
  ENTITLEMENT_PREMIUM,
  FREE_SCANS_PER_DAY,
} from '@/constants/revenue-cat';

type PremiumState = {
  isPremium: boolean;
  scansToday: number;
  packages: PurchasesPackage[];
  loading: boolean;
  error: string | null;

  // Inicializa RevenueCat (chamar uma vez no _layout raiz)
  init: (userId: string) => Promise<void>;

  // Verifica se o utilizador tem premium activo
  checkEntitlement: () => Promise<void>;

  // Carrega os pacotes de subscrição disponíveis
  loadPackages: () => Promise<void>;

  // Compra um pacote
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;

  // Restaura compras anteriores (obrigatório pela Apple)
  restore: () => Promise<boolean>;

  // Regista um scan — retorna false se limite atingido
  registerScan: () => boolean;

  canScan: () => boolean;
  scansLeft: () => number;
};

export const usePremiumStore = create<PremiumState>((set, get) => ({
  isPremium: false,
  scansToday: 0,
  packages: [],
  loading: false,
  error: null,

  init: async (userId) => {
    Purchases.setLogLevel(LOG_LEVEL.ERROR);
    const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
    await Purchases.configure({ apiKey, appUserID: userId });
    await get().checkEntitlement();
  },

  checkEntitlement: async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_PREMIUM] !== undefined;
      set({ isPremium });
    } catch {
      // Sem ligação ou chaves não configuradas — mantém estado actual
    }
  },

  loadPackages: async () => {
    set({ loading: true, error: null });
    try {
      const offerings = await Purchases.getOfferings();
      const pkgs = offerings.current?.availablePackages ?? [];
      set({ packages: pkgs, loading: false });
    } catch (e) {
      set({ error: 'Não foi possível carregar os planos.', loading: false });
    }
  },

  purchase: async (pkg) => {
    set({ loading: true, error: null });
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_PREMIUM] !== undefined;
      set({ isPremium, loading: false });
      return isPremium;
    } catch (e: any) {
      if (!e.userCancelled) {
        set({ error: 'Pagamento não concluído. Tenta novamente.', loading: false });
      } else {
        set({ loading: false });
      }
      return false;
    }
  },

  restore: async () => {
    set({ loading: true, error: null });
    try {
      const customerInfo = await Purchases.restoreCustomerInfo();
      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_PREMIUM] !== undefined;
      set({ isPremium, loading: false });
      return isPremium;
    } catch {
      set({ error: 'Não foi possível restaurar as compras.', loading: false });
      return false;
    }
  },

  registerScan: () => {
    const { isPremium, scansToday } = get();
    if (isPremium) return true;
    if (scansToday >= FREE_SCANS_PER_DAY) return false;
    set({ scansToday: scansToday + 1 });
    return true;
  },

  canScan: () => {
    const { isPremium, scansToday } = get();
    return isPremium || scansToday < FREE_SCANS_PER_DAY;
  },

  scansLeft: () => {
    const { isPremium, scansToday } = get();
    if (isPremium) return Infinity;
    return Math.max(FREE_SCANS_PER_DAY - scansToday, 0);
  },
}));
