import { Inter, JetBrains_Mono, Lora } from "next/font/google"

const fontSans = Inter({
  subsets: ["latin"],
})

const fontSerif = Lora({
  subsets: ["latin"],
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
})

export const fonts = [fontSans, fontSerif, fontMono]
