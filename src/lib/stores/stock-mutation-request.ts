import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { PharmacyProductRequest } from "@/types/api"

type State = {
  pharmacyProduct: PharmacyProductRequest | null
}

type Actions = {
  updatePharmacyProduct: (pharmacyProduct: PharmacyProductRequest) => void
}

export const useStore = create<State & Actions>()(
  devtools(
    (set) => ({
      pharmacyProduct: null,

      updatePharmacyProduct: (pharmacyProduct) =>
        set(() => ({ pharmacyProduct })),
    }),
    {
      name: "stockMutationFormState",
    },
  ),
)
