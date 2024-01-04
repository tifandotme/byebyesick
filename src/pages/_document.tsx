import { Head, Html, Main, NextScript } from "next/document"

import { fonts } from "@/lib/fonts"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={fonts.map((font) => font.className).join(" ")}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
