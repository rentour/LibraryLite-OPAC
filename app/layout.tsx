import type { Metadata } from "next"
import { BIZ_UDPGothic } from "next/font/google"
import "./globals.css"

const fonts = BIZ_UDPGothic({ 
  weight: ["400"],
  subsets: ["latin"]
 })

export const metadata: Metadata = {
  title: "LibraryLite 館内向けOPAC",
  description: "Your app description",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
      <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={fonts.className}>
          {children}
          <br /><br />
        <footer>
        <p className="text-center text-gray-400"><a href="https://r-sys.rentour.dev">©Rentour Systems</a> All rights reserved.</p>
        <p className="text-center text-gray-400">利用素材:フリー効果音素材 くらげ工匠 Voice By ondoku3.com</p>
        </footer>
      </body>
    </html>
  )
}