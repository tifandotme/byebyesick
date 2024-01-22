import { create, type StateCreator } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type Store = {
  selectedAddress: string | null
  setSelectedAddress: (id: string | null) => void
}

const addressSlice: StateCreator<Store, [["zustand/persist", unknown]]> = (
  set,
) => ({
  selectedAddress: null,
  setSelectedAddress: (id) => set({ selectedAddress: id }),
})

export const useAddressStore = create<Store>()(
  persist(addressSlice, {
    name: "address-store",
    storage: createJSONStorage(() => sessionStorage),
  }),
)
