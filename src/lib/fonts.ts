import { JetBrains_Mono, Nunito, Plus_Jakarta_Sans } from "next/font/google"

const fontSans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
})

export const fonts = [fontSans, fontMono, fontDisplay] as const
