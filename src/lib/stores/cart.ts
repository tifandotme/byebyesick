import { create } from "zustand"

type State = {
  checkedItems: { [key: string]: boolean }
  setCheckedItem: (id: string, isChecked: boolean) => void
  checkAll: (isChecked: boolean) => void
}

export const useStore = create<State>((set) => ({
  checkedItems: {},
  setCheckedItem: (id, isChecked) =>
    set((state) => ({
      checkedItems: { ...state.checkedItems, [id]: isChecked },
    })),
  checkAll: (isChecked) =>
    set((state) => {
      const newCheckedItems = Object.keys(state.checkedItems).reduce(
        (result, key) => {
          result[key] = isChecked
          return result
        },
        {},
      )
      return { checkedItems: newCheckedItems }
    }),
}))
