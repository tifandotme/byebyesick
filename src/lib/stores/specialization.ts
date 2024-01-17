import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

import type { Specialization } from "@/types/api"

type State = {
  isHydrating: boolean
  specialization: Specialization[] | null
}

type Actions = {
  updateSpecialization: (specialization: Specialization[]) => void
}

export const useStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        isHydrating: true,
        specialization: null,
        updateSpecialization: (specialization) =>
          set(() => ({ specialization })),
      }),
      {
        name: "specializationFormState",
        partialize: (state) => ({
          specialization: state.specialization,
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
