import { useEffect } from "react"

export default function Loader() {
  useEffect(() => {
    async function getLoader() {
      const { cardio } = await import("ldrs")
      cardio.register()
    }
    getLoader()
  }, [])
  return <l-cardio color="coral"></l-cardio>
}
