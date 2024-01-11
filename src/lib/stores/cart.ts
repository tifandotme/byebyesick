import { create } from "zustand"

import type { ICart } from "@/types/api"

interface CartCheckState {
  selectedCard: number[]
}

export const useCartCheckStore = create<CartCheckState>((set) => ({
  selectedCard: [],
}))

export const useCartActions = () => {
  const toggledCheckoutCard = (id: number) => {
    useCartCheckStore.setState((state) => {
      const selectedCard = state.selectedCard.includes(id)
        ? state.selectedCard.filter((i) => i !== id)
        : [...state.selectedCard, id]

      return { selectedCard }
    })
  }
}
