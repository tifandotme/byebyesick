import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

import type { City, Province } from "@/types/rajaongkir"

type State = {
  isHydrating: boolean
  provinceId: string | null
  opensAt: string | null
  provinces: Province[] | null
  cities: City[] | null
}

type Actions = {
  updateProvinceId: (id: string | null) => void
  updateOpensAt: (opensAt: string | null) => void
  updateProvinces: (provinces: Province[]) => void
  updateCities: (cities: City[]) => void
}

export const useStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        isHydrating: true,
        provinceId: null,
        opensAt: null,
        provinces: null,
        cities: null,

        updateProvinceId: (provinceId) => set(() => ({ provinceId })),
        updateOpensAt: (opensAt) => set(() => ({ opensAt })),
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
