import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

import type { City, Province } from "@/types/api"

type State = {
  isHydrating: boolean
  provinces: Province[] | null
  cities: City[] | null
}

type Actions = {
  updateProvinces: (provinces: Province[]) => void
  updateCities: (cities: City[]) => void
}

export const useStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        isHydrating: true as boolean,
        provinces: null,
        cities: null,

        updateProvinces: (provinces) => set(() => ({ provinces })),
        updateCities: (cities) => set(() => ({ cities })),
      }),
      {
        name: "pharmaciesFormState",
        partialize: (state) => ({
          provinces: state.provinces,
          cities: state.cities,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.isHydrating = false
          }
        },
        skipHydration: true,
      },
    ),
  ),
)
