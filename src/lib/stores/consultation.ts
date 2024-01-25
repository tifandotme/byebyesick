import { create } from "zustand"
import { devtools } from "zustand/middleware"

type State = {
  countdown: number
}

type Actions = {
  updateCountdown: (num: number) => void
}

export const useStore = create<State & Actions>()(
  devtools((set) => ({
    countdown: 0,
    updateCountdown: (num) => set(() => ({ countdown: num })),
  })),
)
