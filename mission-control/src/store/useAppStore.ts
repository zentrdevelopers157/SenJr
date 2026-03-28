import { create } from 'zustand';

interface AppState {
  currentMainProductIndex: number;
  cartItemCount: number;
  isGoldenMenuOpen: boolean;
  selectedCategory: string;
  scrollProgress: number;
  equippedClothes: string[]; // Array of GLB URLs
  activeDressIndex: number; // 1 to 5
  isPageThreeActive: boolean;
  setCurrentMainProductIndex: (index: number) => void;
  setSelectedCategory: (category: string) => void;
  setCartItemCount: (count: number) => void;
  toggleGoldenMenu: () => void;
  setScrollProgress: (progress: number) => void;
  equipClothing: (url: string) => void;
  unequipClothing: (url: string) => void;
  setActiveDressIndex: (index: number) => void;
  setPageThreeActive: (active: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentMainProductIndex: 0,
  cartItemCount: 0,
  isGoldenMenuOpen: false,
  selectedCategory: 'All',
  scrollProgress: 0,
  equippedClothes: [],
  activeDressIndex: 1,
  isPageThreeActive: false,
  setCurrentMainProductIndex: (index) => set({ currentMainProductIndex: index }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setCartItemCount: (count) => set({ cartItemCount: count }),
  toggleGoldenMenu: () => set((state) => ({ isGoldenMenuOpen: !state.isGoldenMenuOpen })),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  equipClothing: (url) => set((state) => ({ 
    equippedClothes: [...state.equippedClothes, url] 
  })),
  unequipClothing: (url) => set((state) => ({ 
    equippedClothes: state.equippedClothes.filter((item) => item !== url) 
  })),
  setActiveDressIndex: (index) => set({ activeDressIndex: index }),
  setPageThreeActive: (active) => set({ isPageThreeActive: active }),
}));
