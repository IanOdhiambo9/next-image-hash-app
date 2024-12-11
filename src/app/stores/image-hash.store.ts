import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TImageHashStore = {
  adjustedImageHash: string;
  adjustedImageUrl: string;
  setAdjustedImage: (adjustedImageUrl: string, adjustedImageHash: string ) => void;
};

export const useImageHashStore = create<TImageHashStore>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, get) => ({
      adjustedImageHash: '',
      adjustedImageUrl: '',
      setAdjustedImage: (adjustedImageUrl: string, adjustedImageHash: string ) => 
                          set({ adjustedImageUrl, adjustedImageHash }),
    }),
    {
      name: 'image-hash-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
