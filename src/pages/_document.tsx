import { Head, Html, Main, NextScript } from "next/document"

import { fonts } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={cn(
          fonts.map((font) => font.variable),
          "font-sans",
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
