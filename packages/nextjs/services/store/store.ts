import create from "zustand";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type TGlobalState = {
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  setPushNotificationSubscription: (subscription: PushSubscription | null) => void;
  pushNotificationSubscription: PushSubscription | null;
};

export const useGlobalState = create<TGlobalState>(set => ({
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
  setPushNotificationSubscription: (subscription: PushSubscription | null): void =>
    set(() => ({ pushNotificationSubscription: subscription })),
  pushNotificationSubscription: null,
}));

export type TWalletScreens = "main" | "send" | "receive" | "collectibles" | "mint" | "history";

export type TScreenPayload = {
  toAddress?: string;
  nftId?: string;
};

type TAppStore = {
  ethPrice: number;
  setEthPrice: (newEthPriceState: number) => void;
  isQrReaderOpen: boolean;
  setIsQrReaderOpen: (newValue: boolean) => void;
  screen: TWalletScreens;
  setScreen: (newValue: TWalletScreens, payload?: TScreenPayload | null) => void;
  screenPayload: TScreenPayload | null | undefined;
};

export const useAppStore = create<TAppStore>(set => ({
  ethPrice: 1,
  setEthPrice: (newValue: number): void => set(() => ({ ethPrice: newValue })),
  isQrReaderOpen: false,
  setIsQrReaderOpen: (newValue: boolean): void => set(() => ({ isQrReaderOpen: newValue })),
  screen: "main",
  setScreen: (newValue: TWalletScreens, payload: TScreenPayload | null | undefined): void =>
    set(() => ({ screen: newValue, screenPayload: payload })),
  screenPayload: null,
}));
