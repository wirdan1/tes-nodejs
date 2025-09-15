// app/layout.js
// https://nextjs.org/docs/app/getting-started/installation

export const metadata = {
  title: "Hookrest Api's",
  description: "Penyedia layanan rest api simple by Hookrest team!",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}