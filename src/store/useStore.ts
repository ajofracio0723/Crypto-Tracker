import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Coin } from '../types';

interface StoreActions {
  setCoins: (coins: Coin[]) => void;
  addToFavorites: (coin: Coin) => void;
  removeFromFavorites: (coinId: string) => void;
  toggleFavorite: (coin: Coin) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

type Store = AppState & StoreActions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Initial state
      coins: [],
      favorites: [],
      isLoading: false,
      error: null,
      theme: 'dark',

      // Actions
      setCoins: (coins) => set({ coins }),
      
      addToFavorites: (coin) => {
        const { favorites } = get();
        if (!favorites.some(fav => fav.id === coin.id)) {
          set({ favorites: [...favorites, coin] });
        }
      },
      
      removeFromFavorites: (coinId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(fav => fav.id !== coinId) });
      },
      
      toggleFavorite: (coin) => {
        const { favorites } = get();
        const isFavorite = favorites.some(fav => fav.id === coin.id);
        
        if (isFavorite) {
          set({ favorites: favorites.filter(fav => fav.id !== coin.id) });
        } else {
          set({ favorites: [...favorites, coin] });
        }
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      toggleTheme: () => {
        const { theme } = get();
        set({ theme: theme === 'dark' ? 'light' : 'dark' });
      },
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'crypto-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        theme: state.theme,
      }),
    }
  )
);
